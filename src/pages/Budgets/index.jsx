import { Plus } from 'lucide-react';
import { BudgetCard } from '../../components/cards/BudgetCard.jsx';
import { FinancialHealthSummary } from '../../components/cards/FinancialHealthSummary.jsx';
import { BudgetEditModal } from '../../components/modals/BudgetEditModal.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Card } from '../../components/ui/Card.jsx';
import { EmptyState } from '../../components/ui/EmptyState.jsx';
import { useCurrency } from '../../context/CurrencyContext.jsx';
import { formatCurrency } from '../../utils/currency/index.js';
import { useState } from 'react';

export function Budgets({
  budgetOverview,
  budgets,
  insights = [],
  onDeleteBudget,
  onSaveBudget,
  onUpdateBudget
}) {
  const currency = useCurrency();
  const [editingBudget, setEditingBudget] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const existingCategories = budgets.map((budget) => budget.category);

  function handleNewBudget() {
    setEditingBudget(null);
    setIsModalOpen(true);
  }

  function handleEditBudget(budget) {
    setEditingBudget(budget);
    setIsModalOpen(true);
  }

  function handleSaveBudget(budgetValues) {
    if (editingBudget) {
      onUpdateBudget(budgetValues);
    } else {
      onSaveBudget(budgetValues);
    }

    setIsModalOpen(false);
    setEditingBudget(null);
  }

  return (
    <div className="space-y-5">
      <Card className="bg-ink text-white">
        <p className="text-sm font-medium text-white/65">Monthly budget overview</p>
        <p className="mt-2 text-4xl font-bold">{formatCurrency(budgetOverview.totalBudgeted, currency)}</p>
        <p className="mt-2 text-sm text-white/65">Across {budgets.length} category goals</p>

        <div className="mt-5 grid grid-cols-2 gap-2">
          <OverviewMetric label="Spent" value={formatCurrency(budgetOverview.totalSpent, currency)} />
          <OverviewMetric
            label={budgetOverview.totalRemaining < 0 ? 'Over by' : 'Remaining'}
            value={formatCurrency(Math.abs(budgetOverview.totalRemaining), currency)}
          />
        </div>
      </Card>

      <Button
        onClick={handleNewBudget}
        className="flex h-14 w-full items-center justify-center gap-2 rounded-3xl bg-mint text-base font-bold text-white shadow-lg shadow-teal-100"
      >
        <Plus size={20} />
        Add Budget Goal
      </Button>

      <FinancialHealthSummary insights={insights} title="Budget Health" />

      <section className="space-y-3">
        <div className="px-1">
          <h2 className="text-lg font-bold">Category budgets</h2>
          <p className="mt-1 text-sm leading-6 text-slate-500">
            Track month-to-date spending against each category goal.
          </p>
        </div>

        {budgetOverview.progressItems.length > 0 ? (
          <div className="space-y-3">
            {budgetOverview.progressItems.map((budget) => (
              <BudgetCard
                key={budget.id}
                budget={budget}
                onDelete={onDeleteBudget}
                onEdit={handleEditBudget}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No budget goals yet"
            description="Create a monthly category budget to start tracking progress."
            actionLabel="Create your first budget"
            onAction={handleNewBudget}
          />
        )}
      </section>

      <BudgetEditModal
        budget={editingBudget}
        existingCategories={existingCategories}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingBudget(null);
        }}
        onSave={handleSaveBudget}
      />

      {/* Future extension: savings goals integration can live beside category budgets here. */}
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
