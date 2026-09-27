# Vehicle Analysis Website — Section 04 Upload Experience Handoff

## Status

This document defines the **locked concept, interaction model, visual composition, upload behavior, sample-image behavior, and Section 03 → Section 04 transition** for the homepage.

Section 01, Section 02, and Section 03 are already conceptually established. This document focuses only on:

```text
SECTION 03 → SECTION 04 transition
SECTION 04 — Upload / Try It Yourself
```

Do not begin Section 05 from this document.

The implementation agent will also receive the local Waabi source code. Use placeholders such as:

```text
WAABI_REFERENCE_PATH=<LOCAL_PATH_TO_WAABI_SOURCE>
WAABI_HOME_REFERENCE_PATH=<OPTIONAL_DIRECT_PATH_TO_HOME_PAGE_OR_RELEVANT_COMPONENT>
```

Before implementing Section 04, inspect the Waabi homepage interaction where the opening hero media shrinks, the media becomes part of the following composition, and multiple scattered images appear around a central editorial block. The local Waabi source is the primary reference for the image reveal/parallax choreography.

Do **not** copy Waabi branding, text, imagery, exact dimensions, or code wholesale. Use the source as a technical and motion reference.

---

# 1. Narrative Role

The homepage narrative is now:

```text
SECTION 01 — EXPERIENCE
cinematic opening

SECTION 02 — DEFINE
ONE IMAGE
MORE THAN IT SHOWS.

THE SYSTEM
SEES FURTHER.

SECTION 03 — REVEAL
01 /04 VEHICLE
02 /04 PLATE
03 /04 OCR
04 /04 BODY

SECTION 04 — TRY
upload your own image
or choose one of the provided samples
```

The user has already seen what the system does. Section 04 should therefore not explain the pipeline again. Its job is simply:

> Now try it yourself.

Do not turn this section into a generic SaaS upload block.

---

# 2. Core Concept

Section 04 is a combination of:

```text
WAABI-STYLE SCATTERED SAMPLE IMAGES
+
CENTRAL EDITORIAL COPY
+
APERTURE FRAME UPLOAD COMPONENT
```

There are exactly:

```text
8 sample images total
4 on the left
4 on the right
```

One of the eight sample images is the image carried forward from Section 03. The other seven are curated sample images added later.

The samples are functional. Clicking one selects that image for analysis.

---

# 3. Locked Section 03 → Section 04 Transition

## 3.1 Starting state

Section 03 ends on:

```text
04 /04
BODY
```

The right-side analysis visual is still visible.

It may contain:

- the source vehicle image,
- BODY result presentation,
- remaining analysis overlays,
- Section 03 process-spine context.

## 3.2 Spatial continuity rule

The Section 03 image must **remain on the right side of the viewport**.

Do not move it to the center.
Do not move it to the left.

The correct motion is:

```text
large right-side analysis image
        ↓
analysis overlays retreat
        ↓
image scales down
        ↓
small local positional correction
        ↓
image settles into one of the right-side sample positions
```

This is a locked decision.

## 3.3 Process spine ending

The Section 03 process spine ends here.

```text
Section 03 line
→ finishes
→ resolves / disappears
→ does NOT continue into Section 04
```

Do not make the line a global timeline.

## 3.4 Analysis UI retreat

Recommended order:

```text
BODY result retreats
↓
vehicle/plate analysis overlays retreat
↓
04 /04 counter retreats
↓
Section 03 text rail retreats
↓
process spine resolves
↓
clean source image remains
```

The image itself should remain visible. Avoid fading it out and replacing it with a duplicate.

## 3.5 Scale-down into sample field

The image then scales down into its final right-side sample slot.

Rules:

- keep it on the right,
- avoid large X-axis travel,
- allow only small X/Y corrections,
- preserve rounded corners,
- use transform-based interpolation,
- maintain visual continuity.

Conceptually:

```text
SECTION 03

                    ┌──────────────────────┐
                    │   LARGE BODY IMAGE   │
                    └──────────────────────┘

                            ↓

SECTION 04

                                  ┌─────────────┐
                                  │   sample    │
                                  └─────────────┘
```

---

# 4. Other Sample Images Appearing

