import { AnimatePresence, motion } from 'framer-motion';
import { FormEvent, useMemo, useState } from 'react';
import { whatsappLink } from '../data/site';
import { EASE } from './ui/motion';

const INTERESTS = ['Mutual Funds / SIP', 'Life Insurance', 'Health Insurance'];
// Consultation slots, in India time.
const SLOTS = ['10:00', '11:30', '13:00', '15:00', '16:30', '18:00', '19:30'];
const STEPS = ['About you', 'Pick a time', 'Your details'];

const visitorTz = (() => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return 'Asia/Kolkata';
  }
})();
const inIndia = visitorTz === 'Asia/Kolkata' || visitorTz === 'Asia/Calcutta';

/** The next six working days (Monday to Saturday), starting tomorrow, as calendar dates in India. */
function upcomingDays() {
  const days: { y: number; m: number; d: number; label: string; weekday: string }[] = [];
  const now = new Date();
  for (let i = 1; days.length < 6 && i < 14; i++) {
    const dt = new Date(now.getTime() + i * 86400000);
    const parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kolkata', year: 'numeric', month: 'numeric', day: 'numeric', weekday: 'short' }).formatToParts(dt);
    const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '';
    if (get('weekday') === 'Sun') continue;
    const y = +get('year'), m = +get('month'), d = +get('day');
    const label = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' }).format(new Date(Date.UTC(y, m - 1, d)));
    days.push({ y, m, d, label, weekday: get('weekday') });
  }
  return days;
}

/** A slot's instant (IST is UTC+5:30) shown in the visitor's own timezone. */
function localTime(day: { y: number; m: number; d: number }, slot: string) {
  const [h, min] = slot.split(':').map(Number);
  const utc = new Date(Date.UTC(day.y, day.m - 1, day.d, h, min) - 330 * 60000);
  return new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', weekday: 'short', timeZone: visitorTz }).format(utc);
}

const chip = (on: boolean) =>
  `rounded-full border px-3.5 py-2 text-[13px] transition-colors duration-300 lg:px-4 lg:py-2.5 lg:text-sm ${
    on ? 'border-gold bg-gold text-night' : 'border-white/15 text-bone/70 hover:border-gold/60 hover:text-bone'
  }`;
const input = 'w-full border-b border-white/15 bg-transparent py-2.5 text-base text-bone placeholder:text-bone/30 focus:border-gold focus:outline-none lg:py-3 lg:text-lg';

