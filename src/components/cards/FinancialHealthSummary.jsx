import { XCircle } from '@phosphor-icons/react';
import { Card } from '../ui/Card.jsx';
import { CollapsibleInsightGroup } from './CollapsibleInsightGroup.jsx';

function groupInsights(insights) {
  return {
    danger: insights.filter((insight) => insight.type === 'danger'),
    good: insights.filter((insight) => insight.type === 'positive' || insight.type === 'neutral'),
    warning: insights.filter((insight) => insight.type === 'warning')
  };
}

export function FinancialHealthSummary({ insights = [], title = 'Financial Health' }) {
  const groups = groupInsights(insights);
  const hasInsights = insights.length > 0;
  const singleCriticalInsight = groups.danger.length === 1 && insights.length === 1;

  if (!hasInsights) {
    return (
      <Card className="bg-teal-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-teal-500">Local rules</p>
        <h2 className="mt-1 text-lg font-bold text-teal-950">{title}</h2>
        <p className="mt-2 text-sm font-semibold text-teal-700">Everything looks healthy today.</p>
      </Card>
    );
  }

  if (singleCriticalInsight) {
    const insight = groups.danger[0];

    return (
      <Card className="bg-rose-50 p-4">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-white text-coral">
            <XCircle size={18} />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-rose-400">Needs Attention (1)</p>
            <p className="mt-1 truncate text-sm font-bold text-rose-950">{insight.message}</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <section className="space-y-3">
      <div className="px-1">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Local rules</p>
        <h2 className="text-lg font-bold">{title}</h2>
      </div>

      <div className="space-y-3 rounded-[26px] border border-white bg-white/55 p-3 shadow-sm">
        <CollapsibleInsightGroup
          defaultOpen={groups.danger.length > 0}
          emptyMessage="No budgets need attention."
          insights={groups.danger}
          title="Needs Attention"
          tone="danger"
        />
        <CollapsibleInsightGroup
          defaultOpen={groups.warning.length > 0}
          emptyMessage="Nothing needs close watching."
          insights={groups.warning}
          title="Watch Closely"
          tone="warning"
        />
        <CollapsibleInsightGroup
          defaultOpen={false}
          emptyMessage="Everything looks healthy today."
          insights={groups.good}
          title="Looking Good"
          tone="good"
        />
      </div>

      {/* TODO: Add a daily financial score, spending mood indicator, adaptive insight ranking, and personalized recommendations. */}
    </section>
  );
}
