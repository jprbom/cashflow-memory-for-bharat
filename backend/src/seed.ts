export type Profile = {
  id: string;
  merchantName: string;
  segment: 'KIRANA' | 'GIG_WORKER' | 'STREET_VENDOR' | 'HOME_BUSINESS';
  city: string;
  consentStatus: 'ACTIVE' | 'EXPIRED' | 'REVOKED';
  readinessScore: number;
  monthlyInflow: number;
  monthlyOutflow: number;
  createdAt: string;
};

export type CashflowEntry = {
  id: string;
  profileId: string;
  description: string;
  category: 'INCOME' | 'SUPPLIER' | 'RENT' | 'UTILITY' | 'PERSONAL' | 'LOAN';
  direction: 'INFLOW' | 'OUTFLOW';
  amount: number;
  source: 'UPI' | 'AA_BANK' | 'GST' | 'MANUAL';
  occurredAt: string;
  createdAt: string;
};

export type DatabaseShape = {
  profiles: Profile[];
  cashflowEntries: CashflowEntry[];
};

export const seed: DatabaseShape = {
  profiles: [
    { id: 'profile_001', merchantName: 'Meera Kirana Stores', segment: 'KIRANA', city: 'Nashik', consentStatus: 'ACTIVE', readinessScore: 742, monthlyInflow: 124850, monthlyOutflow: 85630, createdAt: '2026-05-27T08:15:00.000Z' },
    { id: 'profile_002', merchantName: 'Rafiq Food Cart', segment: 'STREET_VENDOR', city: 'Lucknow', consentStatus: 'ACTIVE', readinessScore: 688, monthlyInflow: 76300, monthlyOutflow: 51400, createdAt: '2026-05-27T08:25:00.000Z' },
    { id: 'profile_003', merchantName: 'Anika Home Studio', segment: 'HOME_BUSINESS', city: 'Surat', consentStatus: 'ACTIVE', readinessScore: 781, monthlyInflow: 143400, monthlyOutflow: 93200, createdAt: '2026-05-27T08:35:00.000Z' }
  ],
  cashflowEntries: [
    { id: 'cash_001', profileId: 'profile_001', description: 'Daily UPI sales', category: 'INCOME', direction: 'INFLOW', amount: 45000, source: 'UPI', occurredAt: '2026-05-24', createdAt: '2026-05-27T08:50:00.000Z' },
    { id: 'cash_002', profileId: 'profile_001', description: 'Supplier payment', category: 'SUPPLIER', direction: 'OUTFLOW', amount: 18350, source: 'AA_BANK', occurredAt: '2026-05-25', createdAt: '2026-05-27T08:55:00.000Z' },
    { id: 'cash_003', profileId: 'profile_002', description: 'Evening sales', category: 'INCOME', direction: 'INFLOW', amount: 13800, source: 'UPI', occurredAt: '2026-05-25', createdAt: '2026-05-27T08:57:00.000Z' }
  ]
};

