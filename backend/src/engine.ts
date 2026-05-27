import type { ReadinessInput } from './schemas.js';

export function computeCreditReadiness(input: ReadinessInput) {
  const netCashflow = input.monthlyInflow - input.monthlyOutflow;
  const affordabilityRatio = input.monthlyInflow === 0 ? 0 : netCashflow / input.monthlyInflow;
  const consentPenalty = input.consentStatus === 'ACTIVE' ? 0 : -120;
  const rawScore =
    550 +
    affordabilityRatio * 160 +
    input.repeatCustomerRatio * 95 +
    input.repaymentDiscipline * 110 -
    input.volatility * 105 -
    input.topPayerConcentration * 70 +
    consentPenalty;
  const readinessScore = Math.round(Math.max(300, Math.min(900, rawScore)));
  const grade = readinessScore >= 760 ? 'READY_FOR_LIMIT_INCREASE' : readinessScore >= 680 ? 'READY_FOR_SMALL_LINE' : readinessScore >= 600 ? 'COACH_BEFORE_CREDIT' : 'NOT_READY';

  const reasonCodes: string[] = [];
  if (affordabilityRatio > 0.2) reasonCodes.push('POSITIVE_NET_CASHFLOW');
  if (input.repeatCustomerRatio > 0.45) reasonCodes.push('REPEAT_CUSTOMER_STRENGTH');
  if (input.volatility > 0.45) reasonCodes.push('HIGH_CASHFLOW_VOLATILITY');
  if (input.topPayerConcentration > 0.55) reasonCodes.push('CUSTOMER_CONCENTRATION_RISK');
  if (input.consentStatus !== 'ACTIVE') reasonCodes.push('CONSENT_NOT_ACTIVE');

  return {
    readinessScore,
    grade,
    affordabilityRatio: Number(affordabilityRatio.toFixed(3)),
    safeWorkingCapitalLimit: Math.max(0, Math.round(netCashflow * 2.2)),
    reasonCodes,
    borrowerCoach: 'Maintain stable inflows, reduce concentration from top payers, and keep consent active for the next 30 days.',
    lenderExplanation: 'Recommendation is based on cashflow stability, affordability, repayment discipline, concentration risk, and consent status.'
  };
}
