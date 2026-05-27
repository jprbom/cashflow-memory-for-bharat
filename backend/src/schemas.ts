import { z } from 'zod';

export const consentStatusSchema = z.enum(['ACTIVE', 'EXPIRED', 'REVOKED']);
export const profileInputSchema = z.object({
  merchantName: z.string().min(3),
  segment: z.enum(['KIRANA', 'GIG_WORKER', 'STREET_VENDOR', 'HOME_BUSINESS']),
  city: z.string().min(2),
  consentStatus: consentStatusSchema,
  readinessScore: z.number().min(0).max(900),
  monthlyInflow: z.number().nonnegative(),
  monthlyOutflow: z.number().nonnegative()
});

export const cashflowEntryInputSchema = z.object({
  profileId: z.string().min(3),
  description: z.string().min(3),
  category: z.enum(['INCOME', 'SUPPLIER', 'RENT', 'UTILITY', 'PERSONAL', 'LOAN']),
  direction: z.enum(['INFLOW', 'OUTFLOW']),
  amount: z.number().positive(),
  source: z.enum(['UPI', 'AA_BANK', 'GST', 'MANUAL']),
  occurredAt: z.string().min(10)
});

export const readinessInputSchema = z.object({
  monthlyInflow: z.number().nonnegative(),
  monthlyOutflow: z.number().nonnegative(),
  repeatCustomerRatio: z.number().min(0).max(1),
  volatility: z.number().min(0).max(1),
  repaymentDiscipline: z.number().min(0).max(1),
  topPayerConcentration: z.number().min(0).max(1),
  consentStatus: consentStatusSchema
});

export type ProfileInput = z.infer<typeof profileInputSchema>;
export type CashflowEntryInput = z.infer<typeof cashflowEntryInputSchema>;
export type ReadinessInput = z.infer<typeof readinessInputSchema>;

