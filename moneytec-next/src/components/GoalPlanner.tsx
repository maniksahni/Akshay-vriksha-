import { useState } from 'react';
import { ArrowUpRight, Target } from 'lucide-react';
import { wa } from '../data';
import { goalProjection, inr } from './ui';

const GOALS = ['Education', 'A home', 'Retirement', 'My own goal'];
export function GoalPlanner() {
  const [goal, setGoal] = useState('Education');
  const [cost, setCost] = useState('2500000');
  const [saved, setSaved] = useState('0');
  const [years, setYears] = useState(15);
  const [inflation, setInflation] = useState(6);
  const [rate, setRate] = useState(12);
  const amount = Number(cost), savings = Number(saved);
  const valid = cost.trim() !== '' && saved.trim() !== '' && Number.isFinite(amount) && amount > 0 && amount <= 1000000000 && Number.isFinite(savings) && savings >= 0 && savings <= 1000000000;
  const result = goalProjection(valid ? amount : 0, valid ? savings : 0, years, inflation, rate);
  const monthly = Math.ceil(result.monthly / 100) * 100;
  const share = wa(`Hi Gulshan! I'd like to discuss my ${goal.toLowerCase()} goal. Cost today: ${inr(amount, false)}. Timeline: ${years} years. Existing savings allocated to this goal: ${inr(savings, false)}. Assumptions: ${inflation}% inflation and ${rate}% annual CAGR. Illustrated future target: ${inr(result.target, false)}. Estimated monthly SIP rounded up to the next Rs 100: ${inr(monthly, false)}. This is only an illustration; I understand returns are not guaranteed. Can we review affordability, risk and suitability?`);
  return (
    <div className="goal-planner">
      <div className="goal-input-panel">
        <p className="goal-step-label">01 / GIVE YOUR GOAL A NAME</p>
        <div className="goal-choices" role="group" aria-label="Your financial goal">{GOALS.map(g=><button key={g} type="button" aria-pressed={goal===g} onClick={()=>setGoal(g)}>{g}</button>)}</div>
        <div className="goal-money-grid">
          <label><span>What would it cost today?</span><div className="goal-money-input"><span aria-hidden="true">₹</span><input type="number" inputMode="numeric" min="1" max="1000000000" value={cost} onChange={e=>setCost(e.target.value)} aria-label="Goal cost today in rupees" aria-describedby="goal-input-help" /></div></label>
          <label><span>Savings for this goal today</span><div className="goal-money-input"><span aria-hidden="true">₹</span><input type="number" inputMode="numeric" min="0" max="1000000000" value={saved} onChange={e=>setSaved(e.target.value)} aria-label="Savings allocated to this goal in rupees" aria-describedby="goal-input-help" /></div></label>
        </div>
        <p id="goal-input-help" className="goal-input-help">Use today’s cost and only the savings set aside for this goal.</p>
        {!valid && <p role="alert" className="goal-input-error">Enter a goal cost above ₹0 and savings of ₹0 or more, up to ₹100 crore each.</p>}
        <div className="goal-slider-field"><label htmlFor="goal-years">Time to your goal <strong>{years} years</strong></label><input id="goal-years" className="slider" type="range" min="1" max="40" value={years} onChange={e=>setYears(Number(e.target.value))} style={{['--fill' as string]:`${(years-1)/39*100}%`}} /></div>
        <p className="goal-step-label goal-assumption-heading">02 / EXPLORE THE ASSUMPTIONS</p>
        <div className="goal-slider-field"><label htmlFor="goal-inflation">Assumed annual inflation <strong>{inflation}%</strong></label><input id="goal-inflation" className="slider" type="range" min="0" max="10" value={inflation} onChange={e=>setInflation(Number(e.target.value))} style={{['--fill' as string]:`${inflation*10}%`}} /></div>
        <label className="goal-rate-label" htmlFor="goal-return">Assumed annual return (CAGR)<select id="goal-return" value={rate} onChange={e=>setRate(Number(e.target.value))}>{[0,6,10,12,14,15,16].map(r=><option key={r} value={r}>{r}% per year</option>)}</select></label>
        <p className="goal-input-help">These are adjustable assumptions, not expected or promised returns. Existing savings are assumed to earn the same rate.</p>
      </div>
      <aside className="goal-result" aria-label="Goal planning illustration">
        <div className="goal-result-header"><Target size={20} aria-hidden="true" /><span>YOUR {goal.toUpperCase()} BLUEPRINT</span><i /></div>
        {valid ? <>
          <p className="goal-result-label">Illustrated monthly SIP</p>
          <p className="goal-monthly grad" aria-live="polite">{inr(monthly, false)}</p>
          <p className="goal-result-sub">for {years} years · rounded up to the next ₹100</p>
          <div className="goal-journey" aria-hidden="true"><span /><i /><i /><i /><i /><b /></div>
          <dl className="goal-breakdown"><div><dt>Goal cost today</dt><dd>{inr(amount)}</dd></div><div><dt>Future cost with inflation</dt><dd>{inr(result.target)}</dd></div><div><dt>Illustrated value of existing savings</dt><dd>{inr(result.futureSavings)}</dd></div><div><dt>Remaining target for SIPs</dt><dd>{inr(result.gap)}</dd></div></dl>
          <p className="goal-insight">{result.gap === 0 ? 'Under these assumptions, your allocated savings cover the target. Review the assumptions and suitability with Gulshan.' : `At ${inflation}% inflation, today’s ${inr(amount)} goal becomes approximately ${inr(result.target)} in ${years} years. Planning for that future cost keeps the target realistic.`}</p>
          <a href={share} target="_blank" rel="noopener noreferrer" className="goal-share">Discuss my goal with Gulshan <ArrowUpRight size={17} aria-hidden="true" /></a>
        </> : <div className="goal-empty"><Target size={38} aria-hidden="true" /><p>Add your goal details to see the illustration.</p></div>}
        <p className="goal-fineprint">Illustration only. Contributions at the start of each month; constant inflation and annual CAGR. Taxes, costs and changing returns are not modelled. Returns are not guaranteed. Mutual fund investments are subject to market risks.</p>
      </aside>
    </div>
  );
}
