import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from '../src/app.js';
import { createTestDatabase } from '../src/db.js';

describe('Cashflow Memory for Bharat API', () => {
  it('computes explainable credit readiness', async () => {
    const app = createApp(createTestDatabase());
    const response = await request(app)
      .post('/api/credit-readiness')
      .set('x-user-role', 'CREDIT_COACH')
      .send({
        monthlyInflow: 124850,
        monthlyOutflow: 85630,
        repeatCustomerRatio: 0.58,
        volatility: 0.24,
        repaymentDiscipline: 0.82,
        topPayerConcentration: 0.38,
        consentStatus: 'ACTIVE'
      });

    expect(response.status).toBe(200);
    expect(response.body.readinessScore).toBeGreaterThan(680);
    expect(response.body.reasonCodes).toContain('POSITIVE_NET_CASHFLOW');
  });

  it('supports profile CRUD and restricts deletion to admins', async () => {
    const app = createApp(createTestDatabase());
    const created = await request(app)
      .post('/api/profiles')
      .set('x-user-role', 'CREDIT_COACH')
      .send({
        merchantName: 'Test Bharat Store',
        segment: 'KIRANA',
        city: 'Indore',
        consentStatus: 'ACTIVE',
        readinessScore: 701,
        monthlyInflow: 91000,
        monthlyOutflow: 67000
      });

    expect(created.status).toBe(201);

    const denied = await request(app)
      .delete('/api/profiles/' + created.body.id)
      .set('x-user-role', 'CREDIT_COACH');
    expect(denied.status).toBe(403);

    const deleted = await request(app)
      .delete('/api/profiles/' + created.body.id)
      .set('x-user-role', 'ADMIN');
    expect(deleted.status).toBe(204);
  });

  it('returns NPCI-style mock UPI rail response for end-to-end demo flows', async () => {
    const app = createApp(createTestDatabase());
    const response = await request(app)
      .post('/api/mock-upi')
      .set('x-user-role', 'OPS_MANAGER')
      .send({
        txnId: 'TXN-DEMO-001',
        payerVpa: 'payer@oksbi',
        payeeVpa: 'merchant@upi',
        amount: 499,
        flow: 'UPI_INTENT',
        purpose: 'portfolio test flow',
        riskScore: 24,
        scenario: 'HAPPY_PATH'
      });

    expect(response.status).toBe(200);
    expect(response.body.gateway).toBe('NPCI_UPI_MOCK');
    expect(response.body.txnId).toBe('TXN-DEMO-001');
    expect(response.body.rrn).toMatch(/^RRN/);
    expect(response.body.risk.reasonCodes).toContain('SYNTHETIC_NPCI_SANDBOX');
    expect(response.body.settlement).toHaveProperty('preSettlementHold');
  });

});
