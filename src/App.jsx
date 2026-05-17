import { useEffect, useMemo, useState } from 'react';
import { AppShell } from './components/AppShell.jsx';
import { AddTransaction } from './pages/AddTransaction.jsx';
import { Dashboard } from './pages/Dashboard.jsx';
import { Reports } from './pages/Reports.jsx';
import { Settings } from './pages/Settings.jsx';
import { Transactions } from './pages/Transactions.jsx';
import { CurrencyProvider } from './context/CurrencyContext.jsx';
import { mockTransactions } from './data/mockTransactions.js';
import { navItems } from './data/navigation.js';
import {
  clearStoredTransactions,
  getStoredCurrency,
  getStoredTransactions,
  saveStoredCurrency,
  saveStoredTransactions
} from './utils/storage.js';

function getInitialTransactions() {
  return getStoredTransactions() ?? mockTransactions;
}

export default function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [transactions, setTransactions] = useState(getInitialTransactions);
  const [currency, setCurrency] = useState(getStoredCurrency);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    saveStoredTransactions(transactions);
  }, [transactions]);

  useEffect(() => {
    saveStoredCurrency(currency);
  }, [currency]);

  function handleAddTransaction(transaction) {
    setTransactions((currentTransactions) => [transaction, ...currentTransactions]);
    setSaveMessage('Transaction saved');
    setActivePage('dashboard');
  }

  function handleDeleteTransaction(transactionId) {
    setTransactions((currentTransactions) =>
      currentTransactions.filter((transaction) => transaction.id !== transactionId)
    );
  }

  function handleUpdateTransaction(updatedTransaction) {
    setTransactions((currentTransactions) =>
      currentTransactions.map((transaction) =>
        transaction.id === updatedTransaction.id ? updatedTransaction : transaction
      )
    );
  }

  function handleImportTransactions(importedTransactions) {
    setTransactions(importedTransactions);
    setSaveMessage('Data imported');
    setActivePage('dashboard');
  }

  function handleClearTransactions() {
    clearStoredTransactions();
    setTransactions([]);
    setSaveMessage('All data cleared');
    setActivePage('dashboard');
  }

  function handleNavigate(page) {
    if (page !== 'dashboard') {
      setSaveMessage('');
    }

    setActivePage(page);
  }

  const activeNavItem = useMemo(
    () => navItems.find((item) => item.id === activePage) ?? navItems[0],
    [activePage]
  );

  const pages = {
    dashboard: (
      <Dashboard
        saveMessage={saveMessage}
        transactions={transactions}
        onNavigate={handleNavigate}
      />
    ),
    add: <AddTransaction onSave={handleAddTransaction} />,
    transactions: (
      <Transactions
        transactions={transactions}
        onDeleteTransaction={handleDeleteTransaction}
        onUpdateTransaction={handleUpdateTransaction}
      />
    ),
    reports: <Reports transactions={transactions} />,
    settings: (
      <Settings
        currency={currency}
        transactions={transactions}
        onClearTransactions={handleClearTransactions}
        onCurrencyChange={setCurrency}
        onImportTransactions={handleImportTransactions}
      />
    )
  };

  return (
    <CurrencyProvider currency={currency}>
      <AppShell
        activePage={activePage}
        currentTitle={activeNavItem.title}
        onNavigate={handleNavigate}
      >
        {pages[activePage]}
      </AppShell>
    </CurrencyProvider>
  );
}