As the Section 03 image settles into the sample composition, the other seven images appear.

The implementation agent should inspect the Waabi homepage source and adapt the relevant reveal/parallax logic.

Desired character:

```text
soft
controlled
layered
editorial
light parallax
not random
not flashy
```

A reasonable initial animation character is:

```text
opacity: 0 → 1
scale: 0.96 → 1
small y-offset → resting position
```

Do not use large off-screen fly-ins.

The images should feel like they were already part of the scene and are gently becoming visible.

---

# 5. Sample Image Layout

Locked count:

```text
8 samples
```

Locked distribution:

```text
4 left
4 right
```

One right-side image is the Section 03 source image.

The geometry should follow the Waabi homepage idea:

- left and right sides feel balanced,
- images follow a controlled X logic,
- their Y positions differ,
- the result is not a rigid grid,
- the result is not random collage,
- the center remains protected for the upload experience.

Conceptually:

```text
LEFT SIDE                            RIGHT SIDE

[ sample ]                           [ sample ]

          [ sample ]        [ sample ]

[ sample ]                           [ Section03 sample ]

         [ sample ]          [ sample ]


                  CENTER
              YOUR TURN.
           upload interaction
```

---

# 6. Sample Image Content

The final assets are not locked yet.

Use curated visual variety. Good candidates include:

```text
sedan
SUV
minivan
pickup
motorcycle
different viewing angles
different lighting conditions
```

Avoid eight near-identical cars.

Do not add visible class labels on top of samples.

The visual implication should be:

> You can try the system with different kinds of vehicle images.

---

# 7. Sample Interaction

Every sample image is clickable.

Click behavior:

```text
sample click
↓
sample becomes selected
↓
central Aperture Frame preview changes to that sample
↓
ANALYZE becomes available
```

Analysis never starts automatically.

This is locked.

---

# 8. Selected Sample State

Use the site's pink accent as a restrained selected-state signal.

Allowed treatments:

- thin pink outline,
- tiny pink dot,
- subtle pink corner marker,
- very small contrast/scale emphasis.

Avoid:

- large checkmark,
- filled pink overlay,
- badge-like selected state,
- form-control styling.

The sample should still look like a photograph first.

---

# 9. Sample Hover

Recommended hover:

```text
scale: 1 → ~1.02 / 1.03
small contrast increase
pointer cursor
optional tiny pink micro-accent
```

Optional:

- subtle local parallax,
- tiny depth movement.

Avoid:

- large zoom,
- glowing border,
- tooltips,
- "TRY THIS IMAGE" labels.

---

# 10. Locked Central Copy

Use exactly:

```text
YOUR TURN.

Bring your own image,
or choose one around you.
```

Keep the copy short.

Do not add a long explanatory paragraph.

---

# 11. Upload Component Concept

The upload component is locked as:

```text
APERTURE FRAME
```

The central upload experience must not look like a conventional dropzone.

Avoid:

- dashed border,
- upload-cloud icon,
- generic drag-and-drop box,
- large rounded SaaS card,
- heavy shadow,
- large gray panel.

Instead, the user sees a quiet image window ready to receive an image.

---

# 12. Aperture Frame — Empty State

Conceptually:

```text
YOUR TURN.

Bring your own image,
or choose one around you.


        ┌───────────────┐
        │               │
        │       +       │
        │               │
        └───────────────┘

           CHOOSE IMAGE
```

The real implementation should be lighter and more refined than the diagram.

Visual direction:

- fixed aspect ratio,
- nearly borderless,
- subtle warm surface,
- small central `+`,
- quiet corner marks,
- no heavy container treatment.

---

# 13. Aperture Frame Ratio

Initial ratio:

```text
3:2
```

Fallback if visual tuning later requires it:

```text
16:10
```

Do not default to a square.

The frame should feel natural for automotive photography.

---

# 14. Aperture Corner Language

The corner marks are the main distinctive detail.

Conceptually:

```text
┌─                    ─┐



        +



└─                    ─┘
```

The corners should be short and precise.

They should lightly echo the precision of Section 03 detection boxes without literally reproducing a bounding box.

This creates continuity:

```text
SECTION 03
machine bbox language

        ↓

SECTION 04
human input aperture language
```

