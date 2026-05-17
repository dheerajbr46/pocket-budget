import { useEffect, useState } from 'react';
import {
  addTransaction,
  clearTransactions,
  createTransaction,
  deleteTransaction,
  duplicateTransaction,
  generateRecurringTransactions,
  getInitialTransactions,
  persistTransactions,
  updateTransaction
} from '../services/transactionService.js';

export function useTransactions() {
  const [transactions, setTransactions] = useState(getInitialTransactions);

  useEffect(() => {
    const processedTransactions = generateRecurringTransactions(transactions);
    const didChange = JSON.stringify(processedTransactions) !== JSON.stringify(transactions);

    if (didChange) {
      setTransactions(processedTransactions);
      return;
    }

    persistTransactions(transactions);
  }, [transactions]);

  function createAndAddTransaction(formValues) {
    const transaction = createTransaction(formValues);
    setTransactions((currentTransactions) => addTransaction(currentTransactions, transaction));
    return transaction;
  }

  function removeTransaction(transactionId) {
    setTransactions((currentTransactions) => deleteTransaction(currentTransactions, transactionId));
  }

  function replaceTransaction(updatedTransaction) {
    setTransactions((currentTransactions) => updateTransaction(currentTransactions, updatedTransaction));
  }

  function copyTransaction(transaction) {
    setTransactions((currentTransactions) => duplicateTransaction(currentTransactions, transaction));
  }

  function importTransactions(importedTransactions) {
    setTransactions(generateRecurringTransactions(importedTransactions));
  }

  function clearAllTransactions() {
    clearTransactions();
    setTransactions([]);
  }

  return {
    addTransaction: createAndAddTransaction,
    clearTransactions: clearAllTransactions,
    deleteTransaction: removeTransaction,
    duplicateTransaction: copyTransaction,
    importTransactions,
    transactions,
    updateTransaction: replaceTransaction
  };
}
