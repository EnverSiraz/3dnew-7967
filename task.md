 # Homepage progress
 - [x] Research real brand and product on okuldas.com
 - [x] User approved Turkish 3D marketing homepage plan
 - [x] Initialize managed project; document design
 - [x] Build real interactive miniature school and page
 - [x] Build, inspect desktop/mobile, test interactions
 - [x] Deliver running website
 Decisions: frontend only; existing demo/login links; illustrative interface data labeled.
 Refinement: marketing headings, product paragraphs, and all seven FAQ answers now use existing okuldas.com/tr text. Two real 3D views; desktop scroll changes the sticky scene. Build and lint passed. Browser verified mobile menu, translation, message and calendar tabs, scene controls, scroll state, FAQ; no runtime errors or horizontal mobile overflow.

## Revision — cinematic scroll & original fonts
- [x] Inspect original-site computed typography: Unbounded H1 400; Hanken Grotesk H2 700 and body 400/500
- [x] Download exact Latin/Turkish font files into public/fonts
- [x] Replace small sticky day preview with five-chapter full-viewport scroll sequence
- [x] Directly scrub camera, assembly, orbit, exploded layers and 3D parent phone from section progress
- [x] Add perspective/parallax to interactive parent preview
- [x] Build/lint and browser verification at multiple scroll positions, desktop/mobile/reduced motion
- [x] Deliver updated website
Verification: 6 desktop and 5 mobile progress positions keep the stage pinned at top=0; actual school assembly, camera zoom/orbit, exploded layers and phone are directly scrubbed. Forward/reverse captures at progress .35 are pixel-identical (mean difference 0.0). No runtime errors; no mobile horizontal overflow. Chapter links, translated parent timeline, message/calendar tabs and FAQ verified. Reduced-motion renders all five readable chapters with a static school. Exact Unbounded/Hanken downloaded font names and variable weight axes verified; build and lint pass.

## Revision — approved lotus hero
- [x] Inspect actual logo and document approved sculptural direction
- [x] Create hero-only 3D lotus with orbiting messages, calendar and learning objects
- [x] Replace hero controls and descriptive labels; preserve original marketing text
- [x] Build/lint, verify desktop/mobile and reduced motion; compare lower component hashes
- [ ] Deliver updated website
Preservation baseline: school-world c493abc601a2be3e37628e84058d9d88fa6833be05db2937c85cb05080096067; scroll-world 446021d399333003ac4a26a26f863e812bbf07edfe529b80d214600d841bb42b; scroll-story 918a1636457e3da67da8948e12e84ab526b398c484d1f4fe52a547560ecf8f3d; scroll-phone a93eabde6afd55810dc04d84f2f2e1e20d741aceb1b13d18698dee201a5bee6e.
Verification: build and lint pass, 0 lint warnings/errors. Desktop and 390px mobile hero screenshots visually inspected. Focus tabs and reset respond; dragging changes real rendered geometry. No runtime errors or mobile horizontal overflow. Fresh default-motion desktop tested at .1/.4/.72/.96/.4 and mobile at .35/.7/.96/.35: cinematic stage remains top=0. All four lower component hashes match baseline exactly. Reduced-motion hero is static and all five lower chapters remain readable. A media-emulation change within an already mounted reduced-motion page was not a valid sticky regression test; repeated in a fresh default-motion page successfully.

## Revision — eight continuous orbit items
- [x] Add attendance, meal, media, sleep and translation to existing three satellites
- [x] Replace oscillation with a continuous full 36-second orbit; keep readable front-facing tiles and subtle local tilts
- [x] Build/lint and inspect desktop/mobile, continuous idle animation, controls and reduced-motion
- [ ] Deliver updated hero; lower cinematic components remain unchanged
Verification: build and lint passed (0 lint warnings/errors). Desktop/mobile screenshots inspected with all eight satellites. Without any input, desktop phase advanced .143→.272 and mobile .145→.247; focus tabs still work. Reduced-motion phase stays 0 with all five static lower chapters. No runtime errors or horizontal overflow. All four lower component hashes still match preservation baseline.

## Approved revision — chapter snap on scroll idle
- [x] Preserve direct scroll scrubbing; add 240ms idle detection and interruptible settling tween
- [x] Use five full-opacity poses for nearest snapping and rail navigation
- [x] Preserve normal section entry/exit and reduced-motion static layout
- [ ] Build/lint and verify all chapters, reverse scroll, cancellation, mobile touch and entry/exit
- [ ] Deliver updated website
Only scroll-story and a new use-chapter-snap hook change. Hero orbit, shared school model, camera choreography and parent phone remain unchanged.

## Approved revision — three audience AI chapters
- [x] Re-read live okuldas.com/tr AI section; user selected three grouped audience chapters
- [x] Copy all 11 feature titles/descriptions verbatim; preserve exact introduction
- [x] Build new scroll-bound storybook/approval, teacher workflow board and management analytics scenes
- [x] Add desktop feature groups, mobile expandable descriptions and reduced-motion reading layout
- [x] Reuse chapter-idle snap with a configurable three-pose array
- [x] Build/lint and verify 3D scenes, exact source copy, desktop/mobile, snap and reduced motion
- [x] Deliver updated website
Verification: all 11 titles and descriptions match the live source verbatim. Desktop and mobile audience anchors snap with the stage pinned at top=0; all 11 mobile descriptions can be expanded, including at 360×640. Reduced motion shows all 11 paragraphs with snapping disabled. Input interruption and the original five-chapter snapping were tested; reversible AI rendering produced mean pixel difference 0.0. After the final scene-layout patch, build and lint pass with 0 lint warnings/errors; family and management screenshots inspected, no runtime errors or horizontal overflow. Original school-world, scroll-world and scroll-phone hashes remain unchanged.

## Approved comparison — futuristic AI experience
- [x] User selected light futuristic processor, data ribbons and holographic outputs
- [x] Document direction; retain original experience and shared exact feature data
- [x] Add independent second section and new three-chapter technology geometry
- [x] Verify desktop/mobile, duplicate IDs, identical copy, independent snapping, reduced motion and preserved original files
- [x] Build/lint
- [ ] Deliver both versions on one page
Verification: 11 identical feature titles/bodies in both versions, no duplicate DOM IDs. Desktop all three anchors pinned at top=0 with no runtime errors or overflow. Mobile 390×844 and 360×640 all 11 descriptions expand; original section independently snaps at .50. Final narrow-screen navigation moved above platform badge: all three rail buttons and all 11 toggles verified at 360×640, tag remains above navigation. Final 390px family/teacher controls verified; the redundant final management/reduced rerun exceeded its test time limit, while the earlier complete 390px and reduced-motion checks passed. Reduced motion earlier verified all 11 paragraphs visible, no snap state and no overflow. Reversible tech-world rendering at .50 is pixel-identical (mean difference 0.0). Comparison link returns to original anchor with the existing 100px header offset. Original AI component, geometry and stylesheet hashes unchanged. Final build/lint pass, 0 lint warnings/errors. New WebGL scene mounts only near its section. Production bundler retains existing large-chunk/template deprecation warnings.