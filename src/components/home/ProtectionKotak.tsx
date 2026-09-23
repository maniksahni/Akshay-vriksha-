import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, HeartHandshake, FileText, ArrowUpRight, ShieldAlert } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface ProtectionKotakProps {
  onOpenConsultation: (goal?: string) => void;
}

export const ProtectionKotak: React.FC<ProtectionKotakProps> = ({ onOpenConsultation }) => {
  const protectionFeatures = [
    {
      title: 'High-Sum-Assured Term Shields',
      desc: 'Bespoke high-cover pure protection policies engineered to replace lifetime earning potential and secure family liquidity without compromising lifestyle.',
      icon: <ShieldCheck className="w-5 h-5 text-gold-dull" />,
      tag: 'Income Replacement',
    },
    {
      title: 'MWP Act Trust Ring-Fencing',
      desc: 'Policies issued under the Married Women’s Property Act (1874) creating a legally unassailable trust. Creditors, business liabilities, and court attachments cannot touch policy proceeds.',
      icon: <Lock className="w-5 h-5 text-gold-dull" />,
      tag: 'Liability Protection',
    },
    {
      title: 'Keyman & Succession Insurance',
      desc: 'Safeguarding enterprise continuity by insuring critical promoters, partners, and C-suite executives against unexpected contingencies and business disruption.',
      icon: <FileText className="w-5 h-5 text-gold-dull" />,
      tag: 'Corporate & SME',
    },
    {
      title: 'Critical Illness & Living Benefits',
      desc: 'Comprehensive protection against 35+ major critical health conditions, providing lump-sum capital injections to fund world-class treatments without touching long-term investment assets.',
      icon: <HeartHandshake className="w-5 h-5 text-gold-dull" />,
      tag: 'Health Umbrella',
    },
  ];

  return (
    <section id="protection" className="py-24 bg-ivory-warm border-y border-border-hairline relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-16">
          <div className="lg:col-span-8 space-y-3">
            <Badge variant="pine" size="md" icon={<Lock className="w-3.5 h-3.5 text-pine-deep" />}>
              Pillar 02 • Kotak Life Authorized Partner
            </Badge>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-pine-deep font-normal tracking-tight">
              Defensive Architecture: Shielding Generational Capital
            </h2>
            <p className="text-charcoal-muted text-sm sm:text-base font-sans leading-relaxed max-w-3xl">
              Wealth without unyielding protection is vulnerable to life shocks and business liabilities. In strategic collaboration with Kotak Life, we engineer institutional risk mitigation frameworks.
            </p>
          </div>
          <div className="lg:col-span-4 flex lg:justify-end">
            <div className="p-4 rounded-xl bg-white border border-gold-dull/30 shadow-subtle flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-pine-deep text-gold-dull">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div className="text-xs">
                <div className="font-bold text-pine-deep uppercase tracking-wider">
                  Kotak Life Partner Desk
                </div>
                <div className="text-charcoal-muted">Authorized Corporate Alliance</div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Protection Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {protectionFeatures.map((feat, idx) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="flex"
            >
              <Card
                variant="light"
                padding="lg"
                className="flex flex-col justify-between w-full h-full border-border-hairline bg-white"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-lg bg-ivory-warm border border-gold-dull/20 text-pine-deep">
                      {feat.icon}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gold-dull px-2.5 py-0.5 rounded-full bg-ivory-warm border border-gold-dull/30">
                      {feat.tag}
                    </span>
                  </div>
                  <h3 className="font-serif text-lg font-semibold text-pine-deep">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-charcoal-muted leading-relaxed font-sans">
                    {feat.desc}
                  </p>
                </div>

                <div className="pt-6 mt-4 border-t border-border-hairline/60">
                  <button
                    type="button"
                    onClick={() => onOpenConsultation(`Protection Inquiry: ${feat.title}`)}
                    className="text-xs font-semibold uppercase tracking-wider text-pine-deep hover:text-gold-dull flex items-center justify-between w-full group"
                  >
                    <span>Request Policy Audit</span>
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Strategic Callout Banner */}
        <div className="rounded-2xl p-7 sm:p-9 bg-pine-deep text-ivory-sand border border-gold-dull/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-luxury">
          <div className="space-y-2 max-w-2xl text-center md:text-left">
            <span className="text-xs font-mono uppercase tracking-widest text-gold-radiant">
              MWP Act & Estate Continuity
            </span>
            <h3 className="font-serif text-xl sm:text-2xl text-ivory-sand font-normal">
              Is your family’s fortune protected from future business claims or legal liabilities?
            </h3>
            <p className="text-xs text-ivory-sand/75">
              Let us audit your current insurance coverage and structure policies under the Married Women’s Property Act for absolute legal segregation.
            </p>
          </div>
          <Button
            variant="gold"
            size="md"
            icon={<ArrowUpRight className="w-4 h-4" />}
            onClick={() => onOpenConsultation('Kotak Estate Shield Audit')}
          >
            Request Family Risk Audit
          </Button>
        </div>
      </div>
    </section>
  );
};
