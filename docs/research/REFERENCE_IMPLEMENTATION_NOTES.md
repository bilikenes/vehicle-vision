# Reference Implementation Notes

## Scope and method

This document closes **Phase 1 — Reference extraction** from `docs/IMPLEMENTATION_PLAN.md`. The three local reference archives were inspected as implementation references for mechanics, layout behavior, typography, and responsive treatment only:

- `D:\web-sites\waabi`
- `D:\web-sites\eclipse`
- `D:\web-sites\daylight`

The locked Vehicle Vision landing direction remains `docs/design/landing/opening-and-editorial-typography.md`. Reference projects do not define Vehicle Vision branding, copy, palette, assets, or final component structure. Their value here is limited to concrete source-level patterns that can be adapted later.

The Phase 1 acceptance criteria are satisfied by:

1. documenting real local source paths and source handles for each adopted implementation pattern;
2. separating observed source behavior from Vehicle Vision adaptation guidance;
3. selecting an initial display-font candidate for the oversized editorial typography section.

No frontend scaffold, component implementation, package installation, or production asset import is part of this phase.

---

## Waabi — floating navigation and sticky hero mechanics

### Primary local sources

- `D:\web-sites\waabi\formatted_code\09l34yiix_nv9.formatted.js`
  - search handle: `Header`
  - useful area: approximately lines `7200–7370`
- `D:\web-sites\waabi\formatted_code\01~o_8v7-rduf.formatted.js`
  - search handle: `Hero`
  - useful area: approximately lines `830–980`

### Observed navigation behavior

Waabi's header is implemented as a fixed, centered shell rather than a conventional full-width navigation bar on larger screens. The source uses a `motion.header` with a compact desktop width and centered horizontal positioning. Its shell combines a translucent dark outer frame with a rounded light inner surface.

The navigation reacts to pointer capability and menu state:

- fine-pointer hover can expand submenu content;
- the menu button is circular and its two icon lines animate between hamburger and close states;
- expanded content is mounted with Motion/AnimatePresence;
- the reveal moves from `opacity: 0` and collapsed height toward visible auto height;
- some submenu content also transitions from a small blur and scale into its settled state;
- link hover uses a pink accent treatment;
- scroll progress appears inside the header as a narrow pink vertical progress fill when expanded;
- the collapsed state uses a pink horizontal progress bar driven by `scrollYProgress`.

The exact interaction is visible around lines 7330–7457: the header checks `(pointer: fine)`, sets the open state from `onPointerEnter` and clears it from `onPointerLeave`. The expanded panel component around lines 7227–7314 uses AnimatePresence, opacity, `height: auto`, blur and scale. Each row uses a `75 × 50` thumbnail slot, large label text and pink hover/active color. The menu icon lines converge at the same vertical position instead of rotating into an X.

The implementation is backed by Framer Motion's `useScroll()` and motion transforms rather than CSS-only scroll observers.

### Observed hero behavior

The Waabi hero uses a long scroll track with a full-viewport sticky visual layer:

- outer section height: about `250vh`;
- sticky visual: `top: 0`, full small-viewport height, full width;
- `useScroll()` supplies normalized progress;
- multiple `useTransform()` mappings drive media, overlay, headline, and paragraph changes;
- the media frame changes through a combination of calculated `clipPath` inset and `scale3d` transforms;
- target geometry is calculated from viewport size and a hidden target marker near the bottom of the scroll section;
- the visual transition is therefore geometry-driven rather than a fixed pixel animation.

### Vehicle Vision adaptation guidance

Waabi is the strongest reference for two mechanics that match the locked landing direction:

1. **Floating top-center navigation.** Reuse the centered fixed-shell principle and compact rounded geometry. Vehicle Vision should keep the approved dark/light palette and its own typography instead of reproducing Waabi's colors or exact dimensions.
2. **Sticky scroll hero with shrinking media.** Reuse the long-track + sticky-viewport pattern and progress-driven crop/scale calculation. The Vehicle Vision hero already targets roughly `220–280vh`, so Waabi's `250vh` implementation confirms the planned range is practical.

The Waabi implementation also supports keeping media shrink tied to normalized scroll progress while allowing headline/overlay transitions to use separate progress mappings.

