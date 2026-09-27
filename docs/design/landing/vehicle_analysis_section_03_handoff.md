# Vehicle Analysis Website — Section 03 Interaction Handoff

## Status

This document defines the **locked interaction concept, narrative structure, visual behavior, scroll logic, and implementation guidance for Section 03**, including the transition from Section 02 into Section 03.

Section 01 and Section 02 are already conceptually locked in the previous homepage handoff. Do not redesign them from scratch.

This document should be used together with the existing homepage handoff:

```text
vehicle_analysis_design_handoff.md
```

The implementation agent will also receive a local copy of the Waabi website source code.

Use a placeholder such as:

```text
WAABI_REFERENCE_PATH=<LOCAL_PATH_TO_WAABI_SOURCE>
WAABI_SAFETY_REFERENCE_PATH=<OPTIONAL_DIRECT_PATH_TO_SAFETY_PAGE_OR_COMPONENT>
```

Before implementing Section 03, inspect the local source for the interaction used on:

```text
https://waabi.ai/safety
```

especially the scroll-driven sequence beginning around:

```text
Safety is core to our DNA.
```

The relevant Waabi implementation has already been identified as a useful technical reference for:

- sticky/pinned stage behavior,
- vertical progress line,
- progress head / dot,
- direction-aware step counter transitions,
- faded inactive text states,
- sticky visual replacement,
- scroll-progress synchronization,
- mobile horizontal adaptation.

Do **not** copy Waabi branding, text, imagery, exact layout values, or CSS wholesale.  
Use the source code as an interaction and implementation reference.

---

# 1. Narrative Role of Section 03

Section 03 is the first homepage section that explains the product pipeline in a concrete way.

The first three sections form a deliberate narrative:

```text
SECTION 01
Cinematic / experiential
The user sees the world of the product.

        ↓

SECTION 02
Editorial / conceptual
The site states:

ONE IMAGE
MORE THAN IT SHOWS.

THE SYSTEM
SEES FURTHER.

        ↓

SECTION 03
Analytical / explanatory
The site reveals what the system actually extracts from that one image.
```

The intended mental transition is:

```text
EXPERIENCE
→ DEFINE
→ REVEAL
```

Section 03 should not feel like a generic “features” section.

Do not turn it into:

- four cards,
- four icon blocks,
- a feature grid,
- tabs,
- an autoplay carousel,
- a dashboard,
- a technical flowchart.

The interaction itself should communicate that a single image is progressively understood by the system.

---

# 2. Locked Section 02 → Section 03 Transition

## 2.1 Transition concept name

The transition concept is locked as:

```text
PUNCTUATION → PIPELINE
```

The transition begins from the actual final punctuation mark in:

```text
THE SYSTEM
SEES FURTHER.
            ↑
```

The final period is not merely decorative.

It becomes the origin of the Section 03 process spine.

---

## 2.2 Required transition sequence

The locked sequence is:

```text
SEES FURTHER.
        ↓
the final period remains
        ↓
the surrounding typography retreats
        ↓
the period becomes the accent-red process node
        ↓
a vertical red line grows / flows from it
        ↓
01 /04 VEHICLE appears
        ↓
Section 03 is established
```

Do not insert another section title between Section 02 and Section 03.

Specifically, do **not** add:

```text
HOW IT WORKS
OUR PROCESS
THE PIPELINE
WHAT WE DETECT
ANALYSIS PROCESS
```

or any equivalent heading.

Section 02 already performs the conceptual introduction.

Section 03 should feel like the direct visual answer to:

```text
THE SYSTEM
SEES FURTHER.
```

---

# 3. Geometric Relationship Between the Period and the Process Spine

The final `.` in `SEES FURTHER.` should visually become the Section 03 red node.

There are two acceptable implementation approaches.

## Preferred approach

Use a dedicated transition element positioned precisely over the real punctuation glyph.

Conceptually:

```text
SEES FURTHER.
            .
            ↑
    transition proxy
```

At the transition point:

1. the text period fades into / is covered by the proxy node,
2. the proxy changes from ink to accent red,
3. it moves only as much as necessary to align with the Section 03 process axis,
4. the vertical line emerges from that node.

This is often more reliable than trying to animate the literal font glyph into a UI component.

## Important positioning rule

The final typography layout of Section 02 should be tuned so the period is already reasonably close to the future Section 03 vertical axis.

Avoid a transition where the period flies hundreds of pixels across the viewport.

The transition should feel inevitable, not theatrical.

A small horizontal correction is acceptable.

Target character:

```text
quiet
precise
continuous
editorial
```

Avoid:

```text
dramatic travel
bouncy motion
large rotation
particle effects
glow
flash
3D morphing
```

---

# 4. Transition Motion Choreography

The exact percentages are tuning values, but the interaction should roughly follow this sequence.

Use a local transition progress value:

```text
transitionProgress = 0 → 1
```

