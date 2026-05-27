<p align="center">
  <img src="frontend/public/logo.svg" width="96" alt="Cashflow Memory for Bharat logo">
</p>

# Cashflow Memory for Bharat

Explainable UPI and AA cashflow memory for credit-readiness coaching of thin-file Bharat merchants.

Author: Prashant Jagtap <jprbom@gmail.com>

## Portfolio Positioning

A consent-first cashflow memory and credit-readiness engine that turns synthetic UPI/AA transaction behavior into explainable lender reason codes and borrower coaching actions.

This repo uses synthetic UPI-style data only. It is designed as an India-scale payment AI infrastructure prototype, not as a production integration with NPCI, PSPs, banks, account aggregators, or live UPI rails.

## Highlights

- TypeScript Express backend with RBAC, Helmet, CORS controls, rate limiting, Zod validation, and JSON persistence.
- React and Vite frontend with role-aware operations dashboard, animated KPI panels, CRUD controls, and model explanation surface.
- Domain engine endpoint at /api/credit-readiness.
- DB-backed CRUD for merchant profiles and cashflow entries.
- Documentation set covering SDLC, API, security, testing, deployment, and diagrams.
- Mermaid diagrams for architecture, DFD, deployment, integration, API flow, and RBAC.

## Run Locally

~~~bash
npm install
npm run dev:backend
npm run dev:frontend
~~~

Backend: http://127.0.0.1:4103

Frontend: http://127.0.0.1:5173

## Verify

~~~bash
npm run build
npm run test
npm run audit:high
~~~

## Repo Name

cashflow-memory-for-bharat