---

# 15. Aperture Resting State

In the empty resting state:

- the surface boundary is very subtle,
- corner marks are invisible or extremely faint,
- small `+` sits at the visual center,
- `CHOOSE IMAGE` is visible below,
- the component reads as an empty image window rather than a file form.

The frame can have a very subtle warm tonal difference from the page background.

---

# 16. Aperture Hover

When hovering over the frame:

- corner marks become slightly more visible,
- corners may extend outward by a few pixels,
- central `+` may gain pink emphasis,
- surface contrast may increase slightly.

Keep motion restrained.

Do not scale the whole frame aggressively.

---

# 17. Drag-and-Drop State

Drag-and-drop is supported.

When a compatible image is dragged over the upload area:

```text
corner marks open slightly
pink accent becomes visible
surface becomes more legible
central content changes
```

Possible temporary text:

```text
DROP IMAGE
```

or:

```text
DROP TO SELECT
```

Use only one short state label.

Do not cover the entire viewport with a giant upload overlay.

Optional refinement:

- surrounding sample opacity reduces slightly,
- center Aperture gains emphasis,
- samples remain visible enough to preserve the composition.

---

# 18. File Selection Behavior

A local file can be selected through:

```text
CHOOSE IMAGE
```

or by drag-and-drop.

Locked behavior:

```text
select file
↓
show preview
↓
wait
↓
user explicitly presses ANALYZE
```

Analysis does not begin immediately.

---

# 19. Preview Is Mandatory

The selected image must always be visible before analysis.

Do not depend on the operating-system file picker to communicate which file was selected.

The product itself must confirm:

> This is the image you are about to analyze.

This applies to both:

- local uploads,
- clicked sample images.

---

# 20. Aperture Frame — Selected State

After a local file or sample image is selected:

```text
YOUR TURN.

Bring your own image,
or choose one around you.


        ┌───────────────┐
        │               │
        │ IMAGE PREVIEW │
        │               │
        └───────────────┘

    CHANGE IMAGE      ANALYZE
```

The Aperture Frame keeps the same dimensions.

Do not resize the section based on the selected image's native dimensions.

---

# 21. Preview Rendering

Use a fixed frame.

Initial recommendation:

```text
frame = fixed 3:2
image = object-fit: contain
```

This prevents horizontal/vertical uploads from breaking the page.

If the image does not fill the frame, use the Aperture surface color around it.

Do not stretch the image.

A carefully tuned `cover` mode may be evaluated later, but `contain` is the safe default for correctness.

---

# 22. Local File Replacement

`CHANGE IMAGE` reopens the file picker.

Behavior:

```text
current preview
↓
CHANGE IMAGE
↓
file picker
↓
new file selected
↓
old preview replaced
↓
still waiting for ANALYZE
```

No analysis starts automatically.

---

# 23. Clicking Another Sample

If a sample is already selected and the user clicks another sample:

```text
sample A selected
↓
sample B clicked
↓
preview becomes B
↓
selected pink accent moves A → B
↓
ANALYZE remains available
```

No confirmation modal is needed.

---

# 24. Local Upload vs Sample Selection

Both feed the same central selection pipeline:

```text
LOCAL FILE ─────────┐
                    ├──→ SELECTED IMAGE
SAMPLE IMAGE ───────┘
                           ↓
                        PREVIEW
                           ↓
                        ANALYZE
```

Suggested internal type:

```ts
type SelectedImageSource =
  | { type: "upload"; file: File; previewUrl: string }
  | { type: "sample"; id: string; src: string };
```

The preview component should not care where the image originated.

---

# 25. Selection Rules

## Sample selected

- central preview shows sample,
- selected sample receives pink accent,
- `CHANGE IMAGE` is available,
- `ANALYZE` is available.

## Local file selected

- central preview shows local file,
- no sample remains selected,
- `CHANGE IMAGE` is available,
- `ANALYZE` is available.

---

# 26. Action Controls

After an image is selected, show exactly:

```text
CHANGE IMAGE
ANALYZE
```

Do not add:

```text
REMOVE
DELETE
CROP
EDIT
RESET
ROTATE
```

Section 04 is for selection and starting analysis. Editing belongs later.