## Phase A — Hold

Approximate range:

```text
0.00 → 0.20
```

The fully revealed Section 02 typography is allowed to breathe briefly.

Visible state:

```text
ONE IMAGE
MORE THAN IT SHOWS.

THE SYSTEM
SEES FURTHER.
```

The wheel motif is still present.

No Section 03 content should yet compete with the typography.

---

## Phase B — Editorial retreat

Approximate range:

```text
0.20 → 0.55
```

The earlier typography groups begin losing contrast and/or masking away.

Recommended order:

1. `ONE IMAGE / MORE THAN IT SHOWS.` retreats first.
2. `THE SYSTEM / SEES FURTHER.` remains slightly longer.
3. the wheel rotation slows and can settle.

This is not a hard fade-to-white.

Typography should retreat using the same design language already established in Section 02:

- mask,
- clip,
- contrast reduction,
- opacity reduction,
- subtle positional settling.

---

## Phase C — Punctuation isolation

Approximate range:

```text
0.55 → 0.75
```

The words:

```text
THE SYSTEM
SEES FURTHER
```

continue disappearing.

The final punctuation remains.

Conceptual state:

```text
.
```

The user should be able to visually understand that this is the same punctuation mark that just ended the sentence.

---

## Phase D — Punctuation becomes system node

Approximate range:

```text
0.75 → 0.88
```

The remaining dot transitions toward the site accent red.

Use the existing accent system:

```css
--accent-red: #FF3B5C;
```

or the final tuned equivalent from the global palette.

The dot can increase slightly in size as it changes role, but it must remain a micro-accent.

Do not make it a large circular button.

---

## Phase E — Process spine appears

Approximate range:

```text
0.88 → 1.00
```

The vertical process line begins appearing from the red node.

The preferred reference behavior is the Waabi clipping/translation technique:

```text
full line exists
→ most of it is outside a clipped parent
→ line + node translate through the clip
→ it appears to flow / draw downward
```

Prefer this over a crude:

```css
height: progress%;
```

implementation if the local reference confirms the same visual quality.

At the end of this phase, the first Section 03 state begins to establish itself:

```text
01 /04
VEHICLE
```

The content should not appear all at once.

Recommended order:

```text
red node
→ process line
→ 01 /04
→ VEHICLE title
→ description
→ source image / vehicle detection state
```

Use small scroll-linked staggers rather than long independent autoplay delays.

---

# 5. Section 03 Core Concept

Section 03 uses a Waabi-inspired scroll narrative, but the content is specific to this product.

The locked four stages are:

```text
01 /04 — VEHICLE
02 /04 — PLATE
03 /04 — OCR
04 /04 — BODY
```

These represent the analysis pipeline:

```text
IMAGE
→ VEHICLE
→ PLATE
→ OCR
→ BODY
```

`IMAGE` is the common source and does not need to be a numbered stage.

The central idea is:

> The same source image is progressively interpreted.

---

# 6. One Image, Four Analysis States

## Critical locked decision

All four stages should use the **same source vehicle image**.

Do not use four unrelated vehicle photos.

The point of Section 03 is to prove the idea stated in Section 02:

```text
ONE IMAGE
MORE THAN IT SHOWS.
```

The user should feel that information is being extracted layer by layer from one visual source.

Conceptually:

```text
ONE SOURCE IMAGE
       ↓
VEHICLE
       ↓
PLATE
       ↓
OCR
       ↓
BODY
```

This continuity is more important than reproducing Waabi's visual replacement behavior literally.

---

# 7. Section 03 Desktop Layout

The desktop composition should preserve the core spatial logic that made the Waabi interaction compelling:

```text
LEFT / MID-LEFT         CENTER            RIGHT
-------------------------------------------------------------
step number             red spine         analysis visual

active text             red node          same source image
ghost next text                            changing analysis state
```

A conceptual wireframe:

```text
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│        01 /04                  │        ┌───────────────┐     │
│                                │        │               │     │
│        VEHICLE                 │        │  SOURCE IMAGE │     │
│        short description       ●        │  + ANALYSIS   │     │
│                                │        │               │     │
│                                │        └───────────────┘     │
│                                                              │
│        PLATE                   │                              │
│        (ghost / low opacity)   │                              │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

The exact grid proportions are not locked.

The agent should inspect:

```text
WAABI_REFERENCE_PATH
```

and adapt the strong parts of its composition without duplicating dimensions.

---

# 8. Long Scroll Runway + Sticky Stage

Section 03 should be one long scroll sequence.

Do not build it as four unrelated viewport sections.

Recommended conceptual architecture:

```text
<section class="section03-scroll-runway">
    <sticky viewport stage>
        step counter
        text rail
        process spine
        analysis visual
    </sticky viewport stage>
