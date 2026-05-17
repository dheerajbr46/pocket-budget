const healthConfig = {
  critical: {
    accentClass: 'border-rose-200 ring-1 ring-rose-100',
    badgeClass: 'bg-rose-50 text-coral',
    icon: 'flame',
    label: 'Critical',
    progressClass: 'bg-coral',
    rank: 2,
    status: 'critical'
  },
  exceeded: {
    accentClass: 'border-rose-300 ring-1 ring-rose-200',
    badgeClass: 'bg-rose-100 text-coral',
    icon: 'ban',
    label: 'Over budget',
    progressClass: 'bg-coral',
    rank: 1,
    status: 'exceeded'
  },
  healthy: {
    accentClass: 'border-white',
    badgeClass: 'bg-teal-50 text-mint',
    icon: 'check',
    label: 'Healthy',
    progressClass: 'bg-mint',
    rank: 4,
    status: 'healthy'
  },
  warning: {
    accentClass: 'border-amber-100 ring-1 ring-amber-50',
    badgeClass: 'bg-amber-50 text-amber-600',
    icon: 'alert',
    label: 'Near limit',
    progressClass: 'bg-amber-400',
    rank: 3,
    status: 'warning'
  }
};

export function getBudgetHealthState(percentageUsed) {
  const progressPercentage = Math.max(0, Math.round(percentageUsed));
  let status = 'healthy';

  if (progressPercentage > 100) {
    status = 'exceeded';
  } else if (progressPercentage >= 90) {
    status = 'critical';
  } else if (progressPercentage >= 70) {
    status = 'warning';
  }

  return {
    ...healthConfig[status],
    progressPercentage
  };
}

export function getBudgetHealthRank(status) {
  return healthConfig[status]?.rank ?? healthConfig.healthy.rank;
}

// TODO: Add personalized thresholds and adaptive budgeting rules per user preference.
// TODO: Add predictive budget exhaustion and smart rollover budgets when historical data is richer.
