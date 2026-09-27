# Landing Page — Opening Scene + Typography Section

## Design & Interaction Specification

**Scope status:** LOCKED for the first two homepage sections  
**Project context:** AI-powered vehicle image analysis website  
**Covered sections:**
1. Opening Scene / Cinematic Hero
2. Editorial Typography Section

This document defines the visual direction, layout, motion, scroll behavior, hover behavior, typography, color system, responsive behavior, and implementation expectations for the first two homepage sections.

The goal is **not** to build a conventional SaaS hero. The first screen must feel like a designed visual experience: cinematic, editorial, premium, minimal, and distinctive. The user should first encounter the character of the product, not a file-upload component.

## Direction contract

**THESIS:** Vehicle analysis begins as cinematic observation; the first viewport refuses the conventional headline-and-upload layout.

**OWN-WORLD:** Warm graphite-on-paper surfaces, one signal-red punctuation, compact instrument-like navigation and a dominant rounded vehicle image.

**STORY:** The visitor first sees the subject, then reads the promise and reaches the future analysis action.

**FIRST VIEWPORT:** A centered hero frame occupies 95% of the viewport width beneath or behind a top-center floating nav. Supporting copy and CTA sit in white over the media at its lower corners; a tiny red cue anchors the lower center.

**FORM:** Locked source-inspection landing direction; position 1; seed key: pinned-vehicle-vision-opening.

**FINISH:** unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.

---

# 1. Core Design Principles

## 1.1 What this homepage must NOT look like

Avoid the common modern landing-page formula:

- giant left-aligned headline + paragraph + CTA,
- upload box visible immediately on entry,
- generic SaaS cards,
- neon AI gradients,
- floating glassmorphism panels,
- dense computer-vision HUD overlays,
- large amounts of technical copy,
- a full-screen autoplay background video that loops endlessly,
- a dashboard disguised as a landing page.

The user should not enter the site and think, “I have seen this hero on dozens of AI websites.”

## 1.2 Desired character

The visual language should combine:

- **cinematic automotive imagery,**
- **editorial composition,**
- **strong condensed display typography,**
- **generous warm negative space,**
- **small precise interface elements,**
- **scroll-driven motion with semantic purpose,**
- **tiny red accents used as a recurring visual signature.**

The site should feel intentionally composed rather than template-driven.

## 1.3 Show first, explain later

The opening scene should create curiosity. It does not need to explain every feature.

The opening sequence communicates:

> There is a real vehicle. The system observes it. Something intelligent is happening.

The typography section then reframes this feeling into a concise brand statement.

The actual upload interface and deeper feature explanation will appear later in the homepage and are **out of scope for this document**.

---

# 2. Reference Sites and Local Source-Code References

The coding agent will be given local copies of three reference websites. The agent should inspect those codebases before implementing the first two sections.

Replace the placeholders below with the real local paths when starting implementation:

```text
WAABI_REFERENCE_PATH=D:\web-sites\waabi
ECLIPSE_REFERENCE_PATH=D:\web-sites\eclipse
DAYLIGHT_REFERENCE_PATH=D:\web-sites\daylight
```

These codebases are **interaction and composition references**, not templates to copy verbatim.

## 2.1 Waabi — inspect for

Reference intent:

- compact floating navigation,
- very small red directional / scroll accent,
- cinematic first-screen composition,
- UI that stays secondary to the visual scene,
- strong separation between visual storytelling and navigation.

What to learn from it:

- proportion and density of the floating nav,
- how little interface is required to make the screen feel complete,
- how the red accent attracts attention without becoming a dominant brand color,
- how the first viewport feels like a scene rather than a component layout.

Do **not** copy Waabi branding, typography, text, imagery, or exact navigation dimensions.

## 2.2 Eclipse Space — inspect for

This is the most important technical reference for the transition between Section 1 and Section 2.

Inspect:

- scroll-controlled media playback,
- pinned/sticky scene behavior,
- media shrinking as scroll progresses,
- transformation from immersive visual to framed visual,
- scroll progress mapping,
- editorial typography composition,
- typography reveal behavior,
- masking / opacity transitions,
- pacing of long scroll sections.

The desired behavior is conceptually similar:

> large cinematic media → user scrolls → media timeline advances → media frame shrinks → editorial typography takes control of the page.

Do not copy Eclipse’s copy, logo, assets, or exact typography layout.

## 2.3 Daylight Computer — inspect for

Reference intent:

- strong centered product/media composition,
- balanced placement of small interface elements around a dominant visual,
- soft rounded image/video containers,
- warm photographic atmosphere,
- premium composition without oversized hero typography.

Use it to understand how a screen can feel full and intentional while using relatively little text.

---

# 3. Global Visual System for These Two Sections

## 3.1 Color palette

Use a warm editorial palette rather than pure white + pure black.

### Primary background

```css
--page-bg: #F2F0EA;
```

Warm off-white. This is the main background visible around the hero video and throughout the typography section.

### Primary text

```css
--ink: #0B0B0B;
```

Near-black rather than absolute black.

### Secondary text

```css
--muted-ink: #716D66;
```

Used for low-emphasis supporting copy and optional metadata.

### Elevated / floating surfaces

```css
--surface: #FAF8F4;
```

Used for the floating navigation.

### Subtle border

```css
--hairline: rgba(11, 11, 11, 0.10);
```

### Accent red

```css
--accent-red: #FF3B5C;
```

The exact red can be tuned during implementation, but it should stay bright, warm, and highly visible at very small sizes.

### Accent rule

Red is **not** a large-area brand fill.

Use red only as a recurring micro-detail:

- small circular scroll button,
- tiny active indicators,
- occasional focus state,
- very small motion cue,
- tiny menu or interaction detail if needed later.

The total red surface area in a viewport should remain very small. The red should feel like a signature punctuation mark, not a color theme.

---

# 4. Typography System

## 4.1 Display typography

Do **not** use the usual ubiquitous web choices such as Inter, Arial, Helvetica, Poppins, Montserrat, or generic geometric sans fonts for the large editorial statements.

The typography section needs a **strong condensed display family with an Eclipse-like attitude**:

- tall,
- narrow,
- confident,
- editorial,
- slightly industrial,
- very high visual impact,
- excellent uppercase rhythm.

### Preferred direction

Use a licensed condensed display family in the character of:

- **Founders Grotesk Condensed**, or
- **Druk Condensed**, or
- **Söhne Schmal**, or
- a similarly distinctive licensed condensed display family already available to the project.

The exact family may be finalized based on available font licensing and local project assets.

**Important:** Do not silently substitute a generic condensed font merely because it is easy to install. If the preferred display family is unavailable, choose another distinctive licensed alternative and preserve the same condensed editorial character.

## 4.2 UI / supporting typography

The small interface copy should be quiet and highly legible.

It may use a complementary neutral grotesk, but should still avoid the most generic default-web feeling if possible.

Recommended character:

- neutral,
- modern,
- low personality compared to the display type,
- excellent small-size rendering.

A project-provided licensed grotesk is preferred.

## 4.3 Typography hierarchy

### Opening supporting copy

```text
One image.
More than meets the eye.
```

- small / medium size,
- no oversized hero treatment,
- two lines preferred,
- approximately 18–24 px on desktop depending on the selected font,
- normal or medium weight,
- relaxed line height.

### Opening CTA

```text
TRY IT NOW ↗
```

- compact,
- visually secondary to the hero video,
- approximately 13–16 px desktop,
- medium weight,
- slightly increased tracking is acceptable.

### Typography section statement

Exact copy:

```text
ONE IMAGE
MORE THAN IT SHOWS.

THE SYSTEM
SEES FURTHER.
```

This copy must be treated as a **composition**, not as one centered text block.

---

# 5. Section 01 — Opening Scene / Cinematic Hero

## 5.1 Purpose

The opening screen must establish atmosphere before functionality.

The user should not see an upload field immediately.

The scene should feel cinematic and complete even if the user does nothing.

## 5.2 Desktop composition

The primary composition:

```text
                         [ FLOATING NAV ]


          ╭────────────────────────────────────╮
          │                                    │
          │                                    │
          │       TEMPORARY HERO VIDEO         │
          │                                    │
          │                                    │
          ╰────────────────────────────────────╯


  One image.                              TRY IT NOW ↗
  More than meets the eye.

                          ●
```

The layout should remain visually centered and balanced.

### Important alignment decision

The video is **centered**.

Do not deliberately offset it left or right. The distinctive character should come from the scene, typography, spacing, floating nav, motion, and later editorial composition — not from arbitrary asymmetry in the hero video.

## 5.3 Video frame dimensions