</section>
```

Starting desktop runway:

```text
~400–520vh
```

This is a tuning range, not a hard requirement.

The sequence must feel deliberate and cinematic.

Do not make each stage snap by after a tiny wheel movement.

---

# 9. Scroll State Model

Use one shared scroll-progress source.

Conceptually:

```text
section03Progress
      ↓
activeStage
      ↓
counter
text opacity
visual state
process line
crop / zoom
overlay state
```

Avoid multiple components independently deciding what stage is active.

The interaction should behave like a single coordinated state machine.

Example:

```ts
type AnalysisStage = 1 | 2 | 3 | 4;

type StageId =
  | "vehicle"
  | "plate"
  | "ocr"
  | "body";
```

Suggested data model:

```ts
const analysisStages = [
  {
    index: 1,
    id: "vehicle",
    label: "VEHICLE",
    description: "...",
  },
  {
    index: 2,
    id: "plate",
    label: "PLATE",
    description: "...",
  },
  {
    index: 3,
    id: "ocr",
    label: "OCR",
    description: "...",
  },
  {
    index: 4,
    id: "body",
    label: "BODY",
    description: "...",
  },
];
```

Do not scatter stage-specific magic numbers through unrelated React components.

Centralize progress ranges.

---

# 10. Continuous Progress vs. Discrete Stage State

Use both.

## Continuous scroll-driven values

Good candidates:

- central red line translation,
- red node position,
- image zoom,
- image pan / object-position,
- overlay opacity,
- bbox emphasis,
- text contrast,
- transition into/out of the sticky stage.

These should remain tightly linked to scroll.

## Discrete active stage

Use a discrete index for:

- `01 /04`, `02 /04`, etc.,
- active title,
- which text receives full opacity,
- which result state is considered active,
- direction-aware step counter animation.

This prevents the entire interaction from becoming overly complicated.

---

# 11. Suggested Stage Thresholds

Do not blindly use:

```js
Math.round(progress * 4)
```

if it makes the visual pacing feel mechanical.

A starting point:

```text
0.00 – 0.22  → VEHICLE
0.22 – 0.47  → PLATE
0.47 – 0.72  → OCR
0.72 – 1.00  → BODY
```

These values can be tuned after the real image and motion are in place.

OCR may need slightly more visual time because it includes:

- plate focus,
- plate interpretation,
- text resolution.

The active index should remain stable around thresholds and should not flicker due to tiny scroll oscillations.

If useful, introduce a small hysteresis rule.

---

# 12. Central Red Process Spine

The red vertical line is a central visual and narrative motif.

It should mean:

```text
progress
processing
machine attention
analysis path
```

The line should not feel like a decorative divider.

The same accent red was previously used as a micro interaction cue.

Section 03 evolves that motif into a visible system process.

Conceptual progression across the homepage:

```text
SECTION 01
small red scroll cue

        ↓

SECTION 02
final punctuation

        ↓

SECTION 03
process node + process spine
```

This continuity is intentional.

---

# 13. Process Spine Implementation Reference

The Waabi source uses a useful technique:

```text
useTransform(progress, [0, 1], [-100, 0])
```

combined with:

```text
overflow: clip
```

so the line and terminal node move through a clipped container.

This creates the impression that the line is flowing / being drawn.

The implementation agent should inspect the local Waabi code and reuse the **idea**, not copy the component blindly.

Important:

- preserve smooth scroll linkage,
- do not animate line height through expensive layout changes if a transform-based approach works,
- keep the node attached to the process head,
- avoid glow.

---

# 14. Step Counter

Required format:

```text
01 /04
02 /04
03 /04
04 /04
```

The total `/04` remains static.

Only the active numeric portion transitions.

The Waabi reference uses direction-aware vertical motion:

```text
scroll down:
old number exits upward
new number enters from below

scroll up:
old number exits downward
previous number enters from above
```

This behavior should be retained.

A spring similar in character to the reference can be used.

Starting reference:

```js
{
  type: "spring",
  stiffness: 140,
  damping: 22
}
```

Do not treat these values as sacred constants.

Tune by feel within the project's actual animation stack.

The result should feel:

```text
physical
controlled
responsive
not bouncy
```

---

# 15. Text Rail

Each stage contains:

```text
LABEL
short editorial description
```

Example structure:

```text
VEHICLE
The system first isolates the vehicle from the scene.
```

The exact descriptions are **not yet locked copy**.

Recommended temporary copy:

```text
VEHICLE
The vehicle is isolated from the scene.

PLATE
The license plate region is located within the vehicle.

OCR
The plate is read and resolved into text.

BODY
The vehicle body type is classified from the same image.
```

These can be refined later for tone.

Do not make descriptions technical.

Avoid:

```text
confidence thresholds
model names
IoU
class IDs
coordinates
inference time
architecture names
```

The homepage explains the product behavior, not the ML implementation.

---

# 16. Active / Inactive Text Behavior

The active stage should receive full visual priority.

Starting behavior:

```text
active:
opacity 1

