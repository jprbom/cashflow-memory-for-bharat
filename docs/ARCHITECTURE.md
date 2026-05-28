# Architecture

Cashflow Memory for Bharat uses a split React and Express architecture with a public-safe payment ecosystem simulator feeding synthetic merchant cashflow memory.

## Components

- React dashboard: RBAC role switcher, KPI cards, command panels, tables, CRUD actions, credit-readiness view, and Payment Ecosystem Timeline.
- Express API: health, metrics, CRUD, credit-readiness scoring, signed demo auth, payment lifecycle, webhooks, refund, dispute, and reconciliation endpoints.
- RBAC middleware: signed local demo bearer tokens and role-to-permission mapping.
- JSON persistence: deterministic synthetic DB file for local demos.
- Domain engine: cashflow stability, consent status, payer concentration, and lender/borrower reason-code simulator.
- Payment ecosystem simulator: PG, PA, TPAP, PSP/bank, and NPCI-style rail adapters with settlement events for cashflow memory.
- AIML/DL artifacts: 10,000-row synthetic training harness with model card, metrics, and feature importance.

## Runtime Ports

- Backend: 4103
- Frontend dev server: 5173
- Frontend preview server: 5103