Desktop target:

- width: approximately **94–96vw**,
- height: approximately **94–96svh**, after the scene's viewport-relative outer padding,
- centered horizontally,
- visually centered within the usable viewport; the floating nav may overlap the media.

The frame must fit the available viewport in both axes. Do not derive desktop height only from the source's 16:9 aspect ratio; wide and short viewports would push the lower edge outside the screen.

The 16:9 source uses `object-fit: cover` inside the viewport-fitted frame.

## 5.4 Video frame styling

The media container must have softened corners.

Recommended starting point:

```css
border-radius: 22px;
```

Tune within roughly 18–28 px depending on viewport.

Avoid:

- sharp square corners,
- very exaggerated capsule rounding,
- thick borders,
- obvious card shadows.

If a shadow is used, it should be extremely subtle and atmospheric.

Suggested character:

```css
box-shadow: 0 20px 60px rgba(0,0,0,0.06);
```

This is a starting point, not a fixed value.

## 5.5 Temporary video requirement

The final hero video is **not ready yet**.

Implementation must therefore use a temporary placeholder video without tightly coupling the layout or scroll logic to the placeholder asset.

Requirements:

- isolate the hero-video source in a single config/constant/component prop,
- make later replacement trivial,
- do not bake timing assumptions throughout multiple components,
- expose video duration to the scroll controller dynamically,
- preserve `muted`, `playsInline`, and appropriate preload behavior.

Example conceptual interface:

```ts
const HERO_VIDEO_SRC = "/media/hero-temp.mp4";
```

Later replacement should require changing only the media source and, if necessary, one scroll-duration tuning value.

## 5.6 Floating navigation

Use a compact Waabi-inspired floating navigation container near the top center.

Content:

```text
[ LOGO      Home                    ☰ ]
```

### Required actions

**Logo**
- acts as brand identifier,
- may also return to the top if desired.

**Home**
- smooth-scrolls to the beginning of the homepage / Opening Scene.

**Hamburger menu**
- indicates access to the wider site menu.
- Fine-pointer hover over the complete nav opens a second rounded panel below the top bar.
- Keyboard focus and touch/click must expose the same panel without depending on hover.
- The expanded panel uses thumbnail slots and large labels; final thumbnail assets may be supplied later.

### Visual character

- floating light surface,
- rounded rectangle,
- compact dimensions,
- subtle border or very soft shadow,
- no large navbar spanning the full viewport width.

Suggested starting values:

```css
background: var(--surface);
border: 1px solid var(--hairline);
border-radius: 12px;
```

The nav should feel light enough to sit above the cinematic scene without competing with it.

## 5.7 Navigation hover states

Keep hover behavior refined and small.

### Home

On hover:

- text opacity shifts slightly,
- optional 1–2 px directional movement or underline reveal is acceptable,
- duration approximately 180–220 ms.

Avoid large pills, filled hover blocks, or dramatic scaling.

### Hamburger

On hover:

- the two/three strokes may slightly change spacing or translate,
- optional tiny red dot can appear as the local accent,
- no rotation gimmick unless it directly supports opening the menu.

### Nav container

Do not scale the top navigation bar on hover. The expanded panel may settle from a very small scale and blur as its height and opacity resolve.

## 5.8 Lower-left copy

Exact copy:

```text
One image.
More than meets the eye.
```

Behavior:

- anchored inside the media toward its lower-left inset,
- white, with enough local contrast to remain readable over the video,
- not inside a card,
- no heading treatment,
- should complete the composition rather than dominate it.

It can fade away during the scroll transition as the video begins to shrink.

## 5.9 Lower-right CTA

Exact direction:

```text
TRY IT NOW ↗
```

Action:

- smooth-scroll directly to the future upload section,
- upload section itself is outside this document.

### Hover behavior

Recommended:

- arrow translates 2–4 px diagonally,
- text opacity remains strong,
- optional tiny red accent appears or shifts,
- no large background-fill animation,
- duration 180–240 ms.

The CTA should feel editorial, not like a large SaaS primary button.

The CTA is anchored inside the media at the lower-right inset and uses white text over the video.

## 5.10 Red scroll-control button

At the lower center of the opening viewport, use a very small red circular control inspired by Waabi’s directional cue.

Requirements:

- **no text label**, because the page already contains enough typography,
- clearly interactive but visually tiny,
- use the accent red,
- indicate downward movement with a minimal glyph / arrow if desired,
- may have a very subtle breathing animation when idle.

Suggested size:

```css
width: 22–30px;
height: 22–30px;
```

### Idle animation

Very subtle only:

- 1–2 px vertical drift or a tiny opacity pulse,
- long duration,
- no aggressive bounce.

### Hover

- scale up by roughly 1.05–1.10,
- arrow can shift down 1–2 px,
- preserve the red fill.

### Click

Advance / smooth-scroll into the scroll-controlled hero transition.

---

# 6. Section 01 Scroll-Controlled Video Behavior

## 6.1 Fundamental decision

The hero video should **not continuously autoplay in an endless loop** as the primary interaction.

Instead, the main cinematic progression is controlled by scroll, following the conceptual behavior seen in Eclipse Space.

This is a critical design decision.

The page should feel like the user is advancing the cinematic scene rather than watching a cheap looping background video.

## 6.2 Scroll architecture

Recommended desktop approach:

- pin/stick the opening scene,
- allocate approximately **220–280vh** of scroll distance for the cinematic transition,
- map normalized scroll progress to both:
  1. video playback time,
  2. video frame scale / dimensions.

Starting point:

```text
0% scroll progress      → large video, opening frame
100% scroll progress    → final video frame, smaller framed media
```

The exact scroll distance should be tuned after testing the temporary video and later retuned for the final asset.

## 6.3 Video scrubbing

The video timeline should follow scroll progress.

Conceptually:

```ts
video.currentTime = scrollProgress * video.duration
```

Implementation must smooth seeks and avoid visible frame-jumping.

Use requestAnimationFrame or the animation library’s optimized update loop.

Do not attach expensive raw scroll handlers without throttling / interpolation.

## 6.4 Scale / frame transformation

As the video progresses, its container shrinks gradually.

Suggested conceptual timeline:

### 0–20%

- video at full opening size,
- nav visible,
- lower-left copy visible,
- CTA visible,
- red scroll cue visible.

### 20–50%

- video begins playing through scroll,
- video starts shrinking slowly,
- lower-left copy begins fading,
- CTA begins reducing in prominence,
- red scroll button fades out.

### 50–80%

- video shrinks more noticeably,
- warm page background becomes more dominant around the frame,
- supporting hero UI is mostly gone,
- floating nav may remain.

### 80–100%

- video reaches its smaller framed state,
- playback reaches its intended final frame,
- transition prepares the typography section,
- video no longer continuously plays once scroll stops.

## 6.5 Shrink target

The final framed video should feel like an object placed on an editorial page rather than a hero background.

A reasonable initial target is approximately:

- **55–68vw** wide desktop,
- proportionally reduced height,
- still centered.

Exact dimensions should be tuned visually.

The transition should not make the frame so small that the cinematic content becomes irrelevant.

## 6.6 Border-radius during shrink

The video should keep softened corners throughout.

A subtle radius adjustment is acceptable:

```text
Opening: ~22–26 px
Final framed state: ~14–20 px
```

Do not morph into square corners.

## 6.7 Scroll motion character

Scroll-linked properties should feel directly controlled by the user.

Avoid excessive easing on the scrubbing itself.

For secondary fades and UI transitions, use a refined easing such as:

```css
cubic-bezier(0.22, 1, 0.36, 1)
```

No springy motion.
No elastic overshoot.
No large parallax gimmicks.

---

# 7. Transition into Section 02

The transition should feel continuous.

Do not hard-cut from hero to typography.

The intended perception:

```text
CINEMATIC SCENE
      ↓ scroll
MEDIA SHRINKS
      ↓
WHITE SPACE EXPANDS
      ↓
EDITORIAL STATEMENT TAKES OVER
```

The typography may begin to enter before the video has entirely lost prominence, producing a brief overlap between the final cinematic state and the first editorial words.

The opening and typography sections should feel like two phases of the same composition, not two unrelated blocks stacked vertically.

---

# 8. Section 02 — Editorial Typography Statement

## 8.1 Purpose

The opening scene visually shows the product world.

The typography section gives that experience meaning.

It should communicate that a single vehicle image contains more usable information than is immediately visible.

The section is primarily a **brand/editorial statement**, not a feature list.

## 8.2 Exact copy

Use exactly:

```text
ONE IMAGE
MORE THAN IT SHOWS.

THE SYSTEM
SEES FURTHER.
```

Do not add explanatory paragraphs around the main statement at this stage.

## 8.3 Composition

The text must use a **scattered editorial composition**.

Do not center all lines in one vertical stack.
Do not create a conventional headline block.
Do not force every line to share the same left edge.

Conceptual direction:

```text
ONE IMAGE
MORE THAN IT SHOWS.


                         THE SYSTEM
                         SEES FURTHER.
```

The first block and second block should occupy different regions of the canvas.

Whitespace is part of the design.

The final x/y positions should be tuned based on actual font metrics and viewport size.

## 8.4 Scale

The type should be large and impactful, but the point is **composition**, not simply maximum font size.

It should feel closer to a poster/editorial spread than a SaaS headline.

Use responsive `clamp()` values and tune carefully.

Example direction only:

```css
font-size: clamp(64px, 8vw, 150px);
line-height: 0.82–0.92;
```

Actual values depend heavily on the chosen display family.

## 8.5 Wheel inside a single O

A single letter **O** in a visually central word should be replaced / integrated with a rotating vehicle wheel.

Preferred placement:

- use the `O` in **SHOWS** if that word is positioned centrally in the final composition,
- if final layout changes, keep the principle: one central O only.

### Critical rule

Use exactly **one** wheel intervention in this section.

Do not replace every O.
Do not turn multiple letters into vehicle illustrations.

The wheel is a signature surprise, not a repeated gimmick.

## 8.6 Wheel visual behavior

The wheel should look as if it is genuinely rotating.

A static wheel image is not sufficient for the final design.

The final asset may later be implemented as:

- short transparent video,
- animated WebP,
- GIF if quality is acceptable,
- CSS/Canvas/WebGL rotation using a high-quality static wheel asset.

Asset production is intentionally postponed.

The implementation should therefore isolate the wheel component so the placeholder can be replaced later without rebuilding the typography layout.

### Motion character

- continuous but controlled rotation once visible,
- subtle motion blur is acceptable,
- avoid cartoonishly fast spinning,
- the wheel must remain perfectly aligned with the O’s typographic footprint.

A good starting feel is roughly one rotation every 2.5–4 seconds, later tuned against the final asset.

## 8.7 Wheel hover behavior

Optional refined behavior:

- hovering the wheel can increase rotation speed slightly,
- transition should be smooth,
- no glow,
- no bounce,
- no tooltip required.

If hover causes visual noise, omit it. Continuous understated rotation is sufficient.

---

# 9. Typography Scroll Reveal

## 9.1 Chosen reveal direction

Use:

**C — mask reveal**  
combined with  
**a light version of A — opacity / contrast settling.**

This decision is locked.

## 9.2 Desired effect

As the user scrolls:

- text is initially partially concealed by a clipping mask,
- the visible portion expands into place,
- simultaneously the text transitions from slightly muted / low contrast to full near-black,
- motion remains subtle and editorial.

Do not use large blur effects.
Do not use aggressive 3D transforms.
Do not have letters fly individually from random directions.

## 9.3 Reveal order

Suggested sequence:

1. `ONE IMAGE`
2. `MORE THAN IT SHOWS.`
3. `THE SYSTEM`
4. `SEES FURTHER.`

The lines may overlap slightly in reveal timing rather than waiting for each one to fully complete.

The wheel/O intervention can resolve a fraction later than the surrounding letters so the eye notices it naturally.

## 9.4 Reveal implementation character

Possible CSS/animation primitives:

- `clip-path`,
- overflow-hidden line wrappers + translateY,
- transform-based masks,
- opacity from ~0.25–0.45 to 1,
- color interpolation from muted gray to near-black.

Example conceptual state:

```text
entry:
  clip/mask partially closed
  opacity ~0.35
  color slightly muted
  translateY 8–18px maximum

resolved:
  full mask
  opacity 1
  color var(--ink)
  translateY 0
```

Keep translations small. The reveal should feel like the typography is being uncovered, not entering from off-screen.

---

# 10. Typography Section Scroll Length

This section should be deliberately longer than one viewport.

Target starting range:

```text
~180–240vh
```

The goal is to let the editorial composition breathe and reveal gradually.

Possible pacing:

### 0–25%
- first text block begins entering,
- residual hero/video presence finishes yielding to typography.

