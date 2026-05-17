import { ArrowsClockwise, Copy, PencilSimple, Trash, X } from '@phosphor-icons/react';
import { useEffect, useState } from 'react';
import { recurrenceOptions } from '../../constants/recurrenceTypes.js';
import { useCurrency } from '../../context/CurrencyContext.jsx';
import { formatCurrency } from '../../utils/currency/index.js';
import { formatShortDate } from '../../utils/formatting/index.js';
import {
  getCategoryChipStyle,
  getNextRecurringDate,
  isRecurringRelated
} from '../../utils/transactions/index.js';
import { getFrequencyLabel } from '../../services/recurringService.js';
import { ConfirmationDialog } from '../modals/ConfirmationDialog.jsx';
import { BottomSheet } from '../ui/BottomSheet.jsx';
import { Button } from '../ui/Button.jsx';

function getRecurrenceLabel(value) {
  return recurrenceOptions.find((option) => option.id === value)?.label || getFrequencyLabel(value);
}

function getNextOccurrence(transaction) {
  if (!transaction?.isRecurring || !transaction.recurrenceFrequency) {
    return null;
  }

  if (transaction.nextOccurrenceDate) {
    return transaction.nextOccurrenceDate;
  }

  return getNextRecurringDate(
    transaction.lastGeneratedDate || transaction.date,
    transaction.recurrenceFrequency,
    transaction.recurrenceStartDate || transaction.date
  );
}

export function TransactionDetailSheet({
  budgetOverview,
  isOpen,
  onClose,
  onDelete,
  onDuplicate,
  onEdit,
  transaction
}) {
  const currency = useCurrency();
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [displayedTransaction, setDisplayedTransaction] = useState(transaction);

  useEffect(() => {
    if (transaction) {
      setDisplayedTransaction(transaction);
    }

    if (!isOpen) {
      setIsConfirmingDelete(false);
    }
  }, [isOpen, transaction]);

  if (!displayedTransaction) {
    return null;
  }

  const isIncome = displayedTransaction.type === 'income';
  const categoryChipClass = getCategoryChipStyle(displayedTransaction.type);
  const budgetImpact = budgetOverview?.progressItems?.find(
    (budget) => budget.category === displayedTransaction.category
  );
  const nextOccurrence = getNextOccurrence(displayedTransaction);

  function handleDelete() {
    onDelete(displayedTransaction.id);
    setIsConfirmingDelete(false);
  }

  return (
    <BottomSheet isOpen={isOpen && Boolean(transaction)} onClose={onClose}>
      <div className="relative">
        <Button
          aria-label="Close transaction details"
          onClick={onClose}
          className="absolute right-0 top-0 grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-slate-500"
        >
          <X size={18} />
        </Button>

        <div className="pr-12">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Transaction</p>
          <h2 className="mt-1 truncate text-2xl font-bold text-ink">
            {displayedTransaction.note || displayedTransaction.category}
          </h2>
          <p className={`mt-3 text-4xl font-bold ${isIncome ? 'text-mint' : 'text-ink'}`}>
            {isIncome ? '+' : '-'}
            {formatCurrency(displayedTransaction.amount, currency)}
          </p>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <span className={`rounded-full px-3 py-1.5 text-xs font-bold ${categoryChipClass}`}>
            {displayedTransaction.category}
          </span>
          <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold capitalize text-slate-600">
            {displayedTransaction.type}
          </span>
          {isRecurringRelated(displayedTransaction) ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-3 py-1.5 text-xs font-bold text-teal-700">
              <ArrowsClockwise size={12} />
              {displayedTransaction.generatedFromRecurringId ? 'Generated' : 'Recurring'}
            </span>
          ) : null}
        </div>

        <div className="mt-5 space-y-2">
          <DetailRow label="Date" value={formatShortDate(displayedTransaction.date)} />
          {displayedTransaction.createdAt ? (
            <DetailRow label="Created" value={formatShortDate(displayedTransaction.createdAt.slice(0, 10))} />
          ) : null}
          {isRecurringRelated(displayedTransaction) ? (
            <>
              {displayedTransaction.recurrenceFrequency ? (
                <DetailRow label="Frequency" value={getRecurrenceLabel(displayedTransaction.recurrenceFrequency)} />
              ) : null}
              {displayedTransaction.recurrenceStartDate ? (
                <DetailRow label="Recurring since" value={formatShortDate(displayedTransaction.recurrenceStartDate)} />
              ) : null}
              {nextOccurrence ? <DetailRow label="Next occurrence" value={formatShortDate(nextOccurrence)} /> : null}
              <DetailRow
                label="Auto-generated"
                value={displayedTransaction.generatedFromRecurringId ? 'Yes' : 'No'}
              />
              {displayedTransaction.generatedFromRecurringId ? (
                <DetailRow label="Generated from" value="Recurring series" />
              ) : null}
            </>
          ) : null}
        </div>

        {displayedTransaction.type === 'expense' ? (
          <div className="mt-5 rounded-3xl bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Budget impact</p>
            <p className="mt-2 text-sm font-semibold text-slate-600">
              This counts toward your {displayedTransaction.category} budget.
            </p>
            {budgetImpact ? (
              <div className="mt-3">
                <div className="mb-2 flex items-center justify-between text-xs font-bold text-slate-500">
                  <span>{budgetImpact.percentageUsed}% used</span>
                  <span>{formatCurrency(budgetImpact.remainingAmount, currency)} remaining</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-white">
                  <div
                    className="h-full rounded-full bg-mint transition-all duration-700 ease-out"
                    style={{ width: `${Math.min(100, Math.max(4, budgetImpact.percentageUsed))}%` }}
                  />
                </div>
              </div>
            ) : (
              <p className="mt-2 text-sm font-semibold text-slate-400">
                No category budget is set yet.
              </p>
            )}
          </div>
        ) : null}

        <div className="mt-5 grid grid-cols-3 gap-2">
          <ActionButton icon={PencilSimple} label="Edit" onClick={() => onEdit(displayedTransaction)} />
          <ActionButton icon={Copy} label="Duplicate" onClick={() => onDuplicate(displayedTransaction)} />
          <ActionButton
            icon={Trash}
            label="Delete"
            onClick={() => setIsConfirmingDelete(true)}
            tone="danger"
          />
        </div>

        <ConfirmationDialog
          confirmLabel="Delete"
          isOpen={isConfirmingDelete}
          message="This transaction will be removed from your local budget history."
          onCancel={() => setIsConfirmingDelete(false)}
          onConfirm={handleDelete}
          title="Delete transaction?"
        />

        {/* TODO: Add edit single occurrence vs entire recurring series, pause recurring transaction, and skip next occurrence. */}
        {/* TODO: Add receipt attachments, split expense from transaction, merchant detection, and recurring transaction series management. */}
      </div>
    </BottomSheet>
  );
}

export function DetailRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 px-4 py-3">
      <span className="text-sm font-semibold text-slate-400">{label}</span>
      <span className="truncate text-right text-sm font-bold text-ink">{value}</span>
    </div>
  );
}

export function ActionButton({ icon: Icon, label, onClick, tone = 'neutral' }) {
  const className =
    tone === 'danger'
      ? 'bg-rose-50 text-coral'
      : 'bg-slate-100 text-slate-600';

  return (
    <Button
      onClick={onClick}
      className={`flex h-14 flex-col items-center justify-center gap-1 rounded-2xl text-xs font-bold ${className}`}
    >
      <Icon size={17} />
      {label}
    </Button>
  );
}
