import { useRef, useState } from 'react';
import {
  Bell,
  ChevronDown,
  Cloud,
  Download,
  FileUp,
  Moon,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Trash2,
  WalletCards
} from 'lucide-react';
import { pressableStyles } from '../../constants/motion.js';
import { createBackupPayload, downloadBackup, validateBackupPayload } from '../../services/backupService.js';
import { Button } from '../../components/ui/Button.jsx';
import { Card } from '../../components/ui/Card.jsx';
import { SelectSheet } from '../../components/ui/SelectSheet.jsx';
import { BottomSheet } from '../../components/ui/BottomSheet.jsx';

const APP_NAME = 'Pocket Budget';
const APP_VERSION = '0.1.0';
const currencies = [
  { code: 'USD', label: 'US Dollar' },
  { code: 'EUR', label: 'Euro' },
  { code: 'GBP', label: 'British Pound' },
  { code: 'INR', label: 'Indian Rupee' },
  { code: 'CAD', label: 'Canadian Dollar' }
];

export function Settings({
  budgets = [],
  currency,
  goals = [],
  onClearTransactions,
  onCurrencyChange,
  onFeedback,
  onImportAppData,
  transactions
}) {
  const fileInputRef = useRef(null);
  const [clearStep, setClearStep] = useState(0);
  const [importPreview, setImportPreview] = useState(null);
  const [isCurrencySheetOpen, setIsCurrencySheetOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const currencyOptions = currencies.map((item) => ({
    label: `${item.code} - ${item.label}`,
    value: item.code
  }));
  const activeCurrencyLabel = currencyOptions.find((option) => option.value === currency)?.label ?? currency;

  function notify(message) {
    setStatusMessage(message);
    onFeedback?.(message);
  }

  function handleExportData() {
    downloadBackup(
      createBackupPayload({
        budgets,
        currency,
        goals,
        transactions
      })
    );
    notify('Export ready.');
  }

  function handleImportData(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      try {
        const parsedData = JSON.parse(reader.result);
        const validation = validateBackupPayload(parsedData);

        if (validation.error) {
          notify(validation.error);
          return;
        }

        setImportPreview(validation);
      } catch (error) {
        console.warn('Unable to import budget data.', error);
        notify('Backup file is invalid.');
      } finally {
        event.target.value = '';
      }
    };

    reader.readAsText(file);
  }

  function confirmImport() {
    onImportAppData(importPreview.payload);
    setImportPreview(null);
  }

  function handleClearData() {
    if (clearStep < 2) {
      setClearStep((currentStep) => currentStep + 1);
      notify(clearStep === 0 ? 'Review the warning, then confirm again.' : 'Tap once more to clear all local data.');
      return;
    }

    onClearTransactions();
    setClearStep(0);
  }

  return (
    <div className="space-y-5 animate-page-in">
      <Card className="bg-ink text-white">
        <div className="flex items-center gap-4">
          <span className="grid h-14 w-14 place-items-center rounded-3xl bg-white/10">
            <WalletCards size={24} />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/55">Settings</p>
            <h2 className="mt-1 text-2xl font-bold">{APP_NAME}</h2>
            <p className="mt-1 text-sm text-white/65">Calm financial awareness, stored locally.</p>
          </div>
        </div>
      </Card>

      <SettingsSection title="Preferences">
        <SettingsRow
          icon={WalletCards}
          label="Default currency"
          meta={activeCurrencyLabel}
          onClick={() => setIsCurrencySheetOpen(true)}
          trailing={<ChevronDown size={18} className="text-slate-400" />}
        />
        <SettingsRow disabled icon={Moon} label="Dark mode" meta="Coming later" />
        <SettingsRow disabled icon={Sparkles} label="Reduce animations" meta="Coming later" />
        <SelectSheet
          isOpen={isCurrencySheetOpen}
          onClose={() => setIsCurrencySheetOpen(false)}
          onSelect={(nextCurrency) => {
            onCurrencyChange(nextCurrency);
            notify('Currency setting saved.');
          }}
          value={currency}
          options={currencyOptions}
          title="Choose currency"
        />
        {/* TODO: Add a future theming system and connect reduce animations to app-level motion preferences. */}
      </SettingsSection>

      <SettingsSection title="Data & Backup">
        <SettingsRow icon={Download} label="Export data" meta="Save a JSON backup" onClick={handleExportData} />
        <SettingsRow icon={FileUp} label="Import data" meta="Preview before replacing" onClick={() => fileInputRef.current?.click()} />
        <SettingsRow
          danger
          icon={Trash2}
          label={clearStep === 0 ? 'Clear all data' : clearStep === 1 ? 'Confirm clear data' : 'Final confirmation'}
          meta="This removes all locally stored app data."
          onClick={handleClearData}
        />
        <input
          ref={fileInputRef}
          accept="application/json,.json"
          className="hidden"
          onChange={handleImportData}
          type="file"
        />

        {statusMessage ? (
          <p className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-600">
            {statusMessage}
          </p>
        ) : null}
      </SettingsSection>

      <Card className="bg-teal-50 p-4">
        <div className="flex gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white text-mint">
            <ShieldCheck size={19} />
          </span>
          <div>
            <p className="text-sm font-bold text-teal-950">Stored on this device</p>
            <p className="mt-2 text-sm leading-6 text-teal-700">
              Pocket Budget currently stores your information only in this browser. Export a backup anytime.
            </p>
          </div>
        </div>
      </Card>

      <SettingsSection title="Notifications">
        <SettingsRow disabled icon={Bell} label="Recurring reminders" meta="Coming later" trailing={<DisabledToggle />} />
        <SettingsRow disabled icon={RotateCcw} label="Weekly review reminders" meta="Coming later" trailing={<DisabledToggle />} />
        <SettingsRow disabled icon={ShieldCheck} label="Budget alerts" meta="Coming later" trailing={<DisabledToggle />} />
        {/* TODO: Add browser notifications, mobile push notifications, and weekend review reminders. */}
      </SettingsSection>

      <SettingsSection title="About">
        <SettingsRow icon={WalletCards} label={APP_NAME} meta={`Version ${APP_VERSION}`} />
        <SettingsRow icon={ShieldCheck} label="Local-first privacy" meta="Built with local-first privacy in mind." />
        <SettingsRow disabled icon={Cloud} label="Sync and native apps" meta="Future roadmap" />
        {/* TODO: Add sync, cloud backup, and native apps when users can opt in. */}
      </SettingsSection>

      <ImportPreviewSheet
        importPreview={importPreview}
        onCancel={() => setImportPreview(null)}
        onConfirm={confirmImport}
      />

      {/* TODO: Add screen reader audit coverage and reduced-motion preference persistence. */}
    </div>
  );
}

