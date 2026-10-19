# Studio OS landing page

Self-contained HTML, CSS, and JavaScript, deployed from this directory by
`.github/workflows/pages.yml`. No build step or third-party requests are needed.

Preview locally:

```sh
python3 -m http.server 4387 --bind 127.0.0.1 --directory website
```

## Design

The October 2026 refresh uses the approved S mark from the Agensi listing.
A project document stack is the main visual: the visitor can move between a
brief, delivery plan, and outcome report. Supporting sections explain the
workflow, bounded subagents, an explicitly fictional product example, and
installation. The product remains labelled alpha and free/MIT.

Palette: paper `#f3f6f5`, ink `#172d2c`, deep teal `#193e3b`, teal `#316e69`,
mint `#dfece6`, orange `#d87b50`. Self-hosted Manrope is used throughout.

Layout: text and a document workspace share the first screen; a quiet benefits
section leads into a three-phase route, delegation diagram, product example,
and installation. At mobile widths, the workspace follows the headline and
the process becomes vertical. Avoid repeated decorative section entrances;
animation explains the documents and their connections.

## Motion and fallbacks

`motion.js` progressively enhances the page with GSAP 3.15.0 and ScrollTrigger:

- One initial document-stack and headline sequence.
- User-triggered transitions between the three example documents.
- A scroll-linked route and an entrance for the delegation diagram.
- `gsap.matchMedia()` disables motion for `prefers-reduced-motion: reduce`
  and reverts animations when the preference or desktop breakpoint changes.

Content is visible by default; missing animation scripts do not disable the
page. With JavaScript disabled, all three installation methods are visible.
Clipboard failures select the command and announce a manual-copy fallback.
The site does not hijack scrolling, pin sections, or run infinite animations.

Library and font provenance is documented in `vendor/README.md` and the font's
`OFL.txt`. Update the CSS/JS revision query in `index.html` after future changes
so cached assets do not conflict with a newly published HTML document.

## Validation

```sh
node --check website/script.js
node --check website/motion.js
node --import tsx --test tests/structure/site.test.ts
```

The refresh was checked in the Codex browser at 320, 390, 768, and desktop
widths: no horizontal page overflow; artifact and workflow tabs, keyboard
navigation, installation panels, and actual copied command text were verified.
The reduced-motion and no-JavaScript fallbacks were reviewed in source, not
emulated in that browser. The Spoke image is an illustrative concept, not
customer evidence.