Vehicle Vision implements the navigation behavior with local React state and CSS transitions. Fine-pointer enter/leave controls the panel, while focus and button click preserve keyboard and touch access. Menu labels remain Vehicle Vision placeholders and final thumbnail assets are intentionally pending.

---

## Eclipse — video scrub, media shrink, mask reveal, and display typography

### Primary local sources

- `D:\web-sites\eclipse\index.original.html`
  - `videoScrub()` around lines `3033–3169`
  - `bgImageAnimation()` around lines `3171–3224`
  - `[diag-mask]` reveal helper around lines `2392–2416`
  - Lenis / ScrollTrigger integration around lines `2520–2555`
- `D:\web-sites\eclipse\formatted_code\eclipse-dev.webflow.shared.c0cd10af5.formatted.css`
  - large gradient mask definitions around lines `105–132`
  - `.heading-style-display.home_span` around line `7989`
  - `.section_home-hero-track` around line `8255`
  - `.bg_image-wrapper` around line `8891`
  - `.home-hero_sticky-wrapper` around line `15669`
  - mobile hero-track override around line `18021`
  - font-face and typography-variable mappings around lines `4160–4325`

### Sticky geometry

The Eclipse hero separates the scroll track from the viewport-pinned content:

- `.section_home-hero-track` has approximately `min-height: 300vh` on desktop;
- `.home-hero_sticky-wrapper` uses `height: 100vh` and `position: sticky` at the viewport top;
- the background/media layer fills the viewport independently inside that sticky context;
- a mobile breakpoint reduces the track to about `200vh`.

This structure is directly compatible with the Vehicle Vision requirement that the opening media remains the dominant stage while the page consumes more scroll distance than one viewport.

### Video scrub

`videoScrub()` is the most useful source-level reference for the temporary/final hero video behavior. It:

- targets the long hero track and the scrub video element;
- configures source, preload, muted playback, and `playsInline`;
- waits for video metadata and also has an `8s` timeout path;
- animates a proxy object from progress `0` to `1`;
- on every update, seeks to `proxyProgress × video.duration`;
- gates seeks while the video is already seeking and retains a pending target time;
- uses ScrollTrigger with `start: 'top top'`, `end: 'bottom bottom'`, and `scrub: 0.4`;
- primes media playback on the first touch, pointer, or click for mobile/iOS behavior.

A particularly useful implementation detail is that the animation reads `video.duration` during updates instead of capturing the duration too early. This avoids coupling the timeline to a duration value that may not yet be available when the timeline is created.

### Media shrink and crop

Eclipse keeps the media framing animation separate from the video scrub timeline. `bgImageAnimation()`:

- uses the same hero scroll track;
- rebuilds its geometry on resize;
- differentiates `<991`, `991–1439`, and `>=1440` viewport ranges;
- calculates clip inset from viewport geometry and a fixed `1440 / 810` aspect ratio;
- applies an inset `clipPath` with a small rounded corner;
- combines clip-path change with media scale;
- uses different final scale values for mobile, tablet, and desktop.

This confirms an important implementation choice for Vehicle Vision: **video time scrub and media-frame shrink should be separate scroll-driven concerns that share the same track**. That separation makes the final hero frame easier to tune without changing scrub timing.

### Reveal / mask behavior

Eclipse also contains a diagonal mask reveal driven by GSAP. The `[diag-mask]` helper uses a `fromTo` animation with `ease: 'none'` and a ScrollTrigger start around `top 85%`. The CSS defines the corresponding large gradient mask surface.

For Vehicle Vision Section 02, the useful pattern is the source-backed principle of **mask-position reveal tied directly to scroll**, not the exact Eclipse diagonal artwork. The locked Section 02 design calls for oversized scattered typography with restrained mask reveal and mild opacity/contrast settling. A simpler mask shape should therefore be built for the actual letter composition rather than copying Eclipse's mask asset or geometry.

### Lenis status

The local Eclipse source explicitly wires Lenis scroll events into ScrollTrigger through `ScrollTrigger.update`. That proves Lenis participates in Eclipse's scrolling stack, but it does **not** make Lenis a Phase 2 requirement for Vehicle Vision. The first implementation should use the project's chosen scrolling/runtime stack and introduce Lenis only if native scrolling plus GSAP/animation timing cannot meet the locked feel.

