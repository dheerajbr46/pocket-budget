import { useEffect, useMemo, useState } from 'react';
import {
  clearBudgetGoals,
  deleteBudgetGoal,
  getBudgetOverview,
  getInitialBudgetGoals,
  persistBudgetGoals,
  updateBudgetGoal,
  upsertBudgetGoal
} from '../services/budgetService.js';

export function useBudgetGoals(transactions) {
  const [budgets, setBudgets] = useState(getInitialBudgetGoals);

  useEffect(() => {
    persistBudgetGoals(budgets);
  }, [budgets]);

  const overview = useMemo(
    () => getBudgetOverview(budgets, transactions),
    [budgets, transactions]
  );

  function saveBudgetGoal(budgetValues) {
    setBudgets((currentBudgets) => upsertBudgetGoal(currentBudgets, budgetValues));
  }

  function editBudgetGoal(updatedBudget) {
    setBudgets((currentBudgets) => updateBudgetGoal(currentBudgets, updatedBudget));
  }

  function removeBudgetGoal(budgetId) {
    setBudgets((currentBudgets) => deleteBudgetGoal(currentBudgets, budgetId));
  }

  function clearAllBudgetGoals() {
    clearBudgetGoals();
    setBudgets([]);
  }

  function importBudgetGoals(importedBudgets) {
    setBudgets(importedBudgets);
  }

  return {
    budgets,
    budgetOverview: overview,
    clearBudgetGoals: clearAllBudgetGoals,
    deleteBudgetGoal: removeBudgetGoal,
    importBudgetGoals,
    saveBudgetGoal,
    updateBudgetGoal: editBudgetGoal
  };
}