inactive:
opacity ~0.12–0.18
```

The Waabi reference uses approximately `0.15`.

This should be treated as a starting point.

Inactive text should remain visible enough to imply:

```text
previous state
current state
next state
```

The next stage appearing as a ghost below the active stage is important.

Example:

```text
VEHICLE
The vehicle is isolated from the scene.



PLATE
(low opacity)
```

This gives the user a subtle indication that the scroll sequence continues.

Do not use a visible accordion, bullet list, or stepper UI.

---

# 17. Text Rail Vertical Rhythm

The reference implementation uses tall text blocks and negative vertical overlap.

The important behavior is:

- each stage has substantial viewport presence,
- the next stage appears before the previous stage fully leaves,
- the rail feels continuous,
- there is no giant empty 100vh gap between headings.

The Waabi code uses a pattern similar to:

```text
item min-height: 100svh
later items: negative top margin around -50svh
```

Inspect the reference and adapt the principle.

Do not blindly copy `-50svh` if the project's typography scale needs another value.

The visual objective matters more than the exact number.

---

# 18. Right-Side Analysis Visual

The right side remains sticky while the text rail progresses.

However, unlike Waabi, do **not** replace the image with unrelated photography.

Use a single visual component:

```jsx
<AnalysisVisual
  image={sourceImage}
  stage={activeStage}
  progress={section03Progress}
/>
```

The component changes the interpretation of the same source image.

---

# 19. Analysis Visual Data Model

Even if Section 03 initially uses static mock data, structure it so the visual can later use real backend output.

Suggested model:

```ts
type BBox = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type AnalysisDemoData = {
  imageSrc: string;

  imageWidth: number;
  imageHeight: number;

  vehicleBBox: BBox;
  plateBBox: BBox;

  plateText: string;
  bodyType: string;
};
```

Prefer normalized coordinates internally if convenient:

```text
0 → 1
```

rather than hardcoded display pixels.

This makes the overlay responsive.

---

# 20. Render Analysis Overlays Separately From the Image

Do not bake boxes or labels into the image asset.

Use the source image as the source image.

Render analysis information in DOM/SVG/canvas layers above it.

Recommended structure:

```text
analysis visual
├── source image
├── vehicle bbox layer
├── plate bbox layer
├── OCR result layer
└── body result layer
```

Benefits:

- easy replacement of the final image,
- responsive geometry,
- animation flexibility,
- later compatibility with real analysis output,
- cleaner asset pipeline.

---

# 21. Stage 01 — VEHICLE

Required label:

```text
01 /04
VEHICLE
```

## Visual objective

The user understands:

> The system first identifies the vehicle within the image.

## Image framing

Use the broadest view of the four stages.

The vehicle should be comfortably visible inside the image.

The image should still read as a photographic scene, not an isolated crop.

## Vehicle bbox

Display one refined vehicle bounding box.

Style:

- thin,
- restrained,
- premium,
- high contrast enough to read,
- no glowing neon,
- no technical labels unless absolutely necessary.

Possible reveal:

```text
very short line draw
or
controlled opacity + scale resolve
```

Do not use a sci-fi scanning animation here unless later requested.

The bbox is enough.

---

# 22. Stage 02 — PLATE

Required label:

```text
02 /04
PLATE
```

## Visual objective

The system moves from understanding the vehicle to locating the plate region.

## Camera / crop behavior

The same source image remains.

The visual may smoothly zoom toward the plate.

This behavior is explicitly allowed and currently preferred.

The transition should feel like a change of machine attention, not a dramatic camera push.

Example:

```text
VEHICLE:
scale 1.00

→

PLATE:
scale ~1.10–1.22
+ controlled pan toward plate
```

Exact values depend on the chosen image.

## Overlay behavior

- vehicle bbox may fade into secondary emphasis,
- plate bbox becomes primary,
- plate region remains clearly contextualized within the same source image.

Do not crop so aggressively that the user loses all sense of the original vehicle.

---

# 23. Stage 03 — OCR

Required label:

```text
03 /04
OCR
```

## Visual objective

The user understands:

> The located plate is now converted into readable text.

## Image framing

Maintain or slightly increase the plate-focused state.

Do not perform another large zoom if Stage 02 already reached a good plate composition.

## OCR result

Show the recognized plate text.

The OCR result should feel editorial and integrated.

Avoid a dashboard card such as:

```text
OCR RESULT
54 ABC 123
Confidence 98.7%
```

Instead, use a cleaner presentation.

Example concept:

```text
54 ABC 123
```

with a small restrained relationship to the plate bbox.

Possible reveal:

- character mask reveal,
- subtle letter-by-letter resolve,
- opacity / contrast settle.

Avoid:

- typewriter gimmicks,
- blinking terminals,
- green console text,
- debug-style monospaced panels.

---

# 24. Stage 04 — BODY

Required label:

```text
04 /04
BODY
```

## Visual objective

The user understands:

> The same source image also contains enough visual information to classify the vehicle body type.

## Camera / crop behavior

The image should smoothly open back toward the broader vehicle framing.

Conceptually:

```text
PLATE / OCR
focused inward

        ↓

