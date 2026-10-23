import { useState } from 'react';
import { ArrowUpRight, Check, FileCheck2, ShieldCheck, Wallet } from 'lucide-react';
import { whatsappLink } from '../../data/site';
import { FadeUp } from '../ui/motion';

const COMMON = [
  { title: 'Give your goal a name', body: 'Write down what you are investing for, when you need the money and how much you can comfortably set aside.' },
  { title: 'Keep your details ready', body: 'Have your PAN, identity and address proof, and bank details available. KYC requirements depend on your status and the fund house.' },
  { title: 'Understand before you sign', body: 'Read the scheme documents, check the Riskometer and ask about costs, exit loads and access to your money.' },
];
const GUIDES = [
  { icon: ShieldCheck, title: 'Risk is part of the plan', text: 'A SIP is a way to invest regularly, not a guaranteed return. Fund values can fall. Check the scheme’s Riskometer and whether you can tolerate those changes.' },
  { icon: Wallet, title: 'Know what you pay', text: 'Expense ratios affect your investment value. Regular plans include distribution costs; direct plans have a different cost structure. Ask how commissions and any exit loads apply.' },
  { icon: FileCheck2, title: 'Make the paperwork count', text: 'Keep contact and bank details current. Review your nomination choices and tell your family where to find investment records. Never share passwords or OTPs.' },
];

export function InvestorEssentials() {
  const [nri, setNri] = useState(false);
  const [checked, setChecked] = useState<string[]>([]);
  const tasks = [...COMMON, nri
    ? { title: 'Confirm your NRI requirements', body: 'Discuss your country of residence, NRE/NRO banking and FATCA/CRS details. Fund house acceptance and supporting documents vary.' }
    : { title: 'Check your KYC status', body: 'Use AMFI’s official KYC resources to understand the process and check whether any details need updating before you start.' }];
  const count = tasks.filter(t => checked.includes(t.title)).length;
  const toggle = (title: string) => setChecked(previous => previous.includes(title) ? previous.filter(t => t !== title) : [...previous, title]);
  return (
    <section id="essentials" className="relative overflow-hidden bg-forest py-16 lg:py-28">
      <div className="pointer-events-none absolute -right-24 top-0 h-96 w-96 rounded-full bg-gold/10 blur-[100px]" />
      <div className="container-x relative">
        <FadeUp>
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div><p className="eyebrow mb-4 text-gold">Investor essentials · निवेश की तैयारी</p><h2 className="max-w-3xl font-display text-[clamp(2.4rem,5vw,5rem)] leading-[1.02]">Your first investment.<br /><span className="italic text-gold">A clearer first step.</span></h2></div>
            <p className="max-w-sm text-sm leading-relaxed text-bone/60">A little preparation makes the first conversation more useful. Start here, at your own pace.</p>
          </div>
        </FadeUp>
        <div className="mt-10 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-gold/20 bg-night/40 p-5 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4"><h3 className="font-display text-3xl">Ready when you are.</h3><div className="flex rounded-full border border-white/15 p-1" role="group" aria-label="Residency">
              {[false, true].map(value => <button key={String(value)} type="button" aria-pressed={nri === value} onClick={() => setNri(value)} className={`rounded-full px-4 py-2 text-xs transition-colors ${nri === value ? 'bg-gold text-night' : 'text-bone/70 hover:text-gold'}`}>{value ? 'NRI investor' : 'Indian resident'}</button>)}
            </div></div>
            <div className="mb-2 mt-7 flex justify-between text-xs text-bone/55"><span>My preparation checklist</span><span role="status" aria-live="polite">{count} of {tasks.length} ready</span></div>
            <div className="h-1 overflow-hidden rounded-full bg-white/10"><div className="h-full bg-gold transition-all duration-500" style={{ width: `${count / tasks.length * 100}%` }} /></div>
            <div className="mt-3 divide-y divide-white/10">{tasks.map(task => <label key={task.title} className="flex cursor-pointer gap-4 py-5"><span className="relative mt-1 h-6 w-6 shrink-0"><input type="checkbox" className="peer h-6 w-6 cursor-pointer appearance-none rounded-md border border-gold/40 checked:bg-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold" checked={checked.includes(task.title)} onChange={() => toggle(task.title)} /><Check className="pointer-events-none absolute inset-1 h-4 w-4 text-night opacity-0 peer-checked:opacity-100" /></span><span><span className="block text-base font-medium">{task.title}</span><span className="mt-1 block text-sm leading-relaxed text-bone/55">{task.body}</span></span></label>)}</div>
            <p className="text-xs text-bone/40">For your preparation only. This checklist does not assess suitability or submit documents; selections reset when you reload.</p>
          </div>
          <div className="flex flex-col gap-5">
            <div className="flex-1 rounded-3xl bg-gold p-6 text-night sm:p-8"><p className="eyebrow text-night/60">Bring your questions</p><h3 className="mt-4 font-display text-4xl leading-tight">Your goals first.<br />The paperwork next.</h3><p className="mt-4 text-sm leading-relaxed text-night/75">Talk through your time horizon, existing investments and comfort with market movements. We’ll explain the onboarding steps relevant to you.</p><a href={whatsappLink(`Namaste! I am ${nri ? 'an NRI' : 'an Indian resident'} and would like help preparing for my first investment conversation.`)} target="_blank" rel="noreferrer" className="mt-6 inline-flex min-h-12 items-center gap-3 rounded-full bg-night px-5 text-sm font-semibold text-gold">Help me get started <ArrowUpRight size={16} /></a></div>
            <div className="rounded-3xl border border-white/15 p-6"><p className="eyebrow mb-4 text-gold">Official resources</p><a className="flex min-h-11 items-center justify-between border-b border-white/10 py-3 text-sm hover:text-gold" href="https://www.amfiindia.com/kyc" target="_blank" rel="noreferrer">AMFI · KYC guide & status <ArrowUpRight size={16} /></a><a className="flex min-h-11 items-center justify-between py-3 text-sm hover:text-gold" href="https://www.amfiindia.com/investor" target="_blank" rel="noreferrer">AMFI · Investor education <ArrowUpRight size={16} /></a></div>
          </div>
        </div>
        <div className="mt-5 grid gap-5 md:grid-cols-3">{GUIDES.map(({ icon: Icon, title, text }) => <article key={title} className="rounded-3xl border border-white/10 bg-night/20 p-6"><Icon className="mb-5 h-6 w-6 text-gold" strokeWidth={1.5} /><h3 className="font-display text-2xl">{title}</h3><p className="mt-3 text-sm leading-relaxed text-bone/60">{text}</p></article>)}</div>
      </div>
    </section>
  );
}
