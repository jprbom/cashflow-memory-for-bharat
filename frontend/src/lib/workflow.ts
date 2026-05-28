export type MockScenario = 'HAPPY_PATH' | 'DEGRADED_BANK' | 'BANK_TIMEOUT' | 'RISK_HOLD' | 'STEP_UP';

export type WorkflowTab = {
  id: string;
  label: string;
  description: string;
  cta: string;
  drillDown: string;
  apiFlow: string;
  mockScenario: MockScenario;
};

export const workflowTabs: WorkflowTab[] = [
  {
    "id": "overview",
    "label": "Credit Memory",
    "description": "Longitudinal cashflow identity for thin-file merchants.",
    "cta": "Open Merchant Memory",
    "drillDown": "View score movement, consent, and inflow stability.",
    "apiFlow": "GET /metrics -> portfolio readiness",
    "mockScenario": "HAPPY_PATH"
  },
  {
    "id": "profiles",
    "label": "Merchant Profiles",
    "description": "Consent-aware borrower and merchant records.",
    "cta": "Create Test Profile",
    "drillDown": "Open profile drill-down and readiness action.",
    "apiFlow": "CRUD /profiles",
    "mockScenario": "HAPPY_PATH"
  },
  {
    "id": "cashflow",
    "label": "Cashflow Ledger",
    "description": "UPI/AA/GST style inflow and outflow evidence.",
    "cta": "Review Cashflow Entry",
    "drillDown": "Trace transaction category and seasonality.",
    "apiFlow": "CRUD /cashflow-entries",
    "mockScenario": "HAPPY_PATH"
  },
  {
    "id": "underwriting",
    "label": "AI Underwriting",
    "description": "Explainable credit-readiness and affordability model.",
    "cta": "Run Readiness Model",
    "drillDown": "Generate lender and borrower reason codes.",
    "apiFlow": "POST /credit-readiness",
    "mockScenario": "STEP_UP"
  },
  {
    "id": "fairness",
    "label": "Fairness Monitor",
    "description": "Bias, affordability, and adverse-action reason-code checks.",
    "cta": "Mock Fairness Decision",
    "drillDown": "View explainability and guardrails.",
    "apiFlow": "Model card + policy guardrails",
    "mockScenario": "STEP_UP"
  },
  {
    "id": "sandbox",
    "label": "UPI/AA Mock Rail",
    "description": "Synthetic payment and account aggregator callback sandbox.",
    "cta": "Send Mock Consent Pull",
    "drillDown": "View simulated consent, RRN, and settlement metadata.",
    "apiFlow": "POST /mock-upi",
    "mockScenario": "HAPPY_PATH"
  }
];

export function getWorkflowTab(id: string) {
  return workflowTabs.find((tab) => tab.id === id) ?? workflowTabs[0];
}

export function buildMockUpiRequest(tab: WorkflowTab, amount: number) {
  return {
    txnId: 'TXN-' + tab.id.toUpperCase() + '-' + Date.now().toString(36).toUpperCase(),
    payerVpa: 'demo.payer@oksbi',
    payeeVpa: 'cashflowmemoryforbharat@upi',
    amount,
    flow: tab.id.includes('qr') ? 'UPI_QR' : tab.id.includes('lite') ? 'UPI_LITE' : 'UPI_INTENT',
    purpose: 'Cashflow Memory for Bharat ' + tab.label + ' sandbox payment',
    riskScore: tab.mockScenario === 'RISK_HOLD' ? 88 : tab.mockScenario === 'STEP_UP' ? 66 : 24,
    scenario: tab.mockScenario
  };
}