export function Booking() {
  const days = useMemo(upcomingDays, []);
  const [step, setStep] = useState(0);
  const [who, setWho] = useState<'Resident Indian' | 'NRI'>(inIndia ? 'Resident Indian' : 'NRI');
  const [interests, setInterests] = useState<string[]>(['Mutual Funds / SIP']);
  const [day, setDay] = useState(0);
  const [slot, setSlot] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [note, setNote] = useState('');
  const [sent, setSent] = useState(false);

  const toggle = (t: string) => setInterests((s) => (s.includes(t) ? s.filter((x) => x !== t) : [...s, t]));
  const when = slot ? `${days[day].weekday} ${days[day].label}, ${slot} IST` : '';

  const [requestUrl, setRequestUrl] = useState('');

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const msg = [
      `Namaste! I'd like to book a consultation.`,
      `Name: ${name}`,
      `I am: ${who}${city ? `, ${city}` : ''}`,
      `Interested in: ${interests.join(', ') || 'a general consultation'}`,
      slot && `Preferred time: ${when}${inIndia ? '' : ` (${localTime(days[day], slot)} my time)`}`,
      note && `Goal: ${note}`,
    ]
      .filter(Boolean)
      .join('\n');
    const url = whatsappLink(msg);
    setRequestUrl(url);
    window.open(url, '_blank', 'noopener');
    setSent(true);
  };

  return (
    <div className="relative min-w-0 overflow-hidden rounded-[24px] border border-white/10 bg-night/60 backdrop-blur lg:rounded-[28px]">
      <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-gold/10 blur-[80px]" />

      {/* stepper */}
      <div className="relative border-b border-white/10 px-5 pb-4 pt-5 lg:px-9 lg:pt-8">
        <div className="flex items-baseline justify-between">
          <p className="font-display text-2xl lg:text-3xl">Book a consultation</p>
          <p className="text-[11px] text-bone/40">{sent ? 'Done' : `Step ${step + 1} of 3`}</p>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2">
          {STEPS.map((s, i) => (
            <button
              key={s}
              type="button"
              onClick={() => !sent && i <= step && setStep(i)}
              className="text-left"
              aria-current={i === step ? 'step' : undefined}
            >
              <span className="block h-1 overflow-hidden rounded-full bg-white/10">
                <motion.span
                  className="block h-full bg-gold"
                  initial={false}
                  animate={{ width: sent || i < step ? '100%' : i === step ? '50%' : '0%' }}
                  transition={{ duration: 0.6, ease: EASE }}
                />
              </span>
              <span className={`mt-2 block text-[10px] uppercase tracking-[0.16em] lg:text-[11px] ${i <= step || sent ? 'text-bone/70' : 'text-bone/30'}`}>{s}</span>
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={submit} className="relative min-h-[360px] px-5 py-5 lg:min-h-[420px] lg:px-9 lg:py-8">
        <AnimatePresence mode="wait" initial={false}>
          {sent ? (
            <motion.div key="sent" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, ease: EASE }} className="flex min-h-[320px] flex-col items-center justify-center text-center">
              <svg viewBox="0 0 64 64" className="h-16 w-16 text-gold" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <motion.circle cx="32" cy="32" r="28" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, ease: EASE }} />
                <motion.path d="M20 33l8 8 16-17" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 0.6, ease: EASE }} />
              </svg>
              <p className="mt-5 font-display text-3xl">Your request is ready.</p>
              <p className="mt-2 max-w-sm text-sm text-bone/60">
                Send the WhatsApp message that just opened{slot ? ` for ${when}` : ''}, and Gulshan will confirm your slot personally.
              </p>
              <a href={requestUrl} target="_blank" rel="noreferrer" className="mt-5 inline-flex min-h-12 items-center rounded-full bg-gold px-5 text-sm font-semibold text-night">Open WhatsApp again ↗</a>
              <p className="mt-2 text-xs text-bone/50">If the new window didn’t open, use the button above.</p>
              <button type="button" onClick={() => setSent(false)} className="mt-6 text-sm text-gold underline-offset-4 hover:underline">
                Change something
              </button>
            </motion.div>
          ) : step === 0 ? (
            <motion.div key="s0" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.35, ease: EASE }}>
              <p className="eyebrow mb-3 text-bone/40">I am a</p>
              <div className="flex flex-wrap gap-2">
                {(['Resident Indian', 'NRI'] as const).map((w) => (
                  <button type="button" key={w} className={chip(who === w)} onClick={() => setWho(w)} aria-pressed={who === w}>
                    {w}
                  </button>
                ))}
              </div>
              <p className="eyebrow mb-3 mt-6 text-bone/40">Interested in</p>
              <div className="flex flex-wrap gap-2">
                {INTERESTS.map((t) => (
                  <button type="button" key={t} className={chip(interests.includes(t))} onClick={() => toggle(t)} aria-pressed={interests.includes(t)}>
                    {t}
                  </button>
                ))}
              </div>
              <button type="button" onClick={() => setStep(1)} className="mt-8 inline-flex h-12 items-center gap-3 rounded-full bg-gold pl-6 pr-2 text-sm font-semibold text-night transition-colors hover:bg-gold-soft">
                Pick a time <span className="grid h-8 w-8 place-items-center rounded-full bg-night text-gold">→</span>
              </button>
            </motion.div>
          ) : step === 1 ? (
            <motion.div key="s1" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.35, ease: EASE }}>
              <p className="eyebrow mb-3 text-bone/40">Day</p>
              <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] lg:mx-0 lg:grid lg:grid-cols-6 lg:px-0 [&::-webkit-scrollbar]:hidden">
                {days.map((d, i) => (
                  <button
                    type="button"
                    key={d.label}
                    onClick={() => setDay(i)}
                    aria-pressed={day === i}
                    className={`flex w-[68px] shrink-0 flex-col items-center rounded-2xl border py-2.5 transition-colors lg:w-auto ${day === i ? 'border-gold bg-gold text-night' : 'border-white/15 text-bone/70 hover:border-gold/60'}`}
                  >
                    <span className="text-[10px] uppercase tracking-[0.14em] opacity-70">{d.weekday}</span>
                    <span className="font-display text-xl leading-tight">{d.label.split(' ')[0]}</span>
                    <span className="text-[10px] opacity-70">{d.label.split(' ')[1]}</span>
                  </button>
                ))}
              </div>
              <div className="mb-3 mt-5 flex items-baseline justify-between">
                <p className="eyebrow text-bone/40">Time (India)</p>
                {!inIndia && <p className="text-[10px] text-bone/40">Your time shown below each slot</p>}
              </div>
              <div className="grid grid-cols-4 gap-2">
                {SLOTS.map((s) => (
                  <button
                    type="button"
                    key={s}
                    onClick={() => setSlot(s)}
                    aria-pressed={slot === s}
                    className={`rounded-xl border px-1 py-2 text-center transition-colors ${slot === s ? 'border-gold bg-gold text-night' : 'border-white/15 text-bone/80 hover:border-gold/60'}`}
                  >
                    <span className="block text-sm font-semibold tabular-nums">{s}</span>
                    {!inIndia && <span className="block text-[9px] opacity-70">{localTime(days[day], s)}</span>}
                  </button>
                ))}
              </div>
              <div className="mt-6 flex items-center gap-3">
                <button type="button" onClick={() => setStep(0)} className="h-12 rounded-full border border-white/15 px-5 text-sm text-bone/70 hover:border-gold/60">
                  Back
                </button>
                <button
                  type="button"
                  disabled={!slot}
                  onClick={() => setStep(2)}
                  className="inline-flex h-12 items-center gap-3 rounded-full bg-gold pl-6 pr-2 text-sm font-semibold text-night transition-all hover:bg-gold-soft disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {slot ? 'Continue' : 'Choose a slot'} <span className="grid h-8 w-8 place-items-center rounded-full bg-night text-gold">→</span>
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div key="s2" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.35, ease: EASE }}>
              <div className="flex items-center justify-between gap-3 rounded-2xl border border-gold/30 bg-gold/10 px-4 py-3">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.16em] text-gold/80">Your slot</p>
                  <p className="font-display text-xl">{when}</p>
                  {!inIndia && slot && <p className="text-[11px] text-bone/50">{localTime(days[day], slot)} your time</p>}
                </div>
                <button type="button" onClick={() => setStep(1)} className="text-xs text-gold underline-offset-4 hover:underline">
                  Change
                </button>
              </div>
              <div className="mt-4 grid gap-1 sm:grid-cols-2 sm:gap-5">
                <label>
                  <span className="sr-only">Your name</span>
                  <input className={input} placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" />
                </label>
                <label>
                  <span className="sr-only">City / country</span>
                  <input className={input} placeholder="City / country" value={city} onChange={(e) => setCity(e.target.value)} autoComplete="address-level2" />
                </label>
              </div>
              <label className="mt-1 block sm:mt-3">
                <span className="sr-only">Your goal</span>
                <input className={input} placeholder="Your goal: a house, retirement, a child’s education…" value={note} onChange={(e) => setNote(e.target.value)} />
              </label>
              <div className="mt-6 flex items-center gap-3">
                <button type="button" onClick={() => setStep(1)} className="h-12 rounded-full border border-white/15 px-5 text-sm text-bone/70 hover:border-gold/60">
                  Back
                </button>
                <button type="submit" className="inline-flex h-12 items-center gap-3 rounded-full bg-[#25D366] pl-6 pr-2 text-sm font-semibold text-night transition-colors hover:bg-[#3be07a]">
                  Confirm on WhatsApp <span className="grid h-8 w-8 place-items-center rounded-full bg-night text-[#25D366]">→</span>
                </button>
              </div>
              <p className="mt-3 text-[11px] text-bone/40">No obligation. Nothing is booked until Gulshan confirms with you on WhatsApp.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
}
