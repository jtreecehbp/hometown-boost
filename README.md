# Hometown Boost

A full Astro marketing-site rebuild around “Big things start local.” The homepage follows the Hometown Boost water tower as it launches from a three-dimensional town. The existing 17 pages, four website plans, add-on prices, minimum commitments, resources, and Netlify form field contract are retained.

## Active hosting: Coolify

Use Coolify for this rebuild until the owner requests another hosting change. The deployment branch is `preview/3d-launch` in `jtreecehbp/hometown-boost`. It intentionally remains separate from the other site version on `main` and the existing custom-domain application.

Active preview: https://hometown-boost-preview.40.160.2.98.sslip.io. Reuse the Coolify application `hometown-boost-3d-preview` (ID `bklwhohxof5n40qep7h8n26a`) for future deployments from this branch.

The Dockerfile builds Astro with Node 24 and `PUBLIC_FORM_DELIVERY=server`, then serves the static output and `/api/contact` on port 3000 as a non-root user. Select the Dockerfile build pack in Coolify. `/healthz` is the container health endpoint. `SITE_INDEXING=off` adds no-index headers and disallows crawling of this temporary preview.

Set `FORM_SERVICE_URL` in Coolify to the existing Netlify form receiver: `https://6a9c0c7eee8155b723a96453--hometown-boost-temp-20260605000628.netlify.app/`. Coolify hosts the website; Netlify Forms remains the existing inquiry inbox. Keep that registered form available while this bridge is in use. This URL is not a credential.

The server validates required fields, field lengths, body size, origin, and the honeypot before forwarding the registered fields. It returns success only after the form provider accepts the request, retains no inquiry logs, and never forwards cookies or browser credentials. Missing delivery configuration returns an error instead of claiming receipt.

## Develop and validate

```sh
npm install
npm run dev
npm run astro -- check
npm run build
npm test
```

The site-output tests inspect `dist`, so build first. For the active Coolify configuration, set `PUBLIC_FORM_DELIVERY=server` during the build and configure `FORM_SERVICE_URL` when starting `node server.mjs`. A default local build deliberately does not send inquiries. Legacy Netlify builds still support `PUBLIC_FORM_DELIVERY=netlify` or Netlify's `NETLIFY=true`.

## Design and 3D

- Shared navy/orange brand tokens with white surfaces and a daylight sky: `src/styles/tokens.css`; responsive styles: `src/styles/global.css`; continuous homepage layout: `src/styles/launch.css`.
- Self-hosted Manrope and Inter variable fonts.
- The town uses brighter storefront materials, smooth foliage, white clouds, and a blue enamel tower with raised lettering, roof seams, and soft shadows. A small prefiltered environment supplies metal reflections without downloading a texture. Rendering quality remains capped on mobile.
- The ascent passes two striped hot-air balloons, an orange-and-white propeller plane, and a gold satellite with blue solar panels. `src/scripts/launch-landmarks.ts` builds them as five batched meshes at separate world altitudes. Portrait layouts use smaller models and closer lanes.
- One sticky Three.js canvas spans seven content chapters and three short cinematic interludes. The camera begins at street height, reveals the tower, moves toward ignition, follows an S-shaped banking ascent, breaks through a cloud curtain, and pulls back to the hometown for the final invitation. Plans and questions hold a steady camera.
- `src/scripts/launch-motion.ts` maps measured sections and weighted scene cues to one deterministic timeline. Tall mobile pricing cards and expanded FAQ answers retain their chapter timing. The tank and roof separate from fixed steel supports, and reverse scrolling retraces the same path.
- `src/scripts/launch-cinema.ts` supplies opening storefront shutters, birds that scatter during ignition, the van’s curved street route, a baked orange exhaust trail, and warm connections spreading among the businesses at the end. A waving mechanic appears beside the launch pad and again on the satellite. All activity shares the existing pause and reduced-motion controls. `scene-sculpt.ts` batches the small model details; no additional image downloads or render loop is required.
- The homepage has chapter links and a pause/play control. Reduced motion starts with a grounded, stationary scene; playing is optional. Rendering pauses offscreen and in background tabs, resumes after page-cache restoration, and falls back to the emblem if WebGL is unavailable or its context is lost. Pixel density and frame rate are capped for mobile.
- Services and about reuse the same town with a quieter camera, desktop dragging, and accessible rotation and pause controls. Other routes do not load the 3D scene.
- The supplied logo was developed into a 3D image and an image-generation cutout. The source cutout is `public/images/hometown-boost/hb-rocket-emblem.png`; optimized display and navigation assets are `hb-rocket-emblem.webp` and `hb-rocket-mark.webp` in the same directory. `public/favicon.png` uses the same tower. The 3D scene itself uses native geometry, not the flat image.
- Existing social-preview artwork and metadata are preserved.
- The sample landscaping website is explicitly labeled as an illustrative concept, not a client project.

## Inquiry delivery

The form has four required fields; optional fields remain in a disclosure. Plan, industry, and Google Ads query parameters populate the form. All fields match `public/__forms.html`.

Form detection remains enabled on the linked Netlify form-receiver project. Coolify forwards URL-encoded inquiries through `/api/contact`; the client requires an explicit success response before navigating to `/thank-you/`. Failures keep the entered details and offer retry. Default local builds show an explanatory message and do not transmit inquiries. The standalone server returns 503 when form delivery is not configured.

For reference, legacy Netlify deploys use `dist`. Do not publish new previews there unless the owner changes the active hosting preference:

```powershell
$env:PUBLIC_FORM_DELIVERY = 'netlify'
npm run build
npm test
npx netlify deploy --dir dist --no-build
```

A draft deployment does not replace the production deployment.

## Conversion measurement

`hometown:conversion` custom events are emitted for `cta_click` and `lead_submit_success`. Events are also pushed to an existing `window.dataLayer` if one is installed. No analytics provider or advertising pixel is installed by this rebuild, and form answers are not included in analytics events.

First-touch page, referring page, and campaign tags are retained in session storage and included with the inquiry. The privacy page describes this behavior. Conversion gains require real traffic and an analytics destination to measure.

## Verification

Automated tests cover inquiry prefills, malformed campaign storage, unknown plan values, disabled preview delivery, accepted/rejected/offline requests, duplicate submission protection, all 17 pages, internal links and assets, metadata, schema JSON, pricing commitments, and form registration. Server tests use a mocked provider to verify forwarding, failure handling, validation, health checks, gzip, no-index headers, and path containment. Flight tests check reversible ascent, stationary supports, section timing, numeric camera framing at seven screen sizes, finite geometry, and a bounded draw-call count. Controller tests use mocked rendering to exercise pause, reduced motion, background suspension, page caching, and WebGL failure/restoration. These are local behavioral, geometry, and static-output checks; they do not submit a real inquiry or perform browser visual QA.

The 3D runtime is loaded separately from the page. Text, navigation, pricing, and forms render without waiting for it. The homepage emblem is about 142 KB and the navigation emblem is about 7 KB; the full-resolution PNG is retained as a source asset.
