import { useState } from 'react';
import { Plus, Target } from 'lucide-react';
import { GoalCard } from '../../components/cards/GoalCard.jsx';
import { FinancialHealthSummary } from '../../components/cards/FinancialHealthSummary.jsx';
import { GoalContributionSheet } from '../../components/forms/GoalContributionSheet.jsx';
import { GoalEditSheet } from '../../components/forms/GoalEditSheet.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Card } from '../../components/ui/Card.jsx';
import { EmptyState } from '../../components/ui/EmptyState.jsx';
import { useCurrency } from '../../context/CurrencyContext.jsx';
import { formatCurrency } from '../../utils/currency/index.js';
import { formatShortDate } from '../../utils/formatting/index.js';

export function Savings({
  goals,
  insights = [],
  onAddContribution,
  onDeleteGoal,
  onSaveGoal,
  onSubtractContribution,
  savingsOverview
}) {
  const currency = useCurrency();
  const [editingGoal, setEditingGoal] = useState(null);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [contributionGoal, setContributionGoal] = useState(null);
  const [contributionMode, setContributionMode] = useState('add');

  function handleNewGoal() {
    setEditingGoal(null);
    setIsEditSheetOpen(true);
  }

  function handleEditGoal(goal) {
    setEditingGoal(goal);
    setIsEditSheetOpen(true);
  }

  function handleSaveGoal(goalValues) {
    onSaveGoal(goalValues);
    setEditingGoal(null);
    setIsEditSheetOpen(false);
  }

  function openContribution(goal, mode) {
    setContributionGoal(goal);
    setContributionMode(mode);
  }

  function handleContribution(goalId, amount) {
    if (contributionMode === 'subtract') {
      onSubtractContribution(goalId, amount);
    } else {
      onAddContribution(goalId, amount);
    }

    setContributionGoal(null);
  }

  return (
    <div className="space-y-5">
      <Card className="bg-ink text-white">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-white/65">Savings goals</p>
            <p className="mt-2 text-4xl font-bold">{formatCurrency(savingsOverview.totalSaved, currency)}</p>
            <p className="mt-2 text-sm text-white/65">
              {formatCurrency(savingsOverview.totalRemaining, currency)} remaining across {goals.length} goals
            </p>
          </div>
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-3xl bg-white/10">
            <Target size={22} />
          </span>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2">
          <OverviewMetric label="Completed" value={`${savingsOverview.completedCount}`} />
          <OverviewMetric
            label="Nearest"
            value={savingsOverview.nearestDeadline?.targetDate ? formatShortDate(savingsOverview.nearestDeadline.targetDate) : 'No date'}
          />
        </div>
      </Card>

      <Button
        onClick={handleNewGoal}
        className="flex h-14 w-full items-center justify-center gap-2 rounded-3xl bg-mint text-base font-bold text-white shadow-lg shadow-teal-100"
      >
        <Plus size={20} />
        Add Savings Goal
      </Button>

      <FinancialHealthSummary insights={insights} title="Goal Insights" />

      <section className="space-y-3">
        <div className="px-1">
          <h2 className="text-lg font-bold">Your goals</h2>
          <p className="mt-1 text-sm leading-6 text-slate-500">
            Track progress toward the things you are setting money aside for.
          </p>
        </div>

        {savingsOverview.progressItems.length > 0 ? (
          <div className="space-y-3">
            {savingsOverview.progressItems.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onContribute={(selectedGoal) => openContribution(selectedGoal, 'add')}
                onDelete={onDeleteGoal}
                onEdit={handleEditGoal}
                onSubtract={(selectedGoal) => openContribution(selectedGoal, 'subtract')}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No savings goals yet"
            description="Create a goal for an emergency fund, vacation, or any future purchase."
            actionLabel="Start a savings goal"
            onAction={handleNewGoal}
          />
        )}
      </section>

      <GoalEditSheet
        goal={editingGoal}
        isOpen={isEditSheetOpen}
        onClose={() => {
          setEditingGoal(null);
          setIsEditSheetOpen(false);
        }}
        onSave={handleSaveGoal}
      />

      <GoalContributionSheet
        goal={contributionGoal}
        isOpen={Boolean(contributionGoal)}
        mode={contributionMode}
        onClose={() => setContributionGoal(null)}
        onSave={handleContribution}
      />

      {/* TODO: Add shared savings goals, goal reminders, and splitwise/shared expense integration. */}
    </div>
  );
}

function OverviewMetric({ label, value }) {
  return (
    <div className="rounded-2xl bg-white/10 p-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/55">{label}</p>
      <p className="mt-2 truncate text-sm font-bold text-white">{value}</p>
    </div>
  );
}
