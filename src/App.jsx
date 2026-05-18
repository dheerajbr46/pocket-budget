import { useEffect, useMemo, useState } from 'react';
import { AppShell } from './components/navigation/AppShell.jsx';
import { AddTransaction } from './pages/AddTransaction/index.jsx';
import { Dashboard } from './pages/Dashboard/index.jsx';
import { Activity } from './pages/Activity/index.jsx';
import { Reports } from './pages/Reports/index.jsx';
import { Settings } from './pages/Settings/index.jsx';
import { CategoryDetail } from './pages/CategoryDetail/index.jsx';
import { QuickAddTransactionSheet } from './components/forms/QuickAddTransactionSheet.jsx';
import { TransactionDetailSheet } from './components/cards/TransactionDetailSheet.jsx';
import { Toast } from './components/feedback/Toast.jsx';
import { CurrencyProvider } from './context/CurrencyContext.jsx';
import { navItems } from './data/navigation.js';
import { useTransactions } from './hooks/useTransactions.js';
import { useBudgetGoals } from './hooks/useBudgetGoals.js';
import { useTheme } from './hooks/useTheme.js';
import { Budgets } from './pages/Budgets/index.jsx';
import { getSmartInsights } from './services/insightService.js';
import {
  getStoredCurrency,
  saveStoredCurrency
} from './utils/storage/index.js';

export default function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [categoryPeriod, setCategoryPeriod] = useState('month');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [selectedTransactionId, setSelectedTransactionId] = useState(null);
  const [pendingEditTransactionId, setPendingEditTransactionId] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [currency, setCurrency] = useState(getStoredCurrency);
  const { theme, setTheme } = useTheme();
  const [saveMessage, setSaveMessage] = useState('');
  const {
    addTransaction,
    clearTransactions,
    deleteTransaction,
    duplicateTransaction,
    importTransactions,
    transactions,
    updateTransaction
  } = useTransactions();
  const {
    budgetOverview,
    budgets,
    clearBudgetGoals,
    deleteBudgetGoal,
    saveBudgetGoal,
    updateBudgetGoal
  } = useBudgetGoals(transactions);

  useEffect(() => {
    saveStoredCurrency(currency);
  }, [currency]);

  useEffect(() => {
    if (!toastMessage) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => setToastMessage(''), 2600);
    return () => window.clearTimeout(timeoutId);
  }, [toastMessage]);

  function handleAddTransaction(transaction, options = {}) {
    const { returnToDashboard = true } = options;

    addTransaction(transaction);
    setSaveMessage('Transaction saved');
    setToastMessage('Transaction saved');

    if (returnToDashboard) {
      setActivePage('dashboard');
    }
  }

  function handleDeleteTransaction(transactionId) {
    deleteTransaction(transactionId);
    if (selectedTransactionId === transactionId) {
      setSelectedTransactionId(null);
    }
  }

  function handleUpdateTransaction(updatedTransaction) {
    updateTransaction(updatedTransaction);
  }

  function handleSelectTransaction(transaction) {
    setSelectedTransactionId(transaction.id);
  }

  function handleDeleteSelectedTransaction(transactionId) {
    deleteTransaction(transactionId);
    setSelectedTransactionId(null);
    setToastMessage('Transaction deleted');
  }

  function handleDuplicateTransaction(transaction) {
    duplicateTransaction(transaction);
    setSelectedTransactionId(null);
    setToastMessage('Transaction duplicated');
  }

  function handleEditSelectedTransaction(transaction) {
    setPendingEditTransactionId(transaction.id);
    setSelectedTransactionId(null);
    setActivePage('transactions');
  }

  function handleImportTransactions(importedTransactions) {
    importTransactions(importedTransactions);
    setSaveMessage('Data imported');
    setToastMessage('Data imported');
    setActivePage('dashboard');
  }

  function handleClearTransactions() {
    clearTransactions();
    clearBudgetGoals();
    setSaveMessage('All data cleared');
    setToastMessage('All data cleared');
    setActivePage('dashboard');
  }

  function handleNavigate(page) {
    if (page === 'add') {
      setIsQuickAddOpen(true);
      return;
    }

    if (page !== 'dashboard') {
      setSaveMessage('');
    }

    setActivePage(page);
  }

  function handleCategorySelect(category) {
    setSelectedCategory(category);
    setCategoryPeriod('month');
    setSaveMessage('');
    setActivePage('categoryDetail');
  }

  const activeNavItem = useMemo(
    () => navItems.find((item) => item.id === activePage) ?? navItems[0],
    [activePage]
  );
  const smartInsights = useMemo(
    () => getSmartInsights({ budgetOverview, transactions, limit: 4 }),
    [budgetOverview, transactions]
  );
  const selectedTransaction = useMemo(
    () => transactions.find((transaction) => transaction.id === selectedTransactionId) ?? null,
    [selectedTransactionId, transactions]
  );

  const pages = {
    dashboard: (
      <Dashboard
        saveMessage={saveMessage}
        insights={smartInsights.slice(0, 3)}
        transactions={transactions}
        onCategorySelect={handleCategorySelect}
        onNavigate={handleNavigate}
        onTransactionSelect={handleSelectTransaction}
      />
    ),
    add: <AddTransaction onSave={handleAddTransaction} />,
    transactions: (
      <Activity
        transactions={transactions}
        onDeleteTransaction={handleDeleteTransaction}
        onEditHandled={() => setPendingEditTransactionId(null)}
        onTransactionSelect={handleSelectTransaction}
        onUpdateTransaction={handleUpdateTransaction}
        pendingEditTransactionId={pendingEditTransactionId}
      />
    ),
    reports: (
      <Reports
        insights={smartInsights}
        transactions={transactions}
        onCategorySelect={handleCategorySelect}
      />
    ),
    budgets: (
      <Budgets
        budgetOverview={budgetOverview}
        budgets={budgets}
        insights={smartInsights}
        onDeleteBudget={deleteBudgetGoal}
        onSaveBudget={saveBudgetGoal}
        onUpdateBudget={updateBudgetGoal}
      />
    ),
    categoryDetail: (
      <CategoryDetail
        category={selectedCategory}
        period={categoryPeriod}
        transactions={transactions}
        onBack={() => setActivePage('reports')}
        onPeriodChange={setCategoryPeriod}
      />
    ),
    settings: (
      <Settings
        currency={currency}
        theme={theme}
        transactions={transactions}
        onClearTransactions={handleClearTransactions}
        onCurrencyChange={setCurrency}
        onImportTransactions={handleImportTransactions}
        onThemeChange={setTheme}
      />
    )
  };

  return (
    <CurrencyProvider currency={currency}>
      <AppShell
        activePage={activePage}
        currentTitle={activePage === 'categoryDetail' ? 'Category Detail' : activeNavItem.title}
        onNavigate={handleNavigate}
      >
        {pages[activePage]}
      </AppShell>
      <QuickAddTransactionSheet
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        onSave={(transaction) => handleAddTransaction(transaction, { returnToDashboard: false })}
      />
      <TransactionDetailSheet
        budgetOverview={budgetOverview}
        isOpen={Boolean(selectedTransaction)}
        onClose={() => setSelectedTransactionId(null)}
        onDelete={handleDeleteSelectedTransaction}
        onDuplicate={handleDuplicateTransaction}
        onEdit={handleEditSelectedTransaction}
        transaction={selectedTransaction}
      />
      <Toast message={toastMessage} onClose={() => setToastMessage('')} />
    </CurrencyProvider>
  );
}