function SettingsSection({ children, title }) {
  return (
    <section className="space-y-3">
      <h2 className="px-1 text-lg font-bold">{title}</h2>
      <Card className="space-y-2 bg-white/80 p-3">{children}</Card>
    </section>
  );
}

function SettingsRow({ danger = false, disabled = false, icon: Icon, label, meta, onClick, trailing }) {
  const RowElement = onClick && !disabled ? 'button' : 'div';
  const rowProps = RowElement === 'button'
    ? { disabled, onClick, type: 'button' }
    : {};

  return (
    <RowElement
      {...rowProps}
      className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left outline-none focus-visible:ring-2 focus-visible:ring-mint/40 ${
        disabled ? 'opacity-55' : pressableStyles
      } ${danger ? 'bg-rose-50 text-coral' : 'bg-slate-50 text-ink'}`}
      aria-disabled={disabled || undefined}
    >
      <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-white ${
        danger ? 'text-coral' : 'text-slate-500'
      }`}>
        <Icon size={18} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-bold">{label}</span>
        <span className={`mt-1 block truncate text-xs font-semibold ${danger ? 'text-rose-500' : 'text-slate-400'}`}>
          {meta}
        </span>
      </span>
      {trailing}
    </RowElement>
  );
}

function DisabledToggle() {
  return (
    <span className="h-7 w-12 rounded-full bg-slate-200 p-1" aria-hidden="true">
      <span className="block h-5 w-5 rounded-full bg-white shadow-sm" />
    </span>
  );
}

function ImportPreviewSheet({ importPreview, onCancel, onConfirm }) {
  const summary = importPreview?.summary;

  return (
    <BottomSheet isOpen={Boolean(importPreview)} onClose={onCancel} title="Import backup?">
      {summary ? (
        <div className="mt-4 space-y-4">
          <p className="text-sm leading-6 text-slate-500">
            This will replace local Pocket Budget data with the selected backup.
          </p>
          <div className="grid grid-cols-3 gap-2">
            <PreviewMetric label="Transactions" value={summary.transactionsCount} />
            <PreviewMetric label="Budgets" value={summary.budgetsCount} />
            <PreviewMetric label="Goals" value={summary.goalsCount} />
          </div>
          <PreviewMetric label="Recurring" value={`${summary.recurringCount} recurring transactions`} wide />
          <div className="grid grid-cols-2 gap-2">
            <Button onClick={onCancel} className="h-12 rounded-2xl bg-slate-100 font-bold text-slate-600">
              Cancel
            </Button>
            <button type="button" onClick={onConfirm} className="h-12 rounded-2xl bg-ink font-bold text-white">
              Import
            </button>
          </div>
        </div>
      ) : null}
    </BottomSheet>
  );
}

function PreviewMetric({ label, value, wide = false }) {
  return (
    <div className={`rounded-2xl bg-slate-50 p-3 ${wide ? 'text-center' : ''}`}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">{label}</p>
      <p className="mt-2 truncate text-sm font-bold text-ink">{value}</p>
    </div>
  );
}