BODY
returns outward
```

The user should once again see enough of the vehicle silhouette to understand why body classification is possible.

## Body result

Show the body type as a simple, confident result.

Example:

```text
SEDAN
```

Avoid:

```text
Class: sedan
Confidence: 0.973
Model: EfficientNet...
```

The classification should feel like a product result, not model diagnostics.

---

# 25. Image Transform Strategy

Because all stages use the same source image, transitions should preferably interpolate one image transform rather than remounting new `<img>` elements.

Potential implementation:

```text
one image
+ transform scale
+ transform translate
+ overlay state
```

This gives stronger continuity than crossfading identical image assets.

Possible values can be defined per stage:

```ts
const visualStates = {
  vehicle: {
    scale: 1.0,
    focusX: 0.5,
    focusY: 0.5,
  },
  plate: {
    scale: 1.16,
    focusX: 0.62,
    focusY: 0.64,
  },
  ocr: {
    scale: 1.18,
    focusX: 0.62,
    focusY: 0.64,
  },
  body: {
    scale: 1.03,
    focusX: 0.5,
    focusY: 0.52,
  },
};
```

These numbers are examples only.

Do not hardcode them until the actual image is selected.

---

# 26. BBox Geometry Under Zoom

Bounding boxes must remain attached to the image correctly while the image is transformed.

Do not manually “eyeball” independent box positions for each stage.

Use the same coordinate system for:

```text
image
vehicle bbox
plate bbox
```

If the image uses `object-fit: cover`, carefully account for crop offsets.

If possible, use a wrapper where image and overlays share the same transform context:

```text
visual viewport
└── transformed image plane
    ├── image
    ├── vehicle bbox
    └── plate bbox
```

Then zoom/pan the entire plane together.

This avoids bbox drift.

---

# 27. Padding Around BBoxes

When zooming or reframing, never allow the vehicle or plate box to sit directly against the visual frame edge.

Use intentional visual padding.

The plate should remain readable.

The vehicle should remain recognizable.

Avoid asymmetric crops that accidentally cut important parts of the object.

---

# 28. No HUD Rule

Section 03 must remain aligned with the premium editorial direction.

Do not add:

- coordinates,
- confidence percentages,
- FPS,
- inference speed,
- class IDs,
- bounding-box debug labels,
- dense grids,
- reticles,
- floating panels,
- fake telemetry,
- sci-fi scanner HUD,
- glowing cyan overlays,
- code fragments.

The analysis should feel intelligent because of its clarity and sequencing, not because the screen is filled with technical decoration.

---

# 29. Visual Hierarchy

At each stage, only one analytical idea should dominate.

## VEHICLE

Primary:

```text
vehicle bbox
```

Secondary:

```text
source scene
```

## PLATE

Primary:

```text
plate bbox / plate region
```

Secondary:

```text
vehicle context
```

## OCR

Primary:

```text
recognized plate text
```

Secondary:

```text
plate bbox
```

## BODY

Primary:

```text
vehicle silhouette / broader vehicle view
body result
```

Secondary:

```text
remaining analysis overlays
```

Do not make every previous result stay equally visible forever.

The interaction should progressively redirect attention.

---

# 30. Direction-Aware Reverse Scrolling

All important transitions should behave sensibly in reverse.

When the user scrolls upward:

```text
BODY
→ OCR
→ PLATE
→ VEHICLE
```

The following should reverse cleanly:

- step number,
- text emphasis,
- image focus,
- overlay emphasis,
- OCR result,
- body result.

Do not rely on one-way entrance animations that leave broken states when reversing.

Scroll position is the source of truth.

---

# 31. Sticky Exit at the End of Section 03

The fourth state ends as:

```text
04 /04
BODY
```

The section should allow a brief final visual hold.

After that, the sticky stage releases and normal page flow resumes.

## Locked rule

The red process line does **not** continue into Section 04.

Section 04 is not yet designed.

Do not assume the line becomes a global timeline for the rest of the website.

At the end of Section 03:

- allow BODY to settle,
- let the user read the result,
- release the sticky stage cleanly.

The eventual transition to Section 04 will be designed later.

---

# 32. Section 03 Intro Has No Separate Heading

This is a locked decision.

Do not create:

```text
Section title
subtitle
large explanatory paragraph
then pipeline
```

The transition itself is the introduction.

Correct:

```text
THE SYSTEM
SEES FURTHER.
            ●
            │

