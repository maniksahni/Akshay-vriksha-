import { INSTAGRAM_REELS } from '../instagram';

/** Shows Gulshan's own recent reels; each card opens that exact post on Instagram. */
export function InstagramReels() {
  if (INSTAGRAM_REELS.length !== 4 || INSTAGRAM_REELS.some((reel) => !reel.href || !reel.image)) return null;

  return (
    <section id="instagram" className="instagram-section bg-white py-14 sm:py-20" aria-labelledby="instagram-title">
      <div className="wrap-wide">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="eyebrow text-link">From Gulshan</p>
            <h2 id="instagram-title" className="display mt-1 text-[clamp(2rem,4.6vw,3.3rem)]">Watch on Instagram.</h2>
          </div>
          <a className="textlink" href="https://www.instagram.com/akshayavriksha/" target="_blank" rel="noreferrer">See all reels ↗</a>
        </div>
        <div className="instagram-grid mt-7 grid grid-cols-2 gap-3 sm:mt-9 sm:grid-cols-4 sm:gap-4">
          {INSTAGRAM_REELS.map((reel, index) => (
            <a key={reel.href} href={reel.href} target="_blank" rel="noreferrer" aria-label={`Watch reel ${index + 1}: ${reel.alt} on Instagram`} className="instagram-reel group relative block overflow-hidden rounded-2xl bg-[#161617]">
              <img src={reel.image} alt={reel.alt} loading="lazy" decoding="async" className="aspect-[9/13] w-full object-cover transition-transform duration-500 group-hover:scale-[1.035]" />
              <span className="instagram-play absolute bottom-3 right-3 grid h-10 w-10 place-items-center rounded-full bg-black/65 text-white backdrop-blur-sm" aria-hidden="true">
                <svg viewBox="0 0 24 24" className="ml-0.5 h-4 w-4" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