### Typography evidence

The Eclipse CSS declares the following local font mappings:

- `Gortonperfectedvf` → `GortonPerfectedVF.woff2`
- `Eclipsespace Display` → `EclipseSpace-Display.woff2`
- `Gt Mechanik Poly` → multiple GT Mechanik Poly font resources

The typography variables show a clear role split:

- body/general heading work is primarily mapped to `Gt Mechanik Poly`;
- `heading-2`, `eclipse`, and `display-1` style roles use `Eclipsespace Display`;
- eyebrow treatment uses `Gortonperfectedvf`.

`.heading-style-display.home_span` uses the Eclipse display family in uppercase with approximately `font-size: clamp(4.5rem, 9vw, 8.75rem)` and `line-height: 1.07em`.

### Vehicle Vision adaptation guidance

Eclipse is the primary implementation reference for:

- scroll-scrubbed hero video;
- long-track sticky geometry;
- separating scrub from shrink/crop timelines;
- resize-aware final media framing;
- mask-based editorial text reveal;
- oversized display-type role assignment.

The implementation should preserve those mechanics while using Vehicle Vision's locked palette, copy, dimensions, and much quieter visual language.

---

## Daylight — media framing, spacing, responsive crop, and small UI

### Primary local sources

- `D:\web-sites\daylight\index.html`
  - search handles: `lg:h-[200vh]`, `sticky top-0 hero-container`, `hero-inner-tight`, `hero-inner-loose`, `aspect-[326/204]`
- `D:\web-sites\daylight\formatted_code\6efed0ba03825d50.formatted.css`
  - `.hero-container`, `.hero-inner-tight`, `.hero-inner-loose` around lines `914–966`

### Observed hero framing

Daylight uses a simple but strong dominant-media structure:

- homepage outer section is approximately `200vh` on large screens;
- the main visual container is sticky at the top;
- `.hero-container` fills one viewport and applies viewport-relative page padding;
- the media shell fills the remaining width and height;
- media overflow is clipped;
- border radius scales from `rounded-2xl` toward `rounded-3xl` on large screens.

The CSS spacing becomes progressively more generous with viewport size:

- `.hero-container` begins with approximately `vw-2` padding;
- tablet increases the padding to about `vw-4`;
- desktop uses about `vw-6`;
- `.hero-inner-tight` becomes asymmetrical at desktop, with materially different top/right/bottom/left spacing;
- `.hero-inner-loose` includes header-aware top spacing on smaller screens and resets it at desktop.

The homepage also supplies separate desktop/mobile hero images and adjusts `object-position` on smaller screens, showing that the media crop is intentionally art-directed per breakpoint rather than left entirely to one `object-fit: cover` rule.

### Small media / CTA behavior

Daylight includes a small preview video control with roughly `326 / 204` aspect ratio, responsive width, and rounded corners. Hover swaps the preview state and slightly enlarges the play affordance. A separate compact status/CTA cluster sits toward the desktop lower-right.

### Vehicle Vision adaptation guidance

Daylight is the strongest reference for **how the large hero media should sit inside the page**:

- use viewport-relative outer padding instead of a fixed max-width card;
- preserve a generous rounded media frame;
- tune the crop separately for mobile and desktop;
- allow inner copy/CTA spacing to become asymmetric on wide screens;
- keep small utility UI subordinate to the primary media.

For the locked Vehicle Vision opening, this supports the planned centered media target of roughly `80–88vw × 70–78vh` before the scroll-driven shrink begins.

### Viewport-fit corner anchoring

The homepage source adds `hero-container` to the sticky opening wrapper. In `formatted_code/6efed0ba03825d50.formatted.css` lines 914–929, that utility sets `height: 100svh`, `width: 100%` and responsive viewport spacing. The direct media wrapper is `relative w-full h-full overflow-hidden`; its content layer is also `h-full`. Inside it, the main content column uses `flex flex-col justify-between flex-1 hero-inner-loose lg:hero-inner-tight`, while the desktop action column uses `justify-end` with explicit right/bottom padding.

This hierarchy keeps corner content tied to the padded viewport rather than to a width-derived media height. Vehicle Vision adopts the same geometry principle with original component markup and styling: `OpeningScene` is `100svh`, the frame fills its padded content box, and the copy/CTA stay inset inside that frame.

---

## Display font comparison and provisional selection

The two most relevant Eclipse families for Vehicle Vision Section 02 are `Eclipsespace Display` and `Gt Mechanik Poly` because their actual source roles are visible in the reference CSS.

### Eclipsespace Display

Source evidence:

- explicitly mapped to display-oriented typography variables;
- used by the oversized uppercase `.heading-style-display.home_span` treatment;
- already proven in a layout where very large words act as composition rather than ordinary paragraph headings.

Fit for Vehicle Vision:

- stronger candidate for the exact Section 02 copy:
  - `ONE IMAGE`
  - `MORE THAN IT SHOWS.`
  - `THE SYSTEM`
  - `SEES FURTHER.`
- better aligned with the planned scattered editorial composition and the requirement to avoid generic/common web-font character.

### Gt Mechanik Poly

Source evidence:

- used as Eclipse's body/general heading workhorse;
- provides a more system-like and utilitarian typographic role in that source.

Fit for Vehicle Vision:

- potentially useful later for secondary headings or compact UI typography if its metrics fit the final system;
- less directly supported by the reference source for the oversized expressive Section 02 role.

### Provisional Phase 1 choice

**Initial display-font candidate: `Eclipsespace Display`.**

This is a design/prototyping choice based on the inspected reference source, not a licensing conclusion. Before any external font file is copied or shipped, its license and redistribution rights must be verified separately. Phase 1 therefore records the family as the visual candidate; it does not import the font asset into Vehicle Vision.

If licensing prevents use, Phase 2 should preserve the measured visual requirements—wide editorial display presence, strong uppercase silhouette, compact line-height, distinctive but readable letterforms—while substituting a legally usable family with similar metrics.

---

## Concrete implications for Vehicle Vision implementation

### Phase 2 — foundation

Phase 2 can now establish the frontend foundation against a clearer set of mechanical requirements:

- support a fixed/floating centered navigation shell;
- support a full-viewport sticky hero inside a multi-viewport scroll track;
- keep media and foreground copy inside the same hero stage;
- establish the locked palette tokens:
  - `#F2F0EA`
  - `#0B0B0B`
  - `#FAF8F4`
  - `#FF3B5C`;
- introduce the display-type role separately from body/UI typography;
- keep the hero video source replaceable because the current main video is temporary.

### Phase 3 — opening hero

The implementation should combine the references as follows:

- **Waabi:** fixed floating nav, normalized scroll progress, sticky `~250vh` hero logic;
- **Eclipse:** robust media scrub, pending seek gate, separate shrink/crop timeline, resize rebuild;
- **Daylight:** dominant centered rounded media framing and breakpoint-specific crop/spacing.

Target behavior remains the locked Vehicle Vision design:

- lower-left copy stays over the video: `One image.` / `More than meets the eye.`;
- lower-right CTA stays over the video: `TRY IT NOW ↗`;
- lower-center cue stays small and red;
- hero media begins around `80–88vw × 70–78vh` on desktop;
- the section consumes roughly `220–280vh`;
- media shrinks toward roughly `55–68vw` by the end of the hero scroll.

### Phase 4 — editorial typography section

Section 02 should use Eclipse only for the reveal mechanic and display-type evidence. The actual composition remains the locked Vehicle Vision design:

- scattered oversized typography;
- exact approved four-line copy;
- one central `O`—preferably in `SHOWS`—replaced by a rotating wheel;
- scroll-driven character color reveal;
- natural document flow rather than a pinned typography stage;
- desktop composition tuned first for roughly `1440–1920px` widths.

The wheel and typography should feel editorial and physical. Avoid adding HUD grids, telemetry text, glowing AI motifs, or unrelated motion systems.

#### Verified Eclipse reveal mechanic

The archived homepage implements this passage in `D:\web-sites\eclipse\index.html` lines 3262–3293. It selects `.section_own .home-span_title` and `.font-family-surt`, splits their text into words and characters with SplitType, and initializes the characters to `#EAEAEA`. A GSAP tween changes them to `#000000` in document order with `steps(1)` easing and `scrub: 0.1`.