01 /04      │      analysis visual
VEHICLE     ●
```

This maintains narrative continuity.

---

# 33. Typography

Section 03 should inherit the site's established typography system.

Use the distinctive condensed display family for important stage labels if it remains visually compatible.

Do not suddenly introduce a technical monospace aesthetic.

Supporting descriptions should use the restrained UI grotesk.

The text should feel like editorial explanation rather than interface documentation.

---

# 34. Color

Continue the warm editorial base.

Reference palette:

```css
--page-bg: #F2F0EA;
--ink: #0B0B0B;
--muted-ink: #716D66;
--surface: #FAF8F4;
--hairline: rgba(11, 11, 11, 0.10);
--accent-red: #FF3B5C;
```

The exact values may be tuned globally.

The red remains a micro-accent.

Even though the process spine is more visually present than the Section 01 cue, do not allow the whole section to become “red themed.”

---

# 35. Analysis Visual Container

The right visual should feel like an editorial image object, not a dashboard widget.

Preferred:

- rounded corners,
- clean crop,
- minimal/no border,
- no heavy shadow,
- no glass card,
- no black UI frame unless image contrast requires it.

The source photo is the visual.

The container should support it, not decorate it excessively.

---

# 36. Entry From Section 02

The Section 03 right-side visual should not appear too early.

During the punctuation transition:

```text
typography
→ dot
→ line
```

should remain the primary focus.

Only after the process spine is established should:

```text
01 /04
VEHICLE
analysis visual
```

gain full presence.

This is important.

If the entire Section 03 layout fades in while `SEES FURTHER.` is still visible, the transition will feel cluttered.

---

# 37. Recommended Component Architecture

Suggested structure:

```tsx
<HomePage>
  <OpeningScrollScene />
  <TypographyScene />

  <AnalysisPipelineSection>
    <Section02To03Transition />

    <PipelineStage>
      <PipelineCounter />
      <PipelineTextRail />
      <PipelineSpine />
      <AnalysisVisual />
    </PipelineStage>
  </AnalysisPipelineSection>
</HomePage>
```

Possible lower-level split:

```text
AnalysisVisual
├── AnalysisImagePlane
├── VehicleBBox
├── PlateBBox
├── OCRResult
└── BodyResult
```

Potential hooks/utilities:

```text
usePipelineProgress
usePipelineStage
useScrollDirection
useAnalysisImageTransform
useReducedMotion
```

Do not over-componentize tiny visual fragments if that makes the animation harder to reason about.

The motion model should remain understandable.

---

# 38. Recommended Motion State Object

Centralize the stage-specific behavior.

Example:

```ts
const pipelineMotionConfig = {
  vehicle: {
    imageScale: 1,
    vehicleBoxOpacity: 1,
    plateBoxOpacity: 0,
    ocrOpacity: 0,
    bodyOpacity: 0,
  },

  plate: {
    imageScale: 1.16,
    vehicleBoxOpacity: 0.25,
    plateBoxOpacity: 1,
    ocrOpacity: 0,
    bodyOpacity: 0,
  },

  ocr: {
    imageScale: 1.18,
    vehicleBoxOpacity: 0.12,
    plateBoxOpacity: 0.8,
    ocrOpacity: 1,
    bodyOpacity: 0,
  },

  body: {
    imageScale: 1.03,
    vehicleBoxOpacity: 0.35,
    plateBoxOpacity: 0,
    ocrOpacity: 0,
    bodyOpacity: 1,
  },
};
```

Again, these values are starting examples.

Do not use them without visual tuning.

---

# 39. Avoid React State on Every Scroll Pixel

The continuous scroll interaction should not cause unnecessary React re-renders.

Prefer:

- Framer Motion / MotionValues if already in project,
- GSAP if already part of the project,
- requestAnimationFrame-managed updates,
- transform and opacity properties.

Use React state for discrete stage changes only when appropriate.

Do not call `setState` for every scroll pixel.

---

# 40. Use the Existing Animation Stack

Before adding dependencies, inspect the current project.

Also inspect the Waabi local source to understand which mechanisms are producing the reference feel.

If the project already uses:

```text
Framer Motion
```

the reference architecture maps naturally.

If another existing animation system already handles scroll well, adapt the logic rather than adding a second major motion library.

Avoid dependency duplication.

---

# 41. Mobile Behavior

The Waabi source adapts its process from:

```text
desktop:
vertical scroll + vertical line

