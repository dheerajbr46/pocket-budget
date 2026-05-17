# Pocket Budget

Pocket Budget is a local-first personal budgeting web app built with React, Vite, Tailwind CSS, and LocalStorage. It is designed to feel like a polished mobile finance app: calm, fast, private, and useful without requiring an account or backend.

The product focuses on everyday money awareness: quick transaction entry, transaction management, budget goals, category drilldowns, recurring transactions, and lightweight rule-based smart insights.

## Features

- Mobile-first app shell with bottom navigation
- Dashboard with total balance, financial health, recent activity, upcoming recurring payments, top categories, and weekly/monthly analytics
- Quick Add bottom sheet for fast transaction capture
- Full Add Transaction flow with recurring transaction support
- Transaction Center with search, filters, date ranges, friendly grouping, edit, and delete
- LocalStorage persistence with invalid data handling
- Reports with weekly/monthly summaries and category breakdowns
- Category drilldowns with trends, summaries, and transaction history
- Budget goals with health states, progress bars, and insights
- Rule-based Smart Insights with no AI or external API dependency
- Settings with currency preference, JSON export/import, and data clearing

## Screenshots

Add screenshots here as the product evolves.

- Dashboard
- Quick Add
- Transaction Center
- Reports
- Budgets
- Settings

## Tech Stack

- React
- Vite
- Tailwind CSS
- Lucide React icons
- Browser LocalStorage
- No backend
- No authentication
- No ads
- No external API integrations
- No LLM or AI API calls

## Architecture Overview

The app is organized for future growth rather than as a single demo file. UI, business rules, persistence, and product features are separated into small modules.

```text
src/
  components/
    cards/          Reusable finance cards and transaction UI
    feedback/       Toasts, skeletons, success messages
    forms/          Transaction inputs and reusable form controls
    modals/         Budget and edit modal surfaces
    navigation/     App shell, header, bottom navigation
    ui/             Base primitives such as Button, Card, EmptyState
  constants/        Categories, transaction types, recurrence types, colors
  context/          App-level context such as currency
  data/             Mock starter data
  hooks/            Stateful feature hooks
  pages/            Dashboard, Activity, Add Transaction, Reports, Settings
  services/         Transaction, recurring, budget, report, and insight services
  utils/            Currency, dates, recurrence, storage, reports, budgets, insights, transactions
```

## Local-First Philosophy

Pocket Budget stores data in the browser using LocalStorage. This keeps the app fast, private, and easy to run locally.

There is currently no backend because the app does not need one for its core experience. Transactions, budget goals, currency settings, and recurring transaction state are all handled locally. Export and import features provide basic data portability without creating an account.

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

To avoid runaway generation, the engine only creates entries inside a reasonable rolling future window and caps each series to a maximum number of generated occurrences per processing pass.

Recurring transaction fields include:

- `isRecurring`
- `recurrenceFrequency`
- `recurrenceStartDate`
- `recurrenceEndDate`
- `nextOccurrenceDate`
- `lastGeneratedDate`
- `generatedFromRecurringId`
- `recurringSeriesId`

Generated transactions look like normal transactions in reports, budgets, and dashboards, but the detail sheet can identify them as auto-generated. This prepares the app for future editing modes such as "this occurrence only" or "entire series."

## Upcoming Timeline

The Dashboard includes an Upcoming timeline powered by the recurring service. It shows the next five recurring items grouped chronologically, with compact due-date labels, category context, frequency badges, and signed amounts. Weekly and monthly upcoming totals summarize near-term cash flow without turning the dashboard into a spreadsheet.

This is local-first automation: everything is calculated in the browser from local transaction data, with no server scheduler or external API.

## How To Run Locally

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Design Philosophy

Pocket Budget is intentionally calm and compact. The UI favors:

- Soft rounded cards
- Clear hierarchy
- Mobile-app-like navigation
- Minimal visual noise
- Fast one-tap entry
- Friendly empty states
- Subtle animation and feedback

The app is designed to feel premium without becoming visually heavy.

## Why No Backend Or LLM Yet

The current product goal is private, local-first budgeting. A backend would add account, sync, security, and hosting concerns before they are necessary. An LLM would add cost, privacy, and reliability tradeoffs for insights that can currently be generated with transparent local rules.

The architecture leaves room for both later, but the product is stronger today by staying simple and trustworthy.

## Future Roadmap

- PWA install support
- Cloud sync as an optional user-controlled feature
- Multi-device sync
- CSV export/import
- Recurring notifications
- Recurring calendar view
- Recurring forecasting
- Recurring transaction edit modes
- Merchant recognition
- Merchant auto-categorization
- Auto category detection
- Swipe actions for edit/delete
- Shared expenses and Splitwise-style flows
- Financial goals and savings goals
- Daily financial score
- Spending mood indicator
- Personalized insight thresholds
- Optional AI-generated explanations after a privacy-first settings layer exists

## Scalability Ideas

- Move LocalStorage behind a storage adapter for IndexedDB or cloud sync later
- Add a transaction repository layer for richer querying
- Expand the recurring series model for pause, skip-next, and series-wide editing
- Add test coverage around recurrence date generation and financial summary utilities
- Convert to a PWA with offline install, app icons, and native share/export flows
