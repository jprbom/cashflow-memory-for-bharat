import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { BadgeIndianRupee, BookOpenCheck, HandCoins, HeartHandshake, Lock, RefreshCw, Sparkles, Trash2, WalletCards } from 'lucide-react';
import { apiRequest } from './api';
import { formatInr } from './lib/viewModel';

type Role = 'ADMIN' | 'CREDIT_COACH' | 'LENDER_REVIEWER' | 'BORROWER' | 'VIEWER';
type Profile = {
  id: string;
  merchantName: string;
  segment: string;
  city: string;
  consentStatus: string;
  readinessScore: number;
  monthlyInflow: number;
  monthlyOutflow: number;
  createdAt: string;
};
type Entry = {
  id: string;
  profileId: string;
  description: string;
  category: string;
  direction: string;
  amount: number;
  source: string;
  occurredAt: string;
  createdAt: string;
};
type Metrics = { kpis: { profiles: number; averageReadinessScore: number; monthlyInflow: number; monthlyOutflow: number; activeConsent: number; entries: number } };
type Readiness = { readinessScore: number; grade: string; safeWorkingCapitalLimit: number; reasonCodes: string[]; borrowerCoach: string; lenderExplanation: string };

const roles: Role[] = ['ADMIN', 'CREDIT_COACH', 'LENDER_REVIEWER', 'BORROWER', 'VIEWER'];
const fallbackProfiles: Profile[] = [
  { id: 'profile_001', merchantName: 'Meera Kirana Stores', segment: 'KIRANA', city: 'Nashik', consentStatus: 'ACTIVE', readinessScore: 742, monthlyInflow: 124850, monthlyOutflow: 85630, createdAt: '2026-05-27T08:15:00.000Z' },
  { id: 'profile_002', merchantName: 'Rafiq Food Cart', segment: 'STREET_VENDOR', city: 'Lucknow', consentStatus: 'ACTIVE', readinessScore: 688, monthlyInflow: 76300, monthlyOutflow: 51400, createdAt: '2026-05-27T08:25:00.000Z' }
];
const fallbackEntries: Entry[] = [
  { id: 'cash_001', profileId: 'profile_001', description: 'Daily UPI sales', category: 'INCOME', direction: 'INFLOW', amount: 45000, source: 'UPI', occurredAt: '2026-05-24', createdAt: '2026-05-27T08:50:00.000Z' },
  { id: 'cash_002', profileId: 'profile_001', description: 'Supplier payment', category: 'SUPPLIER', direction: 'OUTFLOW', amount: 18350, source: 'AA_BANK', occurredAt: '2026-05-25', createdAt: '2026-05-27T08:55:00.000Z' }
];
const fallbackMetrics: Metrics = { kpis: { profiles: 3, averageReadinessScore: 737, monthlyInflow: 344550, monthlyOutflow: 230230, activeConsent: 3, entries: 3 } };

