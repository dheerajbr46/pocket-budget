import { useState } from 'react';
import { Target } from 'lucide-react';
import { CollapsibleInsightGroup } from '../../components/cards/CollapsibleInsightGroup.jsx';
import { SpendingDonutChart } from '../../components/cards/SpendingDonutChart.jsx';
import { TrendCard } from '../../components/cards/TrendCard.jsx';
import { TrendInsightModal } from '../../components/cards/TrendInsightModal.jsx';
import { Card } from '../../components/ui/Card.jsx';
import { useCurrency } from '../../context/CurrencyContext.jsx';
import { useReports } from '../../hooks/useReports.js';
import { formatCurrency } from '../../utils/currency/index.js';

export function Reports({
  budgetOverview,
  onCategorySelect,
  savingsOverview,
  transactions
}) {
  const [selectedTrend, setSelectedTrend] = useState(null);
  const {
    donutBreakdown,
    miniTrends,
    monthlySnapshot,
    reportInsights,
    weeklyAwareness
  } = useReports(transactions, budgetOverview, savingsOverview);

  return (
    <div className="space-y-5 animate-page-in">
      <MonthlySnapshot snapshot={monthlySnapshot} />

      {monthlySnapshot.transactionCount === 0 ? (
        <Card className="bg-slate-100 p-4">
          <p className="text-sm font-bold text-slate-700">No reports yet</p>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Reports appear after more activity. Add a few transactions to unlock monthly patterns.
          </p>
        </Card>
      ) : null}

      <Card className="bg-white/80 p-4">
        <SectionIntro eyebrow="Breakdown" title="Where money went" />
        <div className="mt-4">
          <SpendingDonutChart
            onCategorySelect={onCategorySelect}
            segments={donutBreakdown.segments}
            total={donutBreakdown.total}
          />
        </div>
      </Card>

      <ReportInsights insights={reportInsights} weeklyMode={weeklyAwareness.mode} />

      <GoalProgressSummary savingsOverview={savingsOverview} />

      <MiniTrendCards miniTrends={miniTrends} onSelectTrend={setSelectedTrend} />

      <TrendInsightModal
        isOpen={Boolean(selectedTrend)}
        onClose={() => setSelectedTrend(null)}
        selectedTrend={selectedTrend}
      />

      {/* TODO: Add yearly reports, export PDF/CSV, advanced trends, AI insights, predictive budgeting, and recurring spend analysis. */}
    </div>
  );
}

function MonthlySnapshot({ snapshot }) {
  const currency = useCurrency();
  const comparison = snapshot.comparison.spendingChangePercent;
  const comparisonLabel =
    comparison === 0
      ? 'Flat vs last month'
      : `${Math.abs(comparison)}% ${comparison > 0 ? 'higher' : 'lower'} spending vs last month`;

  return (
    <section className="space-y-3">
      <div className="px-1">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Monthly Snapshot</p>
        <h2 className="mt-1 text-2xl font-bold">This month at a glance</h2>
      </div>

      <Card className="bg-ink text-white">
        <p className="text-sm font-medium text-white/65">Net savings</p>
        <p className="mt-2 text-4xl font-bold">{formatCurrency(snapshot.summary.balance, currency)}</p>
        <p className="mt-2 text-sm text-white/65">{comparisonLabel}</p>

        <div className="mt-5 grid grid-cols-2 gap-2">
          <SnapshotMetric label="Income" value={formatCurrency(snapshot.summary.income, currency)} />
          <SnapshotMetric label="Expenses" value={formatCurrency(snapshot.summary.expenses, currency)} />
          <SnapshotMetric label="Savings rate" value={`${snapshot.savingsRate}%`} />
          <SnapshotMetric
            label="Biggest category"
            value={snapshot.topCategory?.category ?? 'None yet'}
          />
        </div>
      </Card>
    </section>
  );
}

function SnapshotMetric({ label, value }) {
  return (
    <div className="rounded-2xl bg-white/10 p-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/55">{label}</p>
      <p className="mt-2 truncate text-sm font-bold text-white">{value}</p>
    </div>
  );
}

function ReportInsights({ insights, weeklyMode }) {
  const groups = {
    danger: insights.filter((insight) => insight.type === 'danger'),
    good: insights.filter((insight) => insight.type === 'positive' || insight.type === 'neutral'),
    warning: insights.filter((insight) => insight.type === 'warning')
  };

  return (
    <section className="space-y-3">
      <SectionIntro eyebrow="Smart Insights" title="Worth noticing" />
      <p className="px-1 text-sm font-semibold text-slate-500">
        {weeklyMode === 'review'
          ? 'Weekend review adds a little more weekly context.'
          : 'Weekly signals stay light early in the week.'}
      </p>
      <div className="space-y-3 rounded-[26px] border border-white bg-white/55 p-3 shadow-sm">
        <CollapsibleInsightGroup
          defaultOpen={groups.danger.length > 0}
          emptyMessage="No overspending warnings right now."
          insights={groups.danger}
          title="Needs Attention"
          tone="danger"
        />
        <CollapsibleInsightGroup
          defaultOpen={groups.warning.length > 0}
          emptyMessage="No trends need close watching."
          insights={groups.warning}
          title="Watch Closely"
          tone="warning"
        />
        <CollapsibleInsightGroup
          defaultOpen={groups.danger.length === 0 && groups.warning.length === 0}
          emptyMessage="No report insights yet."
          insights={groups.good}
          title="Looking Good"
          tone="good"
        />
      </div>
    </section>
  );
}

function GoalProgressSummary({ savingsOverview }) {
  const currency = useCurrency();
  const activeCount = savingsOverview?.progressItems?.filter((goal) => goal.status !== 'completed').length ?? 0;
  const completedCount = savingsOverview?.completedCount ?? 0;
  const totalContributions = savingsOverview?.totalSaved ?? 0;

  return (
    <Card className="bg-white/80 p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <SectionIntro eyebrow="Goals" title="Progress summary" />
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-teal-50 text-mint">
          <Target size={18} />
        </span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <CompactMetric label="Active" value={activeCount} />
        <CompactMetric label="Done" value={completedCount} />
        <CompactMetric label="Saved" value={formatCurrency(totalContributions, currency)} />
      </div>
    </Card>
  );
}

function MiniTrendCards({ miniTrends, onSelectTrend }) {
  const trendCards = [
    {
      id: 'weekly-spending',
      label: 'Weekly spending',
      positiveWhen: 'down',
      trend: miniTrends.weeklySpending
    },
    {
      id: 'savings-trend',
      label: 'Savings trend',
      positiveWhen: 'up',
      trend: miniTrends.savingsTrend
    },
    {
      id: 'category-trend',
      label: miniTrends.categoryTrend.category,
      positiveWhen: 'down',
      trend: miniTrends.categoryTrend
    }
  ];

  return (
    <section className="space-y-3">
      <SectionIntro eyebrow="Trends" title="Small signals" />
      <div className="grid gap-3">
        {trendCards.map((card) => (
          <TrendCard
            key={card.id}
            label={card.label}
            positiveWhen={card.positiveWhen}
            trend={card.trend}
            onSelect={() => onSelectTrend(card)}
          />
        ))}
      </div>
    </section>
  );
}

function CompactMetric({ label, value }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">{label}</p>
      <p className="mt-2 truncate text-sm font-bold text-ink">{value}</p>
    </div>
  );
}

function SectionIntro({ eyebrow, title }) {
  return (
    <div className="px-1">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">{eyebrow}</p>
      <h2 className="mt-1 text-lg font-bold">{title}</h2>
    </div>
  );
}
