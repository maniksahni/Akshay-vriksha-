import { motion } from 'framer-motion';
import { EASE } from './ui';

/** The supplied verse, preserved verbatim, with a quiet connection to regular saving. */
export function Wisdom() {
  return (
    <section id="philosophy" data-dark className="wisdom-section" aria-labelledby="wisdom-title">
      <div className="wrap-wide">
        <motion.div className="wisdom-frame" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .15 }} transition={{ duration: .8, ease: EASE }}>
          <div className="wisdom-context">
            <p className="kicker">The power of consistency</p>
            <h2 id="wisdom-title">Small steps.<br /><span className="serif grad">Lasting growth.</span></h2>
            <div className="wisdom-drops" aria-hidden="true"><span /><i /><i /><i /><b /></div>
          </div>
          <div className="wisdom-verse">
            <blockquote lang="sa"><span>जलबिन्दुनिपातेन क्रमशः पूर्यते घटः ।</span><span>स हेतुः सर्वविद्यानां धर्मस्य च धनस्य च ॥</span></blockquote>
            <p className="wisdom-meaning">Drop by drop, a pot fills. In the same way, steady effort builds knowledge, virtue and wealth.</p>
            <p className="wisdom-connection">A thought to carry into your financial journey: begin with a step you can sustain.</p>
            <a href="#calculator" className="wisdom-link">Explore a monthly SIP <span aria-hidden="true">↗</span></a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
