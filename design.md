# Okuldaş — a little world, beautifully connected

Public Turkish marketing homepage, frontend only. Existing lotus logo and slate blue #3f566b from okuldas.com, ink #253c48, paper #f8f9f4, mint #b8daca, peach #efb59d, butter #e9cd81.

## Typography & layout
Use the exact self-hosted font files from okuldas.com: Unbounded regular for H1 and immersive scene titles; Hanken Grotesk 700 for section headings, Hanken Grotesk 400/500 body. Original-site H1 computed size 62px, weight 400; H2 Hanken Grotesk 40px/700. Responsive hero sized to fit. 1240px max width; 72px section spacing. Editorial split hero followed by a full-viewport pinned cinematic 3D sequence. Fine grid background, ambient shadows, clay geometry, pill buttons and subtle borders.

## Pages & flows
Home in pages/home.tsx composed from pages/index.tsx. Header, hero, benefit strip, scroll-linked school-day story, parent app interactive preview, FAQ, demo CTA, footer. Links for demo and login point to existing site. Product examples explicitly illustrative, no invented customer metrics.

## Copy source — user refinement
Use the actual Turkish mottos and product copy from https://okuldas.com/tr, not invented slogans. Hero: “Okullar için yapay zeka, günün tamamında yanınızda.” Product: “Okul gününde ihtiyaç duyulan her şey, nihayet tek yerde.” Parents: “Velilerin gerçekten kullanmak istediği bir okul uygulaması.” AI: “Aileler, öğretmenler ve yöneticiler için tek bir yapay zeka sistemi.” CTA: “Okuldaş'ı kendi okulunuzun günüyle görün.” All seven FAQ questions and answers copied verbatim from live-site details. Interaction labels can be descriptive; marketing language must retain the existing brand voice.

## Motion & UX
User wants much bigger scroll-bound transformations, not subtle rotation or triggered fades. Replace the small sticky day illustration with a five-chapter, full-viewport WebGL scroll sequence: school assembles from separated parts, camera zooms into classroom, camera orbits playground, architecture/furniture separate into exploded layers, and school transforms into an orbiting parent-communication scene. Scroll progress directly and reversibly controls translation, rotation, scale, camera position and zoom. Large copy and chapter rail also scrub. Parent phone has a second perspective/tilt/parallax sequence tied to scrolling. Mobile retains the real 3D sequence, with a shorter pin and touch scrolling preserved. Reduced-motion shows a static assembled scene and readable feature copy. Keep all existing source copy and functioning parent preview/FAQ.

## Architecture
Managed Bun/Vite/React frontend in packages/web, components/school-world.tsx and global styles.css. No new API routes, database tables, auth or payments.

## Approved revision — sculptural lotus hero
Replace only the hero classroom with a dimensional interpretation of the actual Okuldaş lotus/nib mark: individually beveled ceramic petals in the logo's slate, blue-gray, rose, violet and teal. A fine elliptical orbit connects a message tile, calendar tile and open book with playful learning blocks. Soft studio lighting, shallow plinth, gentle continuous orbital motion and drag-to-rotate controls. Hero focus tabs become Mesajlar / Takvim / Öğrenme, with a descriptive live label. Respect reduced motion. Keep all marketing copy, exact fonts, layout and the lower five-chapter cinematic scroll scene unchanged. Add a separate lotus-world.tsx and hero-scoped styles; do not modify the shared SchoolModel or any lower scroll component.

## Revision — richer, continuously revolving app orbit
Eight meaningful satellites: messages, calendar, learning/book, attendance check-in, meal tracking, shared photos/media, sleep tracking and 12-language translation. Replace back-and-forth drift with a continuous 360-degree elliptical revolution, one turn every 36 seconds, independent of scrolling or pointer input. Uniform spacing, smaller ceramic feature tiles and light individual tilts keep the mark legible. Retain focus controls and drag/reset, and stop automatic motion for prefers-reduced-motion. Only hero component files change; lower cinematic scene stays untouched.

## Approved revision — settle-to-chapter cinematic scroll
Keep free, reversible scroll scrubbing and the existing pinned 3D stage. After scrolling/touch momentum ends, smoothly settle to the nearest complete chapter pose, never leave the copy between chapters. Five readable pose anchors: .16 / .34 / .50 / .70 / .96. Debounced idle snapping with an interruptible requestAnimationFrame tween; wheel, touch, pointer and keyboard input immediately cancel the automatic move. Chapter rail uses the same exact anchors. Do not trap entry/exit: upward movement before the first pose and downward movement beyond the final pose scroll out normally. No snapping in reduced-motion static layout, outside the pinned range, or while dragging/touching. Preserve all 3D geometry, hero orbit, typography and source copy.