### 25–55%
- `ONE IMAGE / MORE THAN IT SHOWS.` becomes fully readable,
- wheel becomes visible and begins rotating.

### 55–80%
- `THE SYSTEM / SEES FURTHER.` resolves in its offset position.

### 80–100%
- complete composition remains visible long enough to be read,
- prepare for the next section later.

The next-section connector is intentionally **not defined yet**.

---

# 11. Hover and Pointer Behavior — General Rules

These sections are not interaction-heavy UI. Hover should therefore add polish rather than create spectacle.

## 11.1 Global hover philosophy

Use:

- small translation,
- subtle opacity shifts,
- restrained red accents,
- precise pointer response.

Avoid:

- card lifts,
- large scales,
- neon glow,
- exaggerated magnetic movement,
- spring bounce,
- random cursor effects.

## 11.2 Video frame

Default recommendation:

- no dramatic hover effect,
- optionally a nearly imperceptible contrast or scale shift (`1.002–1.005`) on pointer enter,
- if this competes with scroll control, use no hover at all.

The video must remain a cinematic object, not a clickable card.

## 11.3 CTA

As specified:

- arrow moves diagonally 2–4 px,
- optional micro red accent,
- no large background fill.

## 11.4 Typography

Main words do not need hover states.

The wheel is the only element that may have a subtle interactive hover response.

---

# 12. Responsive Behavior

## 12.1 Desktop priority

The first implementation should achieve the intended composition on desktop first, because the reference behavior and large editorial typography depend heavily on screen space.

Primary target:

```text
1440px–1920px desktop widths
```

Then adapt downward.

## 12.2 Tablet

- reduce hero video width slightly,
- maintain centered composition,
- floating nav remains compact,
- supporting copy and CTA may move closer to viewport edges but must not overlap media,
- typography remains scattered but with reduced horizontal separation,
- wheel remains in one O only.

## 12.3 Mobile

Do not attempt to preserve the desktop composition literally.

Mobile adaptation principles:

- hero video remains centered and rounded,
- frame width is `95vw` and height is `95svh`, matching the desktop viewport-fit rule,
- the 16:9 source uses `object-fit: cover` inside this portrait frame instead of shrinking into a short letterbox,
- nav becomes narrower,
- supporting copy and CTA remain over the media at its lower edge,
- scroll-controlled media shrink can be simplified if performance is poor,
- typography blocks become more vertically sequenced while preserving offset alignment,
- do not let condensed text clip outside the viewport.

The mobile experience should retain the editorial character, not become a default mobile landing page.

---

# 13. Reduced Motion & Accessibility

Respect:

```css
@media (prefers-reduced-motion: reduce)
```

Reduced-motion behavior:

- use a static hero poster or a non-scrubbed representative frame,
- video shrink can become a simple layout transition or remain static,
- typography should appear without animated masks or with a very short opacity transition,
- wheel should not spin continuously,
- navigation and CTA remain fully usable.

Semantic requirements:

- `Home` must be keyboard accessible,
- hamburger menu button must have an accessible label,
- red scroll button must have an accessible label such as `Scroll to explore`, even though no visible text is displayed,
- CTA must be a real button/link target,
- decorative wheel asset should not create duplicate spoken text for the word containing O.

---

# 14. Performance Requirements

The cinematic feeling depends on smoothness.

Target:

- no noticeable scroll jank,
- avoid layout thrashing,
- animate transforms and opacity wherever possible,
- keep scroll calculations centralized,
- preload only what is necessary,
- lazy-load later homepage sections not required for the opening experience.

## 14.1 Scroll video

For the temporary video:

- use an efficient web codec / reasonable bitrate,
- `muted`,
- `playsInline`,
- preload metadata or enough data for smooth seeking,
- test actual browser seek behavior.

If direct video seeking proves unstable, consider a frame-sequence implementation only after profiling. Do not prematurely convert the hero into hundreds of heavy images.

## 14.2 Animation library

Before adding a dependency:

1. inspect the current project dependencies,
2. inspect the three local reference codebases,
3. identify how they implement pinned scroll, media scrubbing, and text reveals.

For a React/Next.js implementation, a robust scroll-timeline solution such as GSAP ScrollTrigger is acceptable if the project does not already have an equivalent system. If the project already uses Motion or another capable library, prefer consistency.

Do not mix multiple animation frameworks without a concrete reason.

---

# 15. Component / Code Organization Guidance