---

# 27. Action Hierarchy

`ANALYZE` is the stronger action.

`CHANGE IMAGE` is secondary.

Possible treatment:

```text
CHANGE IMAGE
quiet text action

ANALYZE
stronger action + subtle directional/pink detail
```

Avoid an oversized filled CTA if the rest of the page remains understated.

---

# 28. Analyze Behavior

When the user presses:

```text
ANALYZE
```

the selected image enters the real analysis flow.

The exact loading/results route is outside this document.

Section 04 owns only:

```text
select
preview
confirm
analyze
```

Do not invent the full results experience here.

---

# 29. Empty vs Selected Actions

Empty state:

```text
CHOOSE IMAGE
```

Selected state:

```text
CHANGE IMAGE      ANALYZE
```

Do not show all three simultaneously.

---

# 30. Pink Accent Rule

Pink remains a micro-accent.

Use it for:

- selected sample state,
- active Aperture `+`,
- drag-active corners,
- small Analyze detail,
- keyboard/focus state.

Do not turn the Aperture Frame into a large pink surface.

---

# 31. Background and Surface

Continue the warm editorial background from previous sections unless globally changed later.

Reference character:

```css
--page-bg: #F2F0EA;
```

The scattered samples and central upload area should feel like one continuous page world.

Avoid a hard section-color break.

---

# 32. Central Composition

Empty:

```text
             YOUR TURN.

      Bring your own image,
      or choose one around you.


           [ APERTURE ]


          CHOOSE IMAGE
```

Selected:

```text
             YOUR TURN.

      Bring your own image,
      or choose one around you.


           [ PREVIEW ]


   CHANGE IMAGE      ANALYZE
```

The sample images surround this central axis.

---

# 33. Protected Center Region

The eight samples must not compete with the central action.

Maintain a protected center area with:

- generous negative space,
- clear copy,
- readable Aperture Frame,
- clear action controls.

If the composition becomes crowded, reduce sample size before reducing central clarity.

---

# 34. Sample Size Variation

The sample images may have slightly different sizes.

Rules:

- avoid extreme scale differences,
- avoid making one sample look like the CTA,
- Section 03-origin sample may retain slightly more visual significance during transition only,
- once Section 04 settles, it becomes equal to the others.

---

# 35. Section 03-Origin Sample

Once Section 04 is fully established, the image carried from Section 03:

- behaves like any other sample,
- is clickable,
- can be selected,
- receives the same pink selected state.

Do not label it as:

```text
CURRENT
PREVIOUS
DEMO
SECTION 03
```

---

# 36. Initial Selection

Default recommendation:

```text
no sample is selected on first entry
```

The Aperture starts empty.

The Section 03-origin image is visible as a sample but is not automatically loaded into the preview.

This can be revisited only if later testing suggests otherwise.

---

# 37. Sample → Preview Motion

When a user clicks a sample, the center should feel connected to that choice.

A literal full-card flight to the center is not required.

Good options:

- shared-layout transition,
- crossfade,
- subtle scale transfer,
- image opacity resolve.

Keep it restrained.

Avoid dramatic full-screen travel.

---

# 38. Motion Restraint

This section contains many visual objects already.

Therefore keep ranges small:

```text
translation: low
scale: low
parallax: subtle
```

The overall scene should remain calm and premium.

---

# 39. Desktop-First

The Waabi-like scattered composition is primarily a desktop experience.

Desktop is the first priority.

The exact mobile visual composition is not locked yet.

Mobile must still preserve:

- local upload,
- sample selection,
- preview,
- Change Image,
- Analyze.

Do not force eight scattered images into an unreadable mobile collage.

---

# 40. Possible Mobile Direction

A later pass may adapt samples into either:

```text
horizontal sample rail
+
central Aperture
```

or:

```text
lightweight 2-column sample layout
+
central upload area
```

This is not locked yet.

Do not over-invest in mobile scatter before desktop is approved.

---

# 41. Accessibility

Samples should be keyboard-selectable semantic controls.

Requirements:

- visible focus state,
- keyboard activation,
- usable file input,
- accessible selected state,
- clear Analyze action,
- meaningful alt text where appropriate.