export default function App() {
  const [role, setRole] = useState<Role>('CREDIT_COACH');
  const [profiles, setProfiles] = useState<Profile[]>(fallbackProfiles);
  const [entries, setEntries] = useState<Entry[]>(fallbackEntries);
  const [metrics, setMetrics] = useState<Metrics>(fallbackMetrics);
  const [readiness, setReadiness] = useState<Readiness | null>(null);
  const [error, setError] = useState('');
  const [merchantName, setMerchantName] = useState('New Bharat Merchant');
  const selectedProfile = useMemo(() => profiles[0], [profiles]);

  async function load() {
    try {
      const [nextMetrics, nextProfiles, nextEntries] = await Promise.all([
        apiRequest<Metrics>('/metrics', role),
        apiRequest<Profile[]>('/profiles', role),
        apiRequest<Entry[]>('/cashflow-entries', role)
      ]);
      setMetrics(nextMetrics);
      setProfiles(nextProfiles);
      setEntries(nextEntries);
      setError('');
    } catch {
      setError('API offline: showing synthetic cashflow memory data.');
    }
  }

  useEffect(() => {
    void load();
  }, [role]);

  async function runReadiness() {
    const result = await apiRequest<Readiness>('/credit-readiness', role, {
      method: 'POST',
      body: JSON.stringify({
        monthlyInflow: selectedProfile?.monthlyInflow || 100000,
        monthlyOutflow: selectedProfile?.monthlyOutflow || 70000,
        repeatCustomerRatio: 0.58,
        volatility: 0.24,
        repaymentDiscipline: 0.82,
        topPayerConcentration: 0.38,
        consentStatus: 'ACTIVE'
      })
    });
    setReadiness(result);
  }

  async function createProfile() {
    const created = await apiRequest<Profile>('/profiles', role, {
      method: 'POST',
      body: JSON.stringify({
        merchantName,
        segment: 'KIRANA',
        city: 'Indore',
        consentStatus: 'ACTIVE',
        readinessScore: 701,
        monthlyInflow: 91000,
        monthlyOutflow: 67000
      })
    });
    setProfiles([created, ...profiles]);
  }

  async function removeProfile(id: string) {
    await apiRequest<void>('/profiles/' + id, role, { method: 'DELETE' });
    setProfiles(profiles.filter((profile) => profile.id !== id));
  }

  return (
    <div className="app-shell cashflow">
      <aside className="sidebar">
        <div className="brand"><img src="/logo.svg" alt="" /><span>Cashflow Memory for Bharat</span></div>
        {['Dashboard', 'Cashflow Memory', 'Income Activity', 'Credit Readiness', 'Coaching', 'Consent Vault', 'Reports'].map((item, index) => (
          <button className={index === 0 ? 'nav-item active' : 'nav-item'} key={item}><WalletCards size={16} />{item}</button>
        ))}
        <div className="region-card"><span>Consent</span><strong>AA-ready</strong><small>Synthetic profiles only</small></div>
      </aside>
      <main>
        <header className="topbar">
          <div>
            <h1>Explainable Cashflow Memory</h1>
            <p>Credit-readiness coaching, lender reason codes, and consent-first borrower intelligence.</p>
          </div>
          <div className="top-actions">
            <span className="live-dot">Live</span>
            <select value={role} onChange={(event) => setRole(event.target.value as Role)}>{roles.map((item) => <option key={item}>{item}</option>)}</select>
            <button onClick={load}><RefreshCw size={16} />Refresh</button>
          </div>
        </header>
        {error ? <div className="notice">{error}</div> : null}
        <section className="kpi-grid">
          <Metric title="Avg Readiness" value={String(metrics.kpis.averageReadinessScore)} detail="out of 900" icon={<BookOpenCheck />} />
          <Metric title="Monthly Inflow" value={formatInr(metrics.kpis.monthlyInflow)} detail="synthetic UPI and AA" icon={<BadgeIndianRupee />} />
          <Metric title="Monthly Outflow" value={formatInr(metrics.kpis.monthlyOutflow)} detail="supplier and expense pressure" icon={<HandCoins />} />
          <Metric title="Active Consent" value={String(metrics.kpis.activeConsent)} detail="consent-first data access" icon={<HeartHandshake />} />
        </section>
        <section className="workspace-grid">
          <div className="panel span-two">
            <div className="panel-title"><Sparkles size={18} /> Credit Readiness Coach</div>
            <div className="simulator-row">
              <label>Merchant <input value={merchantName} onChange={(event) => setMerchantName(event.target.value)} /></label>
              <button onClick={runReadiness}><Sparkles size={16} />Compute Memory</button>
              <button onClick={createProfile}><Lock size={16} />Create Profile</button>
            </div>
            <div className="recommendation-card">
              <div><span>Readiness Score</span><strong>{readiness?.readinessScore || selectedProfile?.readinessScore || 0}/900</strong></div>
              <div><span>Safe Limit</span><strong>{readiness ? formatInr(readiness.safeWorkingCapitalLimit) : formatInr(0)}</strong></div>
              <p>{readiness?.borrowerCoach || 'The coach separates genuine seasonality from distress and creates borrower-facing next actions.'}</p>
            </div>
          </div>
          <div className="panel">
            <div className="panel-title"><WalletCards size={18} /> Cashflow Health</div>
            {profiles.map((profile) => <div className="node-row" key={profile.id}><strong>{profile.readinessScore}</strong><span>{profile.merchantName}</span><small>{profile.segment}</small></div>)}
          </div>
          <div className="panel span-three">
            <div className="panel-title"><Lock size={18} /> Merchant Profiles CRUD</div>
            <div className="table">
              <div className="table-row header"><span>Merchant</span><span>Segment</span><span>City</span><span>Score</span><span>Inflow</span><span>Action</span></div>
              {profiles.map((profile) => (
                <div className="table-row" key={profile.id}>
                  <span>{profile.merchantName}</span><span>{profile.segment}</span><span>{profile.city}</span><span>{profile.readinessScore}</span><span>{formatInr(profile.monthlyInflow)}</span>
                  <span><button className="icon-button" onClick={() => void removeProfile(profile.id)}><Trash2 size={15} /></button></span>
                </div>
              ))}
            </div>
          </div>
          <div className="panel span-three">
            <div className="panel-title"><BookOpenCheck size={18} /> Recent Cashflow Memory</div>
            {entries.map((entry) => <div className="case-card" key={entry.id}><strong>{entry.description}</strong><span>{entry.direction} - {entry.category} - {formatInr(entry.amount)}</span><p>{entry.source} on {entry.occurredAt}</p></div>)}
          </div>
        </section>
      </main>
    </div>
  );
}

function Metric({ title, value, detail, icon }: { title: string; value: string; detail: string; icon: ReactNode }) {
  return <div className="metric-card"><div>{icon}</div><span>{title}</span><strong>{value}</strong><small>{detail}</small></div>;
}

