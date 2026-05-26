import { useEffect, useMemo, useState } from 'react';
import {
  addSavingsContribution,
  clearSavingsGoals,
  deleteSavingsGoal,
  getInitialSavingsGoals,
  getSavingsOverview,
  persistSavingsGoals,
  subtractSavingsContribution,
  upsertSavingsGoal
} from '../services/savingsGoalService.js';

export function useSavingsGoals() {
  const [goals, setGoals] = useState(getInitialSavingsGoals);

  useEffect(() => {
    persistSavingsGoals(goals);
  }, [goals]);

  const savingsOverview = useMemo(() => getSavingsOverview(goals), [goals]);

  function saveSavingsGoal(goalValues) {
    setGoals((currentGoals) => upsertSavingsGoal(currentGoals, goalValues));
  }

  function removeSavingsGoal(goalId) {
    setGoals((currentGoals) => deleteSavingsGoal(currentGoals, goalId));
  }

  function contributeToGoal(goalId, amount) {
    setGoals((currentGoals) => addSavingsContribution(currentGoals, goalId, amount));
  }

  function subtractFromGoal(goalId, amount) {
    setGoals((currentGoals) => subtractSavingsContribution(currentGoals, goalId, amount));
  }

  function clearAllSavingsGoals() {
    clearSavingsGoals();
    setGoals([]);
  }

  function importSavingsGoals(importedGoals) {
    setGoals(importedGoals);
  }

  return {
    addSavingsContribution: contributeToGoal,
    clearSavingsGoals: clearAllSavingsGoals,
    deleteSavingsGoal: removeSavingsGoal,
    importSavingsGoals,
    savingsGoals: goals,
    savingsOverview,
    subtractSavingsContribution: subtractFromGoal,
    upsertSavingsGoal: saveSavingsGoal
  };
}
