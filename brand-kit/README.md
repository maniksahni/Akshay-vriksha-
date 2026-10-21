# Akshaya Vriksha — brand kit

The mark is a temple arch sheltering the *akshaya vriksha*, the inexhaustible tree. Its leaves double as coins, and its roots spread along the ground line.

## Files

| File | Use it for |
|---|---|
| `svg/akshaya-vriksha-logo-horizontal-on-dark.svg` | Website header and footer on dark backgrounds |
| `svg/akshaya-vriksha-logo-horizontal-on-light.svg` | Letterheads, documents, light backgrounds |
| `svg/akshaya-vriksha-logo-stacked-on-dark.svg` / `-on-light.svg` | Square spaces: social profile banners, visiting cards |
| `svg/akshaya-vriksha-mark.svg` | The symbol alone, on dark |
| `svg/akshaya-vriksha-mark-on-light.svg` | The symbol alone, on light |
| `svg/akshaya-vriksha-mark-mono-white.svg` / `-mono-black.svg` | One-colour printing, stamps, embossing |
| `svg/favicon.svg`, `png/favicon-32.png` | Browser tab icon |
| `png/favicon-180.png` | iPhone home-screen icon (apple-touch-icon) |
| `png/favicon-192.png`, `png/favicon-512.png` | Android / web-app icons |
| `png/app-icon-1024.png` | WhatsApp Business / Instagram profile picture |
| `png/*@3x.png` | High-resolution PNGs with transparent backgrounds, for anywhere SVG isn't accepted |
| `png/akshaya-vriksha-logo-with-devanagari-on-dark.png` | Lockup with अक्षयवृक्षः, for print and social posts |

The English wordmark in every SVG is converted to outlines, so the files look identical everywhere with no fonts installed. The Devanagari name is supplied as PNG only, because it needs proper script shaping.

## Colours

| Name | Hex | Role |
|---|---|---|
| Gold | `#D9AE5B` | Arch, leaves, accents |
| Soft gold | `#E9CD8F` | Crown leaf, highlights |
| Deep gold | `#A9802F` | Gold on light backgrounds |
| Night | `#06110D` | Primary dark background |
| Bone | `#F3EEE5` | Light background, text on dark |
| Ink | `#13201B` | Text on light |

## Typefaces (free, Google Fonts)

- **Instrument Serif:** wordmark and headings
- **Manrope:** tagline and body text
- **Tiro Devanagari Sanskrit:** अक्षयवृक्षः and Sanskrit lines

## Usage

- Keep clear space around the logo equal to the height of the crown leaf (the large top circle).
- Don't stretch, recolour outside the palette, add shadows, or place the dark-background version on light backgrounds.
- Smallest size: the mark at 24px on screen, and the horizontal logo at 140px wide.

## Moving it to the main website

Copy `svg/favicon.svg`, `png/favicon-32.png` and `png/favicon-180.png` into the site, and add these lines inside `<head>`:

```html
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
<link rel="apple-touch-icon" href="/favicon-180.png" />
```

Use `svg/akshaya-vriksha-logo-horizontal-on-dark.svg` (or `-on-light.svg`) as the header logo.