Do not rely only on pink color to communicate selection.

---

# 42. Reduced Motion

Honor:

```css
@media (prefers-reduced-motion: reduce)
```

Reduced-motion behavior:

- Section 03 image settles with minimal interpolation,
- other samples fade in instead of parallax,
- Aperture corner motion is reduced,
- preview changes use simple opacity,
- functionality remains unchanged.

---

# 43. Performance

Section 04 contains eight images, so optimize accordingly.

Recommendations:

- use responsive image sizes,
- avoid unnecessarily huge assets,
- lazy-load where appropriate,
- reuse/preload the Section 03 image,
- animate transform/opacity,
- avoid heavy blur,
- avoid continuous React re-renders during parallax.

---

# 44. Suggested Data Model

```ts
type SampleImage = {
  id: string;
  src: string;
  alt: string;
  side: "left" | "right";
  position: {
    x: number;
    y: number;
  };
  size: {
    width: number;
  };
  isSection03Source?: boolean;
};
```

Central selection state:

```ts
type SelectedImage =
  | null
  | {
      source: "sample";
      sampleId: string;
      previewSrc: string;
    }
  | {
      source: "upload";
      file: File;
      previewSrc: string;
    };
```

---

# 45. Suggested Component Architecture

```tsx
<UploadExperienceSection>
  <SampleImageField>
    <SampleImage />
    <SampleImage />
    ...
  </SampleImageField>

  <UploadCenter>
    <UploadCopy />
    <ApertureFrame />
    <UploadActions />
  </UploadCenter>
</UploadExperienceSection>
```

Aperture:

```tsx
<ApertureFrame
  selectedImage={selectedImage}
  dragActive={dragActive}
  onChooseFile={...}
  onDropFile={...}
/>
```

Samples:

```tsx
<SampleImage
  selected={selectedImage?.sampleId === sample.id}
  onSelect={() => selectSample(sample)}
/>
```

---

# 46. Hidden File Input

Use a real file input behind the custom presentation.

```tsx
<input
  type="file"
  accept="image/*"
  hidden
/>
```

`CHOOSE IMAGE` and `CHANGE IMAGE` trigger it.

Do not create a fake file-picker implementation.

---

# 47. File Validation

At minimum validate:

- supported image type,
- valid usable file,
- reasonable file-size limit.

Exact production limits are not locked here.

Show simple errors near the Aperture.

Do not use intrusive modals for ordinary file errors.

---

# 48. Preview URL Lifecycle

For local uploads, if using:

```js
URL.createObjectURL(file)
```

revoke old object URLs when they are replaced or the component unmounts.

---

# 49. Waabi Reference — What to Inspect

Before final motion tuning, inspect the local Waabi homepage source for:

- hero media shrink behavior,
- image relocation into the next composition,
- scattered image reveal,
- per-image parallax,
- sticky/pinned sections if used,
- scroll-progress mapping,
- easing/spring character,
- responsive behavior.

Reuse the **interaction principles**, not the branding or exact implementation blindly.

---

# 50. What We Take From Waabi

We intentionally borrow:

```text
scattered-image composition
controlled staggered Y placement
balanced left/right field
soft image reveal
light parallax
media continuity between sections
```

---

# 51. What We Do Not Take From Waabi

Do not copy:

- Waabi imagery,
- Waabi copy,
- Waabi exact coordinates,
- Waabi exact image count,
- Waabi fonts,
- Waabi brand colors,
- Waabi DOM/CSS wholesale.

Our adaptation is product-specific because every sample is a usable analysis input.

---

# 52. Suggested Implementation Sequence

```text
1. Inspect Waabi homepage source.
2. Identify scattered-image reveal/parallax implementation.
3. Build static Section 04 desktop composition.
4. Place 4 left + 4 right sample slots.
5. Reserve one right-side slot for Section 03 image.
6. Build central YOUR TURN copy.
7. Build Aperture Frame empty state.
8. Add hover corner behavior.
9. Add drag-and-drop state.
10. Add local file selection.
11. Add preview state.
12. Add CHANGE IMAGE.
13. Add ANALYZE.
14. Add sample selection.
15. Add pink selected state.
16. Make sample selection update preview.
17. Implement Section 03 image scale-down transition.
18. Implement the other seven sample reveals.
19. Tune parallax/reveal using Waabi reference.
20. Add reduced-motion behavior.
21. Add accessibility/focus behavior.
22. Optimize sample loading.
23. Do not begin Section 05.
```

