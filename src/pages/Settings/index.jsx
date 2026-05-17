import { useRef, useState } from 'react';
import { CreditCard, DownloadSimple, FileArrowUp, ShieldCheck, Trash } from '@phosphor-icons/react';
import { Button } from '../../components/ui/Button.jsx';
import { Card } from '../../components/ui/Card.jsx';
import { areValidTransactions } from '../../utils/storage/index.js';

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
  currency,
  onClearTransactions,
  onCurrencyChange,
  onImportTransactions,
  transactions
}) {
  const fileInputRef = useRef(null);
  const [confirmClear, setConfirmClear] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  function handleExportData() {
    const exportPayload = {
      app: APP_NAME,
      version: APP_VERSION,
      exportedAt: new Date().toISOString(),
      transactions
    };
    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], {
      type: 'application/json'
    });
    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = downloadUrl;
    link.download = `pocket-budget-export-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(downloadUrl);
    setStatusMessage('Export ready.');
  }

  function handleExportCSV() {
    const headers = ['Date', 'Type', 'Category', 'Amount', 'Note', 'Recurring'];
    const rows = transactions.map((t) => [
      t.date,
      t.type,
      t.category,
      t.amount,
      `"${(t.note || '').replace(/"/g, '""')}"`,
      t.isRecurring ? 'Yes' : 'No'
    ]);
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = downloadUrl;
    link.download = `pocket-budget-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(downloadUrl);
    setStatusMessage('CSV export ready.');
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
        const importedTransactions = Array.isArray(parsedData)
          ? parsedData
          : parsedData?.transactions;

        if (!areValidTransactions(importedTransactions)) {
          setStatusMessage('Import failed. Choose a valid Pocket Budget JSON file.');
          return;
        }

        onImportTransactions(importedTransactions);
      } catch (error) {
        console.warn('Unable to import budget data.', error);
        setStatusMessage('Import failed. The selected file is not valid JSON.');
      } finally {
        event.target.value = '';
      }
    };

    reader.readAsText(file);
  }

  function handleClearData() {
    if (!confirmClear) {
      setConfirmClear(true);
      setStatusMessage('Tap Clear all data again to confirm.');
      return;
    }

    onClearTransactions();
  }

  return (
    <div className="space-y-5">
      <Card className="bg-ink text-white">
        <div className="flex items-center gap-4">
          <span className="grid h-14 w-14 place-items-center rounded-3xl bg-white/10">
            <CreditCard size={24} />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/55">App</p>
            <h2 className="mt-1 text-2xl font-bold">{APP_NAME}</h2>
            <p className="mt-1 text-sm text-white/65">Version {APP_VERSION}</p>
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="text-lg font-bold">Preferences</h2>
        <label className="mt-4 block rounded-3xl bg-slate-50 p-4">
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
            Default currency
          </span>
          <select
            className="mt-2 h-12 w-full bg-transparent text-lg font-bold text-ink outline-none"
            onChange={(event) => {
              onCurrencyChange(event.target.value);
              setStatusMessage('Currency setting saved.');
            }}
            value={currency}
          >
            {currencies.map((item) => (
              <option key={item.code} value={item.code}>
                {item.code} - {item.label}
              </option>
            ))}
          </select>
          <span className="mt-1 block text-sm text-slate-500">
            This changes how amounts are displayed across the app.
          </span>
        </label>
      </Card>

      <Card>
        <h2 className="text-lg font-bold">Data management</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Export a backup, import a previous backup, or clear this browser&apos;s budget data.
        </p>

        <div className="mt-4 space-y-3">
          <Button
            onClick={handleExportData}
            className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-slate-100 font-bold text-slate-700"
          >
            <DownloadSimple size={18} />
            Export data as JSON
          </Button>

          <Button
            onClick={handleExportCSV}
            className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-indigo/10 font-bold text-indigo"
          >
            <DownloadSimple size={18} />
            Export data as CSV
          </Button>

          <Button
            onClick={() => fileInputRef.current?.click()}
            className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-teal-50 font-bold text-mint"
          >
            <FileArrowUp size={18} />
            Import data from JSON
          </Button>

          <input
            ref={fileInputRef}
            accept="application/json,.json"
            className="hidden"
            onChange={handleImportData}
            type="file"
          />

          <Button
            onClick={handleClearData}
            className={`flex h-14 w-full items-center justify-center gap-2 rounded-2xl font-bold ${
              confirmClear ? 'bg-coral text-white' : 'bg-rose-50 text-coral'
            }`}
          >
            <Trash size={18} />
            {confirmClear ? 'Confirm clear all data' : 'Clear all data'}
          </Button>
        </div>

        {statusMessage ? (
          <p className="mt-4 rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-600">
            {statusMessage}
          </p>
        ) : null}
      </Card>

      <Card className="bg-slate-100">
        <div className="flex gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white text-slate-600">
            <ShieldCheck size={19} />
          </span>
          <div>
            <p className="text-sm font-semibold text-slate-700">Local browser storage</p>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Your budget data is stored only in this browser using LocalStorage. There is no backend account,
              cloud sync, or external API connected.
            </p>
          </div>
        </div>
      </Card>

      {/* Future extension: PWA/mobile migration can replace JSON import/export with native share sheets. */}
      {/* TODO: Add biometric lock before opening sensitive local budget data. */}
      {/* TODO: Add cloud sync, multi-device sync, and CSV export/import once users can choose portable backup workflows. */}
    </div>
  );
}
