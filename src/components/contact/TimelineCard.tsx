import React from 'react';
import { Clock, ShieldCheck, UserCheck } from 'lucide-react';

export const TimelineCard: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Confidential Review within 24 Hours',
      desc: 'Our senior wealth advisory desk reviews your profile, residency status, and primary financial objectives with absolute confidentiality.',
      icon: <Clock className="w-4 h-4 text-gold-dull" />,
      tag: '< 24 Hours SLA',
    },
    {
      step: '02',
      title: 'Virtual Advisory Session & Strategy Deck',
      desc: 'A 45-minute private consultation (IST, EST, GST, GMT, SGT) with a tailored asset allocation roadmap, tax optimization notes, and risk audit.',
      icon: <UserCheck className="w-4 h-4 text-gold-dull" />,
      tag: 'Timezone Aligned',
    },
    {
      step: '03',
      title: 'Paperless Execution & Dedicated Fiduciary',
      desc: 'Seamless onboarding through AMCs and Kotak Life with zero physical paperwork and a dedicated relationship strategist.',
      icon: <ShieldCheck className="w-4 h-4 text-gold-dull" />,
      tag: 'Fiduciary Care',
    },
  ];

  return (
    <div className="bg-pine-deep text-ivory-sand p-7 sm:p-8 rounded-2xl border border-gold-dull/30 shadow-luxury space-y-6">
      <div className="border-b border-white/10 pb-4">
        <span className="text-[10px] font-mono uppercase tracking-widest text-gold-radiant block mb-1">
          Guaranteed Protocol
        </span>
        <h3 className="font-serif text-xl sm:text-2xl text-ivory-sand font-semibold">
          What Happens Next?
        </h3>
        <p className="text-xs text-ivory-sand/70 mt-1">
          Our 3-step client onboarding SLA guarantees complete transparency.
        </p>
      </div>

      <div className="space-y-5">
        {steps.map((s) => (
          <div key={s.step} className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-lg bg-pine-secondary border border-gold-dull/30 flex items-center justify-center font-serif text-sm font-bold text-gold-radiant shrink-0">
              {s.step}
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold text-ivory-sand uppercase tracking-wider">
                  {s.title}
                </h4>
              </div>
              <p className="text-xs text-ivory-sand/75 leading-relaxed font-sans">
                {s.desc}
              </p>
              <span className="inline-block text-[10px] font-mono text-gold-dull pt-0.5">
                {s.tag}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-ivory-sand/60">
        <span>AMFI ARN Registered</span>
        <span>•</span>
        <span>Kotak Life Authorized</span>
        <span>•</span>
        <span>Strict Non-Disclosure</span>
      </div>
    </div>
  );
};
