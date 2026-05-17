# Pocket Budget

Pocket Budget is a local-first personal budgeting web app built with React, Vite, Tailwind CSS, and LocalStorage. It is designed to feel like a polished fintech mobile app: calm, fast, private, and useful without requiring an account or backend.

The product focuses on everyday money awareness: quick transaction entry, transaction management, budget goals, category drilldowns, recurring transactions, lightweight rule-based smart insights, and interactive spending charts.

## Features

- Responsive layout: mobile phone-card on small screens, full sidebar layout on desktop; in-app toggle between modes
- Dashboard with animated balance, 7-day spending chart, financial health summary, upcoming recurring payments, recent activity, and top category bars
- Quick Add bottom sheet for fast transaction capture
- Full Add Transaction flow with recurring transaction support
- Transaction Center with search, filters, date ranges, friendly grouping, inline edit, and delete
- Reports with 30-day spending trend (area chart), weekly and monthly summaries, category donut charts, and breakdown bars
- Category drilldowns with 30-day spending bar chart, trend card, and transaction history
- Budget goals with horizontal utilization chart, health badges, progress bars, and insights
- Rule-based Smart Insights with no AI or external API dependency
- Settings with currency preference, JSON export, CSV export, JSON import, and data clearing
- Dark mode following OS preference (`prefers-color-scheme`)
- Installable PWA with offline caching and web manifest

## Tech Stack

- React 18
- Vite
- Tailwind CSS 3.4
- Framer Motion 12 (animations, layout transitions, spring physics)
- Recharts 3 (AreaChart, BarChart, PieChart)
- Phosphor Icons
- Plus Jakarta Sans Variable font
- vite-plugin-pwa (service worker, web manifest)
- Browser LocalStorage
- No backend
- No authentication
- No external API integrations
- No LLM or AI API calls

## Architecture Overview

The app is organized for future growth rather than as a single demo file. UI, business rules, persistence, and product features are separated into small modules.

```text
src/
  components/
    cards/          Reusable finance cards and transaction UI
    charts/         Recharts chart components (trend, donut, bar)
    feedback/       Toasts, skeletons, success messages
    forms/          Transaction inputs and reusable form controls
    modals/         Budget and edit modal surfaces
    navigation/     App shell, header, bottom navigation
    ui/             Base primitives: Button, Card, EmptyState, Modal
  constants/        Categories, transaction types, recurrence types, motion tokens
  context/          CurrencyContext — app-wide currency setting
  data/             Navigation config and mock starter data
  hooks/            Stateful feature hooks
  pages/            Dashboard, Activity, Add Transaction, Reports, Budgets, Settings, CategoryDetail
  services/         Transaction, recurring, budget, report, and insight services
  styles/           Global CSS, keyframe animations, dark mode variables
  utils/            Currency, dates, recurrence, storage, reports, budgets, insights, transactions
```

## Local-First Philosophy

Pocket Budget stores data in the browser using LocalStorage. This keeps the app fast, private, and easy to run locally.

There is no backend because the app does not need one for its core experience. Transactions, budget goals, currency settings, and recurring transaction state are all handled locally. JSON and CSV export provide data portability without an account.

## Smart Insights

Smart Insights are deterministic and rule-based. They inspect local transactions, budget goals, reports, and recurring transactions to surface short, friendly messages.

Examples:

- Upcoming rent due in 3 days
- 3 recurring payments this week
- Subscriptions total $48/month
- Groceries budget is nearing its limit
- Nice work, monthly savings are positive

No AI APIs or LLMs are used. This keeps the feature private, predictable, offline-friendly, and inexpensive to run.

## Recurring Transactions

Recurring transactions let users mark income or expenses as repeating weekly, biweekly, monthly, or yearly. A dedicated recurring service processes local schedules when the app loads and whenever transactions change. It creates only missing due entries, preserves the original template transaction, and links generated entries back to their recurring series.

The recurring engine supports:

- Upcoming payment timeline previews
- Auto-generated missing entries in a bounded rolling window
- Monthly date edge cases such as January 31 to February 28
- LocalStorage migration from earlier recurrence fields
- Forecast-ready `nextOccurrenceDate` values
- Duplicate prevention by recurring series and date

Generation lifecycle:

1. Transactions load from LocalStorage or mock starter data.
2. Existing recurring records are migrated into the current model.
3. Recurring templates are scanned for missing valid occurrences.
4. Missing entries are generated with fresh ids, created timestamps, and `generatedFromRecurringId`.
5. The resulting list is persisted back to LocalStorage and used by dashboard, reports, budgets, insights, and activity.

Recurring transaction fields include `isRecurring`, `recurrenceFrequency`, `recurrenceStartDate`, `recurrenceEndDate`, `nextOccurrenceDate`, `lastGeneratedDate`, `generatedFromRecurringId`, and `recurringSeriesId`.

## Charts

All charts are built with Recharts and styled to match the app's fintech aesthetic:

| Component | Type | Location |
|---|---|---|
| `SpendingTrendChart` | AreaChart (30-day income vs expenses) | Reports |
| `CategoryDonutChart` | PieChart donut with legend | Reports — each period section |
| `WeeklyBarChart` | BarChart (7-day expenses) | Dashboard |
| `BudgetComparisonChart` | Horizontal BarChart (% utilization) | Budgets |
| `CategorySpendingChart` | BarChart (30-day category spending) | Category Detail |

All charts include custom-styled tooltips, empty states, and responsive containers.

## Dark Mode

The app responds to `prefers-color-scheme: dark` automatically — no toggle required. Implementation uses:

- CSS custom properties (`--color-ink`, `--color-paper`, `--app-bg`) that invert in dark mode
- Tailwind `darkMode: 'media'` with `dark:` variants on structural surfaces (sidebar, nav, header, cards)

## PWA

The app is installable as a progressive web app on mobile and desktop. Built with `vite-plugin-pwa`:

- Service worker with `generateSW` strategy precaches all assets
- Web manifest with app name, theme colors, and display mode
- `autoUpdate` registration — users get the latest version on next load

## How To Run Locally

```bash
npm install        # Install dependencies
npm run dev        # Start dev server
npm run build      # Production build (also generates SW + manifest)
npm run preview    # Preview production build locally
```

## Design

Pocket Budget targets a premium fintech aesthetic — clean, legible, and fast:

- **Font**: Plus Jakarta Sans Variable
- **Icons**: Phosphor Icons (weight="fill" for active states, "regular" for inactive)
- **Animations**: Framer Motion — spring layout transitions in nav, page fades, count-up balance, staggered list entry
- **Colors**: `indigo` (#4f46e5) · `mint` (#14b8a6) · `coral` (#fb7185) · `ink` (auto-inverts in dark mode)
- **Motion**: respects `prefers-reduced-motion`

## Why No Backend Or LLM

The current product goal is private, local-first budgeting. A backend adds account, sync, security, and hosting concerns before they are necessary. An LLM adds cost, privacy, and reliability tradeoffs for insights that can be generated with transparent local rules.

The architecture leaves room for both, but the product is stronger today by staying simple and trustworthy.

## Future Roadmap

- Cloud sync as an optional user-controlled feature
- Multi-device sync
- Recurring notifications
- Recurring calendar view
- Recurring transaction edit modes (this occurrence vs entire series)
- Merchant recognition and auto-categorization
- Swipe actions for edit/delete
- Shared expenses and Splitwise-style flows
- Financial goals and savings targets
- Daily financial score and spending mood indicator
- Personalized insight thresholds
- Optional AI-generated explanations behind a privacy-first settings layer
