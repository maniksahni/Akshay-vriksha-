export type InstagramReel = { href: string; image: string; alt: string };

// First four reels supplied by the account owner; preview images are Instagram's own covers.
export const INSTAGRAM_REELS: InstagramReel[] = [
  { href: 'https://www.instagram.com/reel/DaMqCmGB4Ai/', image: './instagram/reel-1.webp', alt: 'Equity and debt through changing markets' },
  { href: 'https://www.instagram.com/reel/Dc0grUSBPZi/', image: './instagram/reel-2.webp', alt: 'Family income protection with life cover' },
  { href: 'https://www.instagram.com/reel/DWLh6VvgVKl/', image: './instagram/reel-3.webp', alt: 'Protecting your money during uncertainty' },
  { href: 'https://www.instagram.com/reel/DV7-_Y8utH_/', image: './instagram/reel-4.webp', alt: 'Explainer about the dollar and gold' },
];
