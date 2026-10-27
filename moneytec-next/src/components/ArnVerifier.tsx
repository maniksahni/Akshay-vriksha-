import { useState } from 'react';
import { ArrowUpRight, Copy, Fingerprint } from 'lucide-react';
import { FACTS } from '../data';
import { FadeIn } from './ui';

export function ArnVerifier() {
  const [message, setMessage] = useState('');
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(FACTS.arn.replace('ARN-', ''));
      setMessage('105840 copied. Paste it into the ARN search on AMFI.');
    } catch {
      setMessage('Copy 105840 manually, then search for it on AMFI.');
    }
  };
  return (
    <section id="arn-verifier" className="arn-section" aria-labelledby="arn-title">
      <div className="wrap-wide arn-layout">
        <FadeIn className="arn-intro">
          <p className="section-index">TRANSPARENCY / BUILT IN</p>
          <h2 id="arn-title">Trust you can<br /><em>check for yourself.</em></h2>
          <p>Meet the person. Check the registration. Make your own informed choice.</p>
          <a href="#gulshan" className="arn-person-link">Get to know Gulshan <ArrowUpRight size={15} aria-hidden="true" /></a>
        </FadeIn>
        <FadeIn className="arn-panel" delay={.1}>
          <div className="arn-panel-top"><Fingerprint size={28} aria-hidden="true" /><span>ARN VERIFICATION<br /><small>Official AMFI lookup</small></span></div>
          <p className="arn-holder">{FACTS.name}</p>
          <p className="arn-role">Mutual Fund Distributor</p>
          <div className="arn-number-row"><div><span>AMFI REGISTRATION NUMBER</span><strong>{FACTS.arn}</strong></div><button type="button" onClick={copy} aria-label="Copy ARN number 105840"><Copy size={16} aria-hidden="true" /> Copy</button></div>
          <a className="arn-lookup-button" href={FACTS.amfiLocator} target="_blank" rel="noopener noreferrer">Open official AMFI lookup <ArrowUpRight size={19} aria-hidden="true" /></a>
          <ol className="arn-instructions"><li><span>01</span><div>Copy the ARN number above.</div></li><li><span>02</span><div>On AMFI, search <strong>105840</strong> or <strong>Gulshan Kohli</strong>.</div></li><li><span>03</span><div>Review the current registration details on AMFI.</div></li></ol>
          <p className="arn-status" role="status">{message}</p>
          <p className="arn-note">Verification is completed on AMFI’s website. This panel does not display live registration status.</p>
        </FadeIn>
      </div>
    </section>
  );
}