mobile:
horizontal scroll + horizontal line
```

This is a useful reference.

However, the exact Section 03 mobile composition is **not yet a locked visual decision**.

Requirements that are locked on mobile:

- preserve the four-stage narrative,
- preserve the same source image concept,
- preserve stage order,
- preserve readable analysis overlays,
- preserve reverse navigation behavior where applicable,
- do not turn the interaction into four generic stacked cards.

The implementation agent may initially adapt the proven Waabi horizontal pattern if it fits the project.

But desktop quality is the first priority.

---

# 42. Tablet

Tablet should retain the vertical narrative if space permits.

Possible adjustments:

- narrower center gap,
- smaller counter,
- reduced image size,
- less aggressive image zoom,
- reduced text offsets.

Do not collapse the design into a generic centered stack too early.

---

# 43. Reduced Motion

Honor:

```css
@media (prefers-reduced-motion: reduce)
```

Suggested behavior:

- disable strong image zoom/pan interpolation,
- reduce counter travel distance,
- replace elaborate masks with opacity,
- keep process states accessible,
- allow the user to move through stages without motion dependence.

The information hierarchy must remain understandable even without animation.

---

# 44. Performance

The interaction should feel smooth on modern desktop hardware.

Requirements:

- avoid layout thrashing,
- animate transforms and opacity where possible,
- preload the single required Section 03 source image,
- do not render multiple full-resolution duplicate images if one transformed image is enough,
- avoid high-frequency React state updates,
- pause unnecessary animation work when the section is off-screen.

The same source image approach should make this section relatively efficient.

---

# 45. Temporary Asset Strategy

The final Section 03 source image does not exist yet.

Do not block implementation.

Use a temporary high-quality automotive image with:

- one clearly visible vehicle,
- a readable / visible plate region,
- enough surrounding context,
- suitable aspect ratio for the sticky visual,
- enough resolution to tolerate moderate plate zoom.

Create mock analysis data for:

```text
vehicle bbox
plate bbox
plate text
body type
```

Keep all mock values centralized so the final image can later be replaced easily.

Suggested placeholder structure:

```text
/public/section03/
  source-demo.jpg
  demo-analysis.ts
