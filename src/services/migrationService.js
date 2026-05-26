import { STORAGE_SCHEMA_VERSION } from './storageService.js';

export function migrateBackupPayload(payload) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return {
      error: 'Backup file is invalid.',
      payload: null
    };
  }

  const schemaVersion = payload.schemaVersion ?? (Array.isArray(payload) || Array.isArray(payload.transactions) ? 0 : null);

  if (schemaVersion === 0) {
    return {
      error: null,
      payload: {
        app: 'Pocket Budget',
        schemaVersion: STORAGE_SCHEMA_VERSION,
        settings: {
          currency: 'USD'
        },
        data: {
          budgets: [],
          goals: [],
          transactions: Array.isArray(payload) ? payload : payload.transactions
        }
      }
    };
  }

  if (schemaVersion !== STORAGE_SCHEMA_VERSION) {
    return {
      error: 'Backup version is unsupported.',
      payload: null
    };
  }

  return {
    error: null,
    payload
  };
}

// TODO: Add forward migrations for future schema versions and cloud backup formats.