---

# 53. Acceptance Criteria

## Transition

- Section 03 BODY image remains on the right.
- It scales down naturally.
- It becomes one of the right-side samples.
- It does not travel unnecessarily to center or left.
- Section 03 process spine ends before Section 04.
- Seven other samples appear with Waabi-inspired motion.

## Composition

- Exactly eight samples are present.
- Four are left.
- Four are right.
- Y positions are staggered.
- Layout feels controlled, not random.
- Central upload area remains visually dominant.

## Upload

- Aperture Frame does not look like a generic dropzone.
- `CHOOSE IMAGE` opens file picker.
- Drag-and-drop works.
- Selected image always gets a preview.
- Selection does not auto-start analysis.
- `CHANGE IMAGE` works.
- `ANALYZE` is explicit.

## Samples

- Every sample is clickable.
- Clicking a sample updates central preview.
- Selected sample receives restrained pink state.
- Another sample can replace current selection.
- Local upload clears sample selection.

## Visual quality

- Pink remains a micro-accent.
- The section remains editorial and premium.
- No SaaS upload-card aesthetic.
- No dashed border.
- No giant upload icon.
- No dashboard styling.
- Center remains uncluttered.

---

# 54. Locked Decisions

## Section 03 → 04

- Section 03 ends on BODY.
- Right-side image remains on the right.
- It shrinks into the Section 04 sample field.
- It becomes one of the right-side samples.
- Other samples appear during this transition.
- Local Waabi homepage source is the primary reveal/parallax reference.
- Section 03 process line ends and does not continue.

## Section 04 layout

- Eight samples total.
- Four left.
- Four right.
- Staggered Y positions.
- Waabi-like controlled scatter.
- Central editorial upload composition.

## Copy

Locked copy:

```text
YOUR TURN.

Bring your own image,
or choose one around you.
```

## Upload component

- Concept: `Aperture Frame`.
- Initial ratio: `3:2`.
- Minimal / nearly borderless.
- Corner marks.
- Small central plus.
- Drag-and-drop supported.
- Classic dashed dropzone styling prohibited.

## Selection

- Local upload shows preview.
- Sample selection shows preview.
- No automatic analysis.
- User explicitly presses `ANALYZE`.
- User can press `CHANGE IMAGE`.
- Selected sample receives pink micro-accent.

## Preview

- Frame dimensions remain fixed.
- Image does not distort layout.
- Prefer `object-fit: contain` initially.
- Upload and sample use the same preview pipeline.

---

# 55. Explicitly Not Yet Locked

These may be tuned later:

- exact sample images,
- exact sample coordinates,
- exact sample sizes,
- exact Waabi-derived parallax values,
- exact Section 03-origin sample slot,
- exact Aperture pixel dimensions,
- exact corner lengths,
- exact pink value if globally adjusted,
- exact hover scale,
- exact drag label,
- exact file-size/type limits,
- exact mobile composition,
- Section 04 → Section 05 transition,
- Section 05 itself.

Do not invent Section 05 from this handoff.

---

# 56. Final Experience Summary

```text
SECTION 03

04 /04
BODY

                    [ large analyzed image ]

                            ↓

analysis UI retreats

                            ↓

right-side image shrinks locally

                            ↓

                    [ right-side sample ]

other seven samples appear

                            ↓


[ samples ]       YOUR TURN.        [ samples ]

            Bring your own image,
            or choose one around you.

                  ┌───────────┐
                  │     +     │
                  └───────────┘

                  CHOOSE IMAGE


                            ↓

user uploads OR clicks a sample

                            ↓


                  ┌───────────┐
                  │  PREVIEW  │
                  └───────────┘

             CHANGE IMAGE   ANALYZE
```

The key experience is:

> The example image from the analysis pipeline becomes part of a wider field of images the user can try, while the center of the composition invites the user to bring their own image.

Section 04 should feel like an **editorial interactive scene**, not an upload form.