```

or the equivalent structure already used by the project.

---

# 46. Do Not Encode Image-Specific Values Deep in Components

All temporary image-specific values should live in one config object.

For example:

```ts
const demo = {
  image: "/section03/source-demo.jpg",

  vehicleBBox: {...},
  plateBBox: {...},

  plateText: "54 ABC 123",
  bodyType: "SEDAN",

  focus: {
    vehicle: {...},
    plate: {...},
    ocr: {...},
    body: {...},
  },
};
```

When the final asset arrives, implementation should require editing this configuration rather than rewriting the section.

---

# 47. Reference Code Behavior to Inspect

The local Waabi source should specifically be inspected for these mechanisms:

## Scroll tracking

Equivalent of:

```text
useScroll(...)
useMotionValueEvent(...)
```

## Active section calculation

Equivalent of:

```text
progress → current section
```

## Scroll direction

Equivalent of:

```text
current progress > previous progress
```

## Counter transition

Equivalent of:

```text
AnimatePresence
direction-aware y entrance / exit
spring
```

## Text rail

Equivalent of:

```text
active opacity = 1
inactive opacity ≈ 0.15
```

## Sticky visual

Equivalent of:

```text
sticky top 0
viewport height
```

## Progress line

Equivalent of:

```text
clipped container
translated line + dot
```

The implementation agent already has the original source.

Use it.

Do not reverse engineer the same mechanics from scratch unnecessarily.

---

# 48. What We Are Taking From Waabi

We are intentionally borrowing interaction principles:

```text
sticky story stage
central progress spine
scroll-linked progression
direction-aware step counter
ghost next state
active/inactive text contrast
sticky right visual
careful spring motion
```

---

# 49. What We Are NOT Taking From Waabi

Do not copy:

- Waabi copy,
- Waabi safety narrative,
- Waabi images,
- Waabi exact spacing,
- Waabi font choices,
- Waabi brand colors,
- Waabi DOM structure blindly,
- Waabi mobile layout blindly,
- image-to-image replacement as a product requirement.

Our section has a different narrative:

```text
one image
→ increasingly understood
```

That is the central adaptation.

---

# 50. Section 03 Copy Status

Locked labels:

```text
VEHICLE
PLATE
OCR
BODY
```

Locked numbering:

```text
01 /04
02 /04
03 /04
04 /04
```

Descriptions are not yet final marketing copy.

Use temporary concise descriptions until a later copy pass.

Do not change the labels to:

```text
VEHICLE DETECTION
LICENSE PLATE DETECTION
OPTICAL CHARACTER RECOGNITION
BODY TYPE CLASSIFICATION
```

unless explicitly requested later.

The short labels are part of the desired visual rhythm.

---

# 51. Locked Decisions

The following decisions are locked and should not be re-litigated during implementation unless explicitly requested.

## Transition

- Section 02 flows directly into Section 03.
- There is no separate Section 03 introductory headline.
- The final period in `SEES FURTHER.` becomes the origin of Section 03.
- The period becomes accent red.
- A vertical process spine emerges from the period.
- The transition concept is `PUNCTUATION → PIPELINE`.
- Avoid flashy transition effects.

## Section structure

- Section 03 is a long scroll-driven sequence.
- The main stage is sticky/pinned.
- There are four stages.
- Stage labels are:
  - `VEHICLE`
  - `PLATE`
  - `OCR`
  - `BODY`
- Stage numbering is:
  - `01 /04`
  - `02 /04`
  - `03 /04`
  - `04 /04`

## Visual source

- All stages use the same source image.
- The image may smoothly zoom/pan between stages.
- PLATE/OCR may focus toward the plate.
- BODY opens back toward the vehicle.

## Analysis overlays

- VEHICLE shows a refined vehicle bbox.
- PLATE shows a refined plate bbox.
- OCR shows recognized plate text.
- BODY shows the body-type result.
- No confidence values.
- No coordinates.
- No model names.
- No class IDs.
- No debug UI.
- No futuristic HUD clutter.

## Waabi relationship

- Waabi Safety is the primary interaction reference for Section 03.
- The local Waabi source is available to the agent.
- The agent should inspect it before implementation.
- Interaction principles may be adapted.
- Branding/layout/assets must not be copied.

## Ending

- Section 03 ends on `04 /04 BODY`.
- The final state gets a short visual hold.
- The sticky section then releases.
- The red process line does not continue into Section 04.
- Section 04 will be designed later.

---

# 52. Explicitly Not Yet Locked

These items may be tuned during implementation or discussed later:

- final Section 03 automotive source image,
- exact vehicle bbox coordinates,
- exact plate bbox coordinates,
- final OCR example text,
- final body-type example,
- exact editorial descriptions,
- exact Section 03 grid dimensions,
- exact image container aspect ratio,
- exact zoom scale values,
- exact pan/focus values,
- exact stage threshold percentages,
- final mobile interaction,
- transition from Section 03 into Section 04.

Do not invent Section 04.

---

# 53. Acceptance Criteria

The first implementation pass should be considered successful only if all of the following are true.

## Narrative

- Section 02 and Section 03 feel like one continuous story.
- `SEES FURTHER.` visibly gives birth to the Section 03 process spine.
- The user understands the four analysis stages without reading technical documentation.

## Motion

- Scroll drives the experience.
- The stage does not autoplay independently.
- Reverse scrolling behaves correctly.
- The counter reacts to scroll direction.
- The central line feels continuous.
- Stage transitions feel calm and physical.
- No abrupt snapping.

## Visual continuity

- The same source image remains through all four stages.
- The user can perceive that the same image is being progressively interpreted.
- Zoom/pan changes do not break bbox alignment.

## Product clarity

- VEHICLE clearly communicates vehicle localization.
- PLATE clearly communicates plate localization.
- OCR clearly communicates text extraction.
- BODY clearly communicates body-type classification.

## Design quality

- The section does not look like a SaaS feature grid.
- The section does not look like a dashboard.
- The section does not look like a sci-fi HUD.
- Red remains a controlled accent.
- Typography remains editorial and premium.
- The right image remains the visual focal object.

## Technical

- No unnecessary scroll-driven React re-render loop.
- Overlay geometry remains responsive.
- Reduced motion is respected.
- Temporary asset configuration is replaceable.
- Local Waabi source has been inspected before finalizing the motion implementation.

---

# 54. Suggested Implementation Order

Recommended sequence for the coding agent:

```text
1. Inspect local Waabi Safety source.
2. Identify the exact DNA/scroll component and supporting utilities.
3. Implement the Section 03 scroll runway.
4. Implement sticky desktop composition.
5. Implement central red spine + node.
6. Implement direction-aware 01–04 counter.
7. Implement active/inactive text rail.
8. Add one temporary source image.
9. Add normalized mock bboxes.
10. Implement VEHICLE state.
11. Implement PLATE zoom/focus + plate bbox.
12. Implement OCR result.
13. Implement BODY zoom-out + body result.
14. Verify reverse scrolling.
15. Implement Section 02 punctuation → pipeline handoff.
16. Tune thresholds and spring values.
17. Add reduced-motion behavior.
18. Test responsive geometry.
19. Tune typography and spacing by eye.
20. Do not begin Section 04.
```

Implement the core mechanics before polishing decorative details.

---

# 55. Final Experience Summary

The intended experience is:

```text
ONE IMAGE
MORE THAN IT SHOWS.

THE SYSTEM
SEES FURTHER.
            ●
            │
            │

01 /04      │        SAME SOURCE IMAGE
VEHICLE     ●        vehicle found

            ↓

02 /04      │        SAME SOURCE IMAGE
PLATE       ●        focus moves toward plate

            ↓

03 /04      │        SAME SOURCE IMAGE
OCR         ●        plate text resolves

            ↓

04 /04      │        SAME SOURCE IMAGE
BODY        ●        view opens back to vehicle
                      body type resolves
```

The key idea is not merely:

```text
the product has four features
```

The key idea is:

```text
one image contains several layers of information,
and the system progressively reveals them.
```

That principle should guide every visual and technical decision in Section 03.
