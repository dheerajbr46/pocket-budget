import { areValidBudgetGoals } from '../utils/budgets/index.js';
import { areValidSavingsGoals } from '../utils/savings/index.js';
import { areValidTransactions } from '../utils/storage/index.js';
import { migrateBackupPayload } from './migrationService.js';
import { STORAGE_SCHEMA_VERSION } from './storageService.js';

const supportedCurrencies = ['USD', 'EUR', 'GBP', 'INR', 'CAD'];

export function createBackupPayload({
  budgets = [],
  currency = 'USD',
  goals = [],
  transactions = []
}) {
  return {
    app: 'Pocket Budget',
    exportedAt: new Date().toISOString(),
    schemaVersion: STORAGE_SCHEMA_VERSION,
    settings: {
      currency
    },
    data: {
      budgets,
      goals,
      transactions
    }
  };
}

export function getBackupSummary(payload) {
  const data = payload?.data ?? {};
  const transactions = data.transactions ?? [];

  return {
    budgetsCount: data.budgets?.length ?? 0,
    goalsCount: data.goals?.length ?? 0,
    recurringCount: transactions.filter((transaction) => transaction.isRecurring).length,
    transactionsCount: transactions.length
  };
}

export function validateBackupPayload(rawPayload) {
  const migration = migrateBackupPayload(rawPayload);

  if (migration.error) {
    return {
      error: migration.error,
      payload: null,
      summary: null
    };
  }

  const payload = migration.payload;
  const data = payload.data;

  if (!data || typeof data !== 'object') {
    return {
      error: 'Backup file is invalid.',
      payload: null,
      summary: null
    };
  }

  if (!areValidTransactions(data.transactions ?? [])) {
    return {
      error: 'Backup file has invalid transactions.',
      payload: null,
      summary: null
    };
  }

  if (!areValidBudgetGoals(data.budgets ?? [])) {
    return {
      error: 'Backup file has invalid budgets.',
      payload: null,
      summary: null
    };
  }

  if (!areValidSavingsGoals(data.goals ?? [])) {
    return {
      error: 'Backup file has invalid goals.',
      payload: null,
      summary: null
    };
  }

  const currency = payload.settings?.currency ?? 'USD';

  if (!supportedCurrencies.includes(currency)) {
    return {
      error: 'Backup file has an unsupported currency setting.',
      payload: null,
      summary: null
    };
  }

  return {
    error: null,
    payload,
    summary: getBackupSummary(payload)
  };
}

export function downloadBackup(payload) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: 'application/json'
  });
  const downloadUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = downloadUrl;
  link.download = `pocket-budget-backup-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(downloadUrl);
}

// TODO: Add encrypted backups and cloud backup adapters once users can opt in.
