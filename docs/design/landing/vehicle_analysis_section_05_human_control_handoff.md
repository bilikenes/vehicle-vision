# Vehicle Analysis Website — Section 05 Human Control Scene Handoff

## Status

This document defines the **locked concept, interaction model, scroll choreography, visual behavior, and Section 04 → Section 05 transition** for the homepage.

Sections 01–04 are already conceptually established.

This document focuses only on:

```text
SECTION 04 → SECTION 05 transition
SECTION 05 — Human Control Scene
```

Do not begin the footer / final section from this document.

---

# 1. Narrative Role of Section 05

Section 05 is not a traditional “Edit Results” feature section.

Its role is to complete the product story by showing that:

> The system can make a prediction, but the user can refine the result when needed.

The homepage narrative now becomes:

```text
SECTION 01
EXPERIENCE
cinematic opening

        ↓

SECTION 02
DEFINE
ONE IMAGE
MORE THAN IT SHOWS.

THE SYSTEM
SEES FURTHER.

        ↓

SECTION 03
REVEAL
01 /04 VEHICLE
02 /04 PLATE
03 /04 OCR
04 /04 BODY

        ↓

SECTION 04
TRY
upload your own image
or choose one of the provided samples

        ↓

SECTION 05
REFINE
the result can be corrected by the user
```

Section 05 should therefore feel like:

```text
machine interpretation
→ human control
```

The section should not feel like:

- a dashboard,
- a settings screen,
- a full editor UI,
- a feature list,
- a form-heavy interaction,
- a technical product screenshot.

It is a **curated correction scene**.

---

# 2. Section 05 Concept Name

The locked internal concept name is:

```text
HUMAN CONTROL SCENE
```

The user does not need to see this label.

The section message is:

```text
WHEN NEEDED, STEP IN.
```

Supporting copy:

```text
Adjust the box. Correct the text. Refine the result.
```

The goal is to communicate editability without reproducing the full editor.

---

# 3. Core Interaction Idea

The section begins with a deliberately imperfect demo result.

As the user scrolls:

```text
initial imperfect state
        ↓
plate bbox corrects itself
        ↓
OCR character corrects itself
        ↓
final clean result
        ↓
message resolves:
WHEN NEEDED, STEP IN.
```

The user does not manually drag or type during this homepage demo.

The corrections happen automatically as a function of scroll progress.

The section should make the user think:

> “I can do this too.”

---

# 4. Why Scroll-Driven Correction

The site already uses scroll as part of its visual language.

Therefore Section 05 should not suddenly switch to:

```text
click tab
open modal
edit input
save
```

Instead, scroll becomes a way to **demonstrate the edit capability**.

This keeps the section aligned with the rest of the homepage.

The section should be:

```text
interactive-feeling
without requiring interaction
```

The real edit page can later provide the actual controls.

---

# 5. Section 04 → Section 05 Transition

## Locked decision

Do **not** carry the user-selected image from Section 04 into Section 05.

Do not require:

- a real analysis run,
- backend state,
- selected-image persistence,
- dynamic result generation.

Section 05 uses a dedicated canonical demo asset.

---

# 6. Transition Anchor

The continuity object from Section 04 is:

```text
APERTURE FRAME
```

not the selected image.

Section 04 ends with:

- scattered sample images,
- central `YOUR TURN.` copy,
- Aperture Frame,
- upload / preview state,
- `CHANGE IMAGE`,
- `ANALYZE`.

As the user scrolls toward Section 05:

```text
samples retreat
↓
YOUR TURN copy retreats
↓
upload actions retreat
↓
Aperture Frame remains
↓
Aperture Frame grows / resolves
↓
becomes correction canvas
```

This keeps visual continuity without depending on Section 04 user state.

---

# 7. Transition Sequence

Recommended sequence:

## Phase A — Section 04 release

- sample images lose contrast,
- parallax movement settles,
- samples fade / retreat gently,
- `YOUR TURN.` fades or masks away,
- upload action labels retreat,
- selected-state pink accents disappear.

The center becomes visually dominant.

## Phase B — Aperture remains

The central Aperture Frame stays visible.

It should feel like the same object, not a new component.

## Phase C — Frame transforms

The frame:

- grows moderately,
- becomes the main visual canvas,
- corner marks become calmer,
- empty/upload semantics disappear.

## Phase D — Demo image resolves

The fixed Section 05 demo image appears inside the frame.

The transition should be:

```text
image window
→ correction canvas
```

not:

```text
upload section disappears
→ new section fades in
```

---

# 8. Section 05 Demo Asset

Section 05 uses one fixed demo vehicle image.

Requirements:

- one clearly visible vehicle,
- visible license plate,
- enough resolution for plate crop,
- composition suitable for a centered editorial canvas,
- plate bbox can be deliberately shown slightly wrong,
- OCR can contain one believable character error.

The exact final asset is not yet locked.

Use a temporary demo image during implementation.

---

# 9. Initial Imperfect State

The starting result should be **almost correct**, not obviously broken.

The goal is:

```text
small refinement
```

not:

```text
AI failure
```

Example:

- plate bbox is a few pixels too wide or slightly misaligned,
- OCR text reads:

```text
34 A8C 123
```

instead of:

```text
34 ABC 123
```

Only one character should be wrong.

This creates a believable correction scenario.

---

# 10. Why the Error Must Be Small

The section should not imply:

> “The model usually gets it wrong.”

It should imply:

> “When a small correction is needed, you remain in control.”

Therefore:

- no wildly incorrect bbox,
- no unreadable OCR,
- no incorrect vehicle class demo,
- no multiple simultaneous errors.

Keep the correction elegant and credible.

---

# 11. Section Length

Section 05 should be shorter than Section 03.

Recommended starting range:

```text
150–180vh
```

This is a tuning value.

The section should feel like a concise final product proof, not another long chapter.

---

# 12. Sticky Scene

Recommended architecture:

```text
long scroll runway
+
one sticky visual stage
```

Conceptually:

```text
<section class="human-control-runway">
    <sticky stage>
        background typography
        correction canvas
        plate crop
        OCR state
    </sticky stage>
</section>
```

Scroll progress controls the correction.

---

# 13. Scroll Progress Model

Use one shared progress source:

```text
section05Progress
```

which controls:

```text
bbox geometry
handle position
plate crop framing
OCR character state
background typography contrast
final message visibility
```

Avoid unrelated independent animation timelines.

---

# 14. Suggested Scroll Phases

Starting choreography:

```text
0.00–0.25  → Initial result
0.25–0.55  → BBox correction
0.55–0.78  → OCR correction
0.78–1.00  → Final resolved state
```

These values are not hard constants.

Tune them visually.

---

# 15. Stage A — Initial Result

Approximate progress:

```text
0.00 → 0.25
```

Visible:

- main vehicle image,
- slightly incorrect plate bbox,
- OCR result:

```text
34 A8C 123
```

- optional small Live Plate Crop,
- background statement extremely faint.

No motion correction yet.

Allow a short hold so the user can perceive the starting state.

---

# 16. Stage B — BBox Correction

Approximate progress:

```text
0.25 → 0.55
```

A single bbox handle becomes the human-control indicator.

Use the site pink accent.

Example:

```text
neutral bbox
+
one pink corner / handle
```

As scroll progresses:

```text
wrong bbox geometry
↓
pink handle moves
↓
bbox interpolates
↓
correct bbox geometry
```

The correction should feel precise and smooth.

No bounce.

No rubber-band effect.

---

# 17. Pink Accent Meaning

In Section 05, pink evolves into:

```text
human intervention
human control
editable point
```

This is intentional.

The accent should remain small.

Do not recolor the whole bbox pink.

Preferred:

- one handle,
- one corner marker,
- one small control point.

---

# 18. BBox Visual Style

Use the same family of bbox language established earlier, but make it feel editable.

Recommended:

- thin line,
- restrained geometry,
- no label floating above the box,
- no confidence score,
- no coordinates,
- no technical HUD.

The edit state is communicated through the pink handle.

---

# 19. Live Plate Crop

A small Live Plate Crop is included and preferred.

Purpose:

> Show why changing the bbox matters.

As the bbox corrects:

```text
main bbox changes
↓
plate crop updates simultaneously
```

This creates a clear cause-and-effect relationship.

The crop should remain:

- small,
- editorial,
- aligned with the main composition,
- free of extra panel chrome.

Do not make it a dashboard card.

---

# 20. Plate Crop Placement

The crop can sit below or near the main image.

Conceptually:

```text
       [ main vehicle image ]

            [ plate crop ]

            34 A8C 123
```

The exact placement should be tuned by eye.

It should feel like part of the visual composition, not a form field.

---

# 21. Stage C — OCR Correction

Approximate progress:

```text
0.55 → 0.78
```

Once the bbox is corrected, attention moves to OCR.

Initial:

```text
34 A8C 123
```

The incorrect character:

```text
8
```

receives pink emphasis.

As scroll continues:

```text
8
↓
B
```

The rest of the text remains stable.

Final:

```text
34 ABC 123
```

---

# 22. OCR Character Transition

Preferred transition character:

```text
mask replace
small character flip
controlled fade
```

Avoid:

- typewriter animation,
- terminal typing,
- glitch,
- hacker-style replacement,
- exaggerated 3D rotation.

The change should be subtle and legible.

---

# 23. Why Only One Character Changes

Changing only one character:

- feels realistic,
- makes the correction readable,
- avoids visual noise,
- reinforces that the system result was already close,
- lets the user understand the edit capability instantly.

Do not animate the entire plate string unnecessarily.

---

# 24. Stage D — Final Resolved State

Approximate progress:

```text
0.78 → 1.00
```

Final state:

- bbox correct,
- plate crop correct,
- OCR text correct,
- pink correction emphasis settles,
- visual becomes calm.

At the same time, the final message reaches full visual clarity.

---

# 25. Main Editorial Statement

Locked headline:

```text
WHEN NEEDED, STEP IN.
```

This should not appear as a conventional top-of-section title.

Use it as large editorial typography integrated into the scene.

Preferred:

- very large,
- pale at first,
- partially cropped by viewport if helpful,
- low contrast initially,
- resolves gradually with the correction.

---

# 26. Supporting Copy

Locked supporting line:

```text
Adjust the box. Correct the text. Refine the result.
```

Keep it small.

Do not add a paragraph.

The visual demo should do most of the explaining.

---

# 27. Typography Behavior

At the beginning:

```text
WHEN NEEDED, STEP IN.
```

is extremely low contrast.

As corrections progress:

```text
bbox improves
→ text becomes clearer

OCR resolves
→ text becomes nearly complete

final state
→ message reaches intended contrast
```

This makes the typography part of the correction narrative.

---

# 28. Typography Style

Use the existing distinctive condensed display language.

Do not introduce a new font family for this section.

The statement can be:

- very large,
- partially off-screen,
- behind the main correction canvas,
- pale warm gray,
- editorial rather than UI-like.

Avoid centered SaaS headline styling.

---

# 29. Composition

Avoid:

```text
left text
right editor
```

as the primary composition.

Preferred:

```text
large pale typography in background
+
centered / near-centered correction canvas
+
small plate crop
+
OCR result
```

Conceptual layout:

```text
WHEN NEEDED, STEP IN.
(huge pale background typography)


             ┌──────────────────────┐
             │                      │
             │      VEHICLE         │
             │    ┌────────┐        │
             │    │ PLATE  │        │
             │    └────────┘        │
             │                      │
             └──────────────────────┘

                 [ plate crop ]

                 34 A8C 123
```

The visual hierarchy should remain obvious.

---

# 30. What Is Demonstrated

Homepage demo demonstrates only:

```text
1. plate bbox correction
2. OCR correction
```

This is intentional.

Do not add:

- body-type dropdown,
- vehicle bbox editor,
- full form controls,
- multiple tabs,
- save button,
- JSON,
- edit sidebar.

The section communicates editability through representative actions.

---

# 31. Why Body-Type Editing Is Not Shown

Body-type editing exists conceptually in the product, but showing it here would:

- introduce dropdown UI,
- push the section toward dashboard aesthetics,
- overload the scene,
- reduce editorial clarity.

The supporting phrase:

```text
Refine the result.
```

is enough to imply broader editability.

---

# 32. No Real User State

Section 05 must not depend on:

- Section 04 sample selection,
- uploaded file,
- actual model inference,
- backend result,
- login state,
- analysis completion.

The scene must always be deterministic.

This makes the homepage:

- reliable,
- fast,
- visually controllable,
- easy to demo.

---

# 33. Demo Data Model

Suggested:

```ts
type BBox = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type HumanControlDemo = {
  imageSrc: string;

  incorrectPlateBBox: BBox;
  correctedPlateBBox: BBox;

  initialOCR: string;
  correctedOCR: string;

  incorrectCharacterIndex: number;
};
```

Example:

```ts
const demo = {
  imageSrc: "/section05/demo-car.jpg",

  incorrectPlateBBox: {
    x: 0.54,
    y: 0.68,
    width: 0.17,
    height: 0.07,
  },

  correctedPlateBBox: {
    x: 0.56,
    y: 0.69,
    width: 0.14,
    height: 0.06,
  },

  initialOCR: "34 A8C 123",
  correctedOCR: "34 ABC 123",

  incorrectCharacterIndex: 4,
};
```

Values are examples only.

---

# 34. BBox Interpolation

Do not swap between two hardcoded boxes instantly.

Interpolate:

```text
x
y
width
height
```

according to scroll progress.

Conceptually:

```ts
bbox = lerp(
  incorrectPlateBBox,
  correctedPlateBBox,
  bboxProgress
)
```

This produces a real correction motion.

---

# 35. Plate Crop Synchronization

The crop preview should be derived from the same current bbox.

Do not fake the crop with unrelated images if avoidable.

Preferred:

```text
source image
+
current interpolated bbox
↓
derived crop preview
```

This keeps the demo internally consistent.

---

# 36. Visual Plane Architecture

Suggested structure:

```text
CorrectionCanvas
├── DemoImage
├── EditablePlateBBox
│   └── PinkHandle
├── PlateCrop
└── OCRDisplay
```

All relevant geometry should derive from the same image coordinate system.

---

# 37. Image Fit and BBox Alignment

If the demo image uses:

```text
object-fit: cover
```

account for crop offsets correctly.

Prefer a predictable image plane where:

```text
image
bbox
crop source
```

share a common coordinate system.

Do not eyeball the bbox separately from the image.

---

# 38. Scroll Direction

Reverse scrolling must work correctly.

If the user scrolls upward:

```text
correct OCR
→ incorrect OCR

correct bbox
→ incorrect bbox
```

The visual should reverse smoothly.

Do not use one-way entrance animations.

Scroll position is the source of truth.

---

# 39. Motion Character

The section should feel:

```text
precise
calm
controlled
intentional
```

Avoid:

```text
bounce
overshoot
elastic motion
large parallax
fast zoom
glitch
scanner effect
```

This is a human-control scene, not a sci-fi demo.

---

# 40. Reduced Motion

Honor:

```css
@media (prefers-reduced-motion: reduce)
```

Possible reduced-motion behavior:

- bbox changes with minimal interpolation,
- OCR character swaps with opacity,
- background typography resolves mostly through contrast,
- Aperture Frame transition uses small fade/scale only.

The information hierarchy must remain understandable.

---

# 41. Accessibility

Because the homepage correction is scroll-driven and non-interactive, do not imply that the demo itself is an editable control if it is not.

If using decorative handles:

- keep them non-focusable,
- do not expose misleading ARIA labels.

The actual edit page can later provide real accessible controls.

---

# 42. Section 04 → 05 Implementation Notes

The Aperture Frame transition should preferably use a shared visual wrapper or coordinated layout values.

Conceptually:

```text
Section04 Aperture geometry
↓
interpolate
↓
Section05 correction canvas geometry
```

Do not hard-cut between two similar rectangles if a smooth transform is feasible.

---

# 43. Section 04 Elements That Must Retreat

Before Section 05 fully establishes:

- all 8 sample images retreat,
- sample selection accents disappear,
- `YOUR TURN.` retreats,
- upload description retreats,
- `CHOOSE IMAGE` / `CHANGE IMAGE` / `ANALYZE` retreat,
- drag/drop semantics end.

Only the Aperture-derived visual frame carries forward.

---

# 44. Section 05 Entry Timing

Do not show the correction demo too early.

Recommended sequence:

```text
samples retreat
↓
upload UI retreats
↓
Aperture frame remains
↓
frame transforms
↓
demo image appears
↓
imperfect bbox + OCR appear
↓
correction scroll begins
```

Keep the transition readable.

---

# 45. Performance

Section 05 should remain lightweight.

Recommendations:

- one demo image,
- one derived crop,
- transform/opacity-based motion,
- avoid React state updates on every scroll pixel,
- use MotionValues / RAF / existing animation stack,
- derive continuous bbox values outside expensive React renders.

---

# 46. Suggested Component Architecture

```tsx
<HumanControlSection>
  <HumanControlTypography />

  <CorrectionCanvas>
    <DemoImage />
    <EditablePlateBBox />
    <PinkHandle />
  </CorrectionCanvas>

  <LivePlateCrop />
  <OCRCorrection />
</HumanControlSection>
```

Possible hooks:

```text
useHumanControlProgress
useBBoxInterpolation
useOCRCorrectionProgress
useReducedMotion
```

Keep the architecture understandable.

---

# 47. Suggested Motion Ranges

Example only:

```ts
const ranges = {
  hold: [0.00, 0.25],
  bbox: [0.25, 0.55],
  ocr: [0.55, 0.78],
  resolve: [0.78, 1.00],
};
```

Typography contrast can span the whole section:

```text
0.00 → 1.00
```

Do not scatter these numbers across components.

Centralize them.

---

# 48. Design Language Continuity

Section 05 should reuse the site’s existing visual language:

```text
warm editorial background
distinctive condensed typography
pink micro-accent
rounded media object
minimal UI
precise machine-vision geometry
```

Do not introduce:

- blue AI gradients,
- dark dashboard chrome,
- glassmorphism,
- terminal aesthetics.

---

# 49. Locked Decisions

The following decisions are locked unless explicitly revisited.

## Section purpose

- Section 05 remains in the homepage.
- It is not a traditional edit-results section.
- It is a `Human Control Scene`.
- It demonstrates that the user can refine AI output.

## Transition

- Section 04 selected/uploaded image is not reused.
- Section 05 does not run a real model.
- Section 04 Aperture Frame becomes the Section 05 correction canvas.
- Section 04 sample images retreat before the correction begins.

## Demo

- Section 05 uses one fixed demo image.
- Initial result is only slightly imperfect.
- Plate bbox is slightly wrong.
- OCR has exactly one wrong character.
- Example correction can be `8 → B`.

## Scroll

- Correction is scroll-driven.
- User does not manually edit in the homepage demo.
- Bbox corrects first.
- OCR corrects second.
- Reverse scrolling reverses the correction.

## Visuals

- One pink bbox handle communicates human intervention.
- Live Plate Crop is included and preferred.
- OCR wrong character receives pink emphasis.
- No HUD clutter.
- No full editor UI.
- No body-type dropdown demo.

## Copy

Locked headline:

```text
WHEN NEEDED, STEP IN.
```

Locked supporting copy:

```text
Adjust the box. Correct the text. Refine the result.
```

## Length

Starting target:

```text
150–180vh
```

---

# 50. Explicitly Not Yet Locked

These details may be tuned later:

- final demo image,
- exact bbox coordinates,
- exact OCR sample,
- exact plate crop placement,
- exact correction canvas size,
- exact typography scale,
- exact typography x/y placement,
- exact pink handle design,
- exact section height,
- exact transition into the footer,
- footer itself.

Do not design the footer from this document.

---

# 51. Acceptance Criteria

Section 05 is successful only if:

## Narrative

- the user understands the result can be refined,
- the system does not appear unreliable,
- the section feels like a continuation of the product story,
- the message “human remains in control” is clear.

## Transition

- Section 04 does not hard-cut into Section 05,
- Aperture Frame visually carries the transition,
- Section 04 user state is not required,
- sample images retreat cleanly.

## Correction

- initial bbox is slightly imperfect,
- scroll visibly corrects the bbox,
- plate crop updates with the bbox,
- OCR visibly changes from one wrong character to the correct one,
- reverse scroll reverses the process.

## Visual quality

- no dashboard aesthetic,
- no form-heavy editor,
- no excessive UI,
- typography remains editorial,
- pink remains a micro-accent,
- correction scene feels premium and calm.

## Technical

- no real backend/model run is required,
- scroll is the source of truth,
- geometry remains aligned,
- continuous motion does not cause expensive React rerenders,
- reduced motion is supported.

---

# 52. Final Experience Summary

The intended experience:

```text
SECTION 04

[samples]       YOUR TURN.       [samples]

               [ APERTURE ]

                    ↓ scroll

samples retreat
upload copy retreats
actions retreat

                    ↓

Aperture remains

                    ↓

Aperture grows into correction canvas

                    ↓

            [ demo vehicle image ]

        slightly wrong plate bbox

              34 A8C 123

                    ↓ scroll

pink handle moves

                    ↓

plate bbox corrects
plate crop updates

                    ↓ scroll

8 → B

                    ↓

              34 ABC 123

                    ↓

WHEN NEEDED, STEP IN.

Adjust the box. Correct the text.
Refine the result.
```

The section is not showing an editor screen.

It is showing one idea:

> The AI result is not locked. When needed, the user can refine it.

That principle should guide every design and implementation decision in Section 05.