Keep the implementation modular enough to replace media and tune motion without rewriting sections.

Suggested conceptual structure:

```text
<HomePage>
  <FloatingNav />
  <OpeningScene>
    <ScrollScrubVideo />
    <OpeningCopy />
    <TryItNowLink />
    <ScrollCue />
  </OpeningScene>

  <EditorialStatement>
    <StatementLine />
    <StatementLineWithWheel />
    <StatementLine />
    <StatementLine />
  </EditorialStatement>
</HomePage>
```

Do not over-componentize individual words unless needed for animation control.

Centralize motion constants:

```text
hero scroll length
hero start/end media size
copy fade range
typography reveal ranges
wheel animation behavior
```

This will make tuning much easier.

---

# 16. Interaction Timeline — End-to-End Summary

## Page load

User sees:

- warm off-white page,
- compact floating nav at top center,
- large centered rounded cinematic video frame,
- small copy at lower left,
- `TRY IT NOW ↗` at lower right,
- tiny red circular scroll cue at lower center.

No upload area is visible.
No giant headline is visible.

## First scroll movement

- video timeline begins responding to scroll,
- video starts shrinking gradually,
- supporting hero copy fades,
- CTA recedes,
- red scroll button disappears,
- nav remains available.

## Mid transition

- media becomes increasingly framed,
- warm background occupies more space,
- the site transitions from cinematic scene to editorial canvas.

## End of hero transition

- video reaches its intended final frame and smaller size,
- continuous playback stops because playback is tied to scroll,
- typography section begins asserting itself.

## Typography reveal

- first block reveals through masks + mild contrast increase,
- central O contains the single rotating wheel intervention,
- second text block resolves at a different screen position,
- complete statement remains visible long enough to read.

Exact statement:

```text
ONE IMAGE
MORE THAN IT SHOWS.

THE SYSTEM
SEES FURTHER.
```

The next homepage section is intentionally not specified yet.

---

# 17. Locked Decisions Checklist

The coding agent should treat the following as fixed unless explicitly changed by the user:

- [x] No upload UI on the first viewport.
- [x] No conventional giant left-side hero headline.
- [x] Large centered cinematic media is the dominant opening element.
- [x] Media has visibly softened corners.
- [x] Warm/off-white page background remains visible around the media.
- [x] Temporary hero video is acceptable for now and must be easy to replace later.
- [x] Floating navigation follows the compact Waabi-style concept.
- [x] Floating nav contains Logo, Home, and Hamburger Menu.
- [x] Home smooth-scrolls to the opening section.
- [x] Lower-left copy is `One image. More than meets the eye.`
- [x] Lower-right CTA uses `TRY IT NOW ↗` direction and smooth-scrolls to the future upload section.
- [x] Lower-center scroll cue is a tiny red button with no visible text.
- [x] Small red details are a recurring visual signature throughout the site.
- [x] Hero cinematic playback is driven primarily by scroll rather than endless autoplay.
- [x] Hero media shrinks as scroll progresses, Eclipse-style.
- [x] Do not repeat bounding-box analysis immediately after the hero video.
- [x] Section 02 is an editorial typography section.
- [x] Typography copy is fixed to the four lines specified above.
- [x] Typography is scattered across the composition rather than placed in one conventional block.
- [x] Display type should use a distinctive strong condensed family, not a common default web font.
- [x] One central O contains a rotating vehicle wheel visual.
- [x] Only one wheel/O intervention is used.
- [x] Typography reveal uses mask reveal + mild opacity/contrast settling.
- [x] Typography section is intentionally longer than one viewport.
- [x] The next section and connecting copy are out of scope for now.

---

# 18. Final Implementation Reminder for the Agent

Before coding these sections:

1. inspect the current project architecture and dependencies,
2. inspect the local Waabi source for floating-nav and opening-scene behavior,
3. inspect the local Eclipse source carefully for scroll-scrub media, shrink transitions, pinning, and typography reveals,
4. inspect the local Daylight source for media framing, corner UI balance, and visual spacing,
5. then implement an **original** composition following this specification.

The objective is not to reproduce any one reference site. The objective is to use their strongest interaction ideas to build a distinct experience for a vehicle-analysis product.

The first two sections should feel like one continuous sequence:

> **cinematic observation → controlled scroll transformation → editorial statement**

That continuity is more important than adding additional effects.
