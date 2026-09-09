export type Action = 'SCALE' | 'HOLD' | 'RAISE' | 'KILL' | 'TEST' | 'AUDIT' | 'MIGRATE';
export type OS = 'Android' | 'iOS' | 'Web2App';
export type Geo = 'MX' | 'CO' | 'US-Hisp' | 'US';
export type Canal = 'Meta' | 'Google' | 'TikTok' | 'AdNet';

export interface Campaign {
  id: string; canal: Canal; geo: Geo; os: OS;
  totalSpend: number; singularInstalls: number; platformInstalls: number;
  singularRevD7: number; singularRevD30: number;
  cpi: number; d7Roas: number; d30Roas: number; d30d7Ratio: number;
  installGapPct: number; ctit?: number;
  curveA: number; curveB: number; curveR2: number;
  proposedMonthly: number; action: Action; reason: string;
}

export const campaigns: Campaign[] = [
  { id:'MET_MX_AND_BROAD_AEO', canal:'Meta', geo:'MX', os:'Android', totalSpend:74210, singularInstalls:89412, platformInstalls:91340, singularRevD7:30125, singularRevD30:33890, cpi:0.83, d7Roas:0.406, d30Roas:0.457, d30d7Ratio:1.12, installGapPct:0.021, curveA:3.82, curveB:0.88, curveR2:0.91, proposedMonthly:24000, action:'SCALE', reason:'Highest Android MX volume, D7 ROAS 40.6% Singular-basis, low install discrepancy (2%), elasticity b=0.88 means room to scale without saturation.' },
  { id:'MET_CO_AND_BROAD', canal:'Meta', geo:'CO', os:'Android', totalSpend:106431, singularInstalls:221438, platformInstalls:224100, singularRevD7:36610, singularRevD30:35224, cpi:0.48, d7Roas:0.344, d30Roas:0.331, d30d7Ratio:0.96, installGapPct:0.012, curveA:1.24, curveB:0.92, curveR2:0.87, proposedMonthly:22000, action:'SCALE', reason:'Volume king: lowest CPI in dataset ($0.48), 221K Singular installs, clean CTIT — scale to capture CO market before saturation.' },
  { id:'GAC_MX_AND_TROAS', canal:'Google', geo:'MX', os:'Android', totalSpend:38210, singularInstalls:41022, platformInstalls:42100, singularRevD7:13182, singularRevD30:15920, cpi:0.93, d7Roas:0.345, d30Roas:0.416, d30d7Ratio:1.21, installGapPct:0.026, curveA:2.11, curveB:0.85, curveR2:0.83, proposedMonthly:14000, action:'SCALE', reason:'tROAS bidding objective correctly aligned, D30/D7=1.21x shows healthy maturation — scale with tROAS intact.' },
  { id:'NEW_US_AND_BROAD', canal:'Meta', geo:'US', os:'Android', totalSpend:0, singularInstalls:0, platformInstalls:0, singularRevD7:0, singularRevD30:0, cpi:0, d7Roas:0, d30Roas:0, d30d7Ratio:0, installGapPct:0, curveA:2.50, curveB:0.80, curveR2:0, proposedMonthly:14000, action:'TEST', reason:'New test: US general-market Android (English creatives) to break dependence on US-Hisp iOS — content-market-fit validation.' },
  { id:'TT_CO_AND_BROAD', canal:'TikTok', geo:'CO', os:'Android', totalSpend:28940, singularInstalls:55210, platformInstalls:56000, singularRevD7:12965, singularRevD30:12450, cpi:0.52, d7Roas:0.448, d30Roas:0.430, d30d7Ratio:0.96, installGapPct:0.014, curveA:1.89, curveB:0.69, curveR2:0.78, proposedMonthly:10000, action:'HOLD', reason:'Good D7 ROAS (44.8%) but elasticity b=0.69 signals moderate saturation — hold, monitor mROAS before scaling.' },
  { id:'TT_MX_AND_BROAD', canal:'TikTok', geo:'MX', os:'Android', totalSpend:23840, singularInstalls:31204, platformInstalls:32000, singularRevD7:9128, singularRevD30:9450, cpi:0.76, d7Roas:0.383, d30Roas:0.396, d30d7Ratio:1.03, installGapPct:0.025, curveA:1.44, curveB:0.72, curveR2:0.74, proposedMonthly:8000, action:'HOLD', reason:'Only CR-15 creative is durable — hold budget until new creatives briefed on CR-15 format, then retest.' },
  { id:'MET_MX_WEB2APP', canal:'Meta', geo:'MX', os:'Web2App', totalSpend:26922, singularInstalls:12482, platformInstalls:13100, singularRevD7:9126, singularRevD30:12115, cpi:2.16, d7Roas:0.339, d30Roas:0.450, d30d7Ratio:1.33, installGapPct:0.047, curveA:2.67, curveB:0.76, curveR2:0.82, proposedMonthly:8000, action:'RAISE', reason:'Best D30/D7 maturation ratio in dataset (1.33x) — revenue compounds after D7, raise and measure D30 ROAS before further decisions.' },
  { id:'MET_MX_RTG_PAYERS', canal:'Meta', geo:'MX', os:'Android', totalSpend:31082, singularInstalls:51027, platformInstalls:52000, singularRevD7:42645, singularRevD30:51890, cpi:0.61, d7Roas:1.372, d30Roas:1.669, d30d7Ratio:1.22, installGapPct:0.019, curveA:5.10, curveB:0.91, curveR2:0.94, proposedMonthly:8000, action:'AUDIT', reason:'Highest ROAS (137%) but installs are re-engagements — verify attribution window is not double-counting organic before scaling.' },
  { id:'MET_MX_IOS_BROAD', canal:'Meta', geo:'MX', os:'iOS', totalSpend:30769, singularInstalls:6425, platformInstalls:11254, singularRevD7:5416, singularRevD30:7820, cpi:4.79, d7Roas:0.176, d30Roas:0.254, d30d7Ratio:1.44, installGapPct:0.429, curveA:0.88, curveB:0.79, curveR2:0.61, proposedMonthly:4000, action:'HOLD', reason:'iOS install discrepancy −42.9% — cap at $4K pending AEM probabilistic attribution setup; D30/D7=1.44x justifies keeping line alive.' },
  { id:'GAC_CO_AND_INSTALL', canal:'Google', geo:'CO', os:'Android', totalSpend:19020, singularInstalls:38402, platformInstalls:39100, singularRevD7:3558, singularRevD30:4820, cpi:0.50, d7Roas:0.187, d30Roas:0.253, d30d7Ratio:1.35, installGapPct:0.018, curveA:0.72, curveB:0.66, curveR2:0.71, proposedMonthly:4000, action:'MIGRATE', reason:'Clean CTIT (92s), good CPI ($0.50) but Install objective caps ROAS — migrate to tROAS bidding before any spend increase.' },
  { id:'MET_USH_IOS_BROAD', canal:'Meta', geo:'US-Hisp', os:'iOS', totalSpend:37297, singularInstalls:4214, platformInstalls:7432, singularRevD7:5072, singularRevD30:9847, cpi:8.85, d7Roas:0.136, d30Roas:0.264, d30d7Ratio:1.94, installGapPct:0.433, curveA:0.61, curveB:0.82, curveR2:0.55, proposedMonthly:4000, action:'HOLD', reason:'D30/D7=1.94x compelling but iOS discrepancy −43.3% — hold at $4K, migrate to AEM, reassess at D30.' },
  { id:'TT_USH_IOS_BROAD', canal:'TikTok', geo:'US-Hisp', os:'iOS', totalSpend:31037, singularInstalls:2942, platformInstalls:3783, singularRevD7:2010, singularRevD30:2980, cpi:10.55, d7Roas:0.065, d30Roas:0.096, d30d7Ratio:1.48, installGapPct:0.222, curveA:0.31, curveB:0.77, curveR2:0.45, proposedMonthly:0, action:'KILL', reason:'No SKAN probabilistic modeling enabled on TikTok — attribution signal is blind; worst D7 ROAS (6.5%), no recovery path.' },
  { id:'NET_CO_AND_CPI', canal:'AdNet', geo:'CO', os:'Android', totalSpend:534, singularInstalls:51882, platformInstalls:52400, singularRevD7:16, singularRevD30:16, cpi:0.01, d7Roas:0.030, d30Roas:0.030, d30d7Ratio:1.00, installGapPct:0.01, ctit:8, curveA:0, curveB:0, curveR2:0, proposedMonthly:0, action:'KILL', reason:'Confirmed click-injection fraud: CTIT=8s, 51K installs on $534 spend generating $16 revenue — kill immediately, notify Singular.' },
];

export const TOTAL_BUDGET_MONTHLY = 120000;
export const TOTAL_BUDGET_DAILY = TOTAL_BUDGET_MONTHLY / 30;
export const activeCampaigns = campaigns.filter(c => c.proposedMonthly > 0);
export const killedCampaigns = campaigns.filter(c => c.action === 'KILL');