The responsive timing is explicit in the source:

- desktop (`min-width: 992px`): stagger `0.03`, start `top 85%`, end `bottom top`;
- mobile (`max-width: 991px`): stagger `0.015`, start `top bottom`, end `bottom 70%`.

The trigger is `.own-title_wrapper`, not a multi-viewport sticky track. The reference CSS in `D:\web-sites\eclipse\formatted_code\eclipse-dev.webflow.shared.c0cd10af5.formatted.css` lines 8315–8344 gives the section and wrapper ordinary flow layout; the oversized heading supplies the reveal's physical scroll distance. Vehicle Vision preserves its original four-line composition and existing React character markup while adopting these trigger semantics, so an additional SplitType runtime dependency is unnecessary.

Eclipse has substantial content after this passage, so `bottom top` remains reachable. Vehicle Vision currently ends shortly after Section 02; its matching end expressions therefore use ScrollTrigger's `clamp(...)` form. This avoids an artificial spacer and still restores the reference endpoints automatically when later homepage sections provide enough document height.

---

## Source index

| Reference | Local source | Evidence handle |
| --- | --- | --- |
| Waabi | `D:\web-sites\waabi\formatted_code\09l34yiix_nv9.formatted.js` | `Header`, `useScroll`, `scrollYProgress`, `motion.header`; approx. `7200–7370` |
| Waabi | `D:\web-sites\waabi\formatted_code\01~o_8v7-rduf.formatted.js` | `Hero`, `useTransform`, `clipPath`, `scale3d`; approx. `830–980` |
| Eclipse | `D:\web-sites\eclipse\index.original.html` | `videoScrub()`; approx. `3033–3169` |
| Eclipse | `D:\web-sites\eclipse\index.original.html` | `bgImageAnimation()`; approx. `3171–3224` |
| Eclipse | `D:\web-sites\eclipse\index.original.html` | `[diag-mask]`; approx. `2392–2416` |
| Eclipse | `D:\web-sites\eclipse\index.original.html` | Lenis → `ScrollTrigger.update`; approx. `2520–2555` |
| Eclipse | `D:\web-sites\eclipse\formatted_code\eclipse-dev.webflow.shared.c0cd10af5.formatted.css` | mask CSS; approx. `105–132` |
| Eclipse | `D:\web-sites\eclipse\formatted_code\eclipse-dev.webflow.shared.c0cd10af5.formatted.css` | font-face/typography variables; approx. `4160–4325` |
| Eclipse | `D:\web-sites\eclipse\formatted_code\eclipse-dev.webflow.shared.c0cd10af5.formatted.css` | `.heading-style-display.home_span`; approx. `7989` |
| Eclipse | `D:\web-sites\eclipse\formatted_code\eclipse-dev.webflow.shared.c0cd10af5.formatted.css` | `.section_home-hero-track`; approx. `8255` |
| Eclipse | `D:\web-sites\eclipse\formatted_code\eclipse-dev.webflow.shared.c0cd10af5.formatted.css` | `.bg_image-wrapper`; approx. `8891` |
| Eclipse | `D:\web-sites\eclipse\formatted_code\eclipse-dev.webflow.shared.c0cd10af5.formatted.css` | `.home-hero_sticky-wrapper`; approx. `15669` |
| Daylight | `D:\web-sites\daylight\index.html` | `lg:h-[200vh]`, `sticky top-0 hero-container`, `hero-inner-tight`, `hero-inner-loose`, `aspect-[326/204]` |
| Daylight | `D:\web-sites\daylight\formatted_code\6efed0ba03825d50.formatted.css` | `.hero-container`, `.hero-inner-tight`, `.hero-inner-loose`; approx. `914–966` |

## Phase 1 completion state

- Waabi floating navigation and hero mechanics: documented.
- Eclipse scrub, shrink, sticky geometry, mask reveal, Lenis integration, and typography mappings: documented.
- Daylight media framing, spacing, responsive crop, and subordinate UI treatment: documented.
- Initial Section 02 display-font candidate: **Eclipsespace Display**.
- Frontend foundation: **not started in this phase**.
