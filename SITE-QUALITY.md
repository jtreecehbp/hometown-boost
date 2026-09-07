# Site quality review

Release review: September 7, 2026. The owner approved browser testing. The issues found during this review have been corrected. This document records local review evidence and release requirements; the release response identifies the verified public deployment. This is evidence of the tested build, not a guarantee about every device or future conversion results.

## Visual coverage

All 17 content pages and the 404 recovery page were opened, rendered, and visually reviewed in Chrome at 1440×900, 768×1024, and 390×844. Content bounds were checked throughout the documents for unintended horizontal overflow. Each supporting route loaded its own scene in one canvas. Scene descriptions are listed in README.md.

| Pages | Desktop | Tablet | Phone |
| --- | --- | --- | --- |
| Home, Services, Pricing, How it works | Reviewed | Reviewed | Reviewed |
| Industries, About, Google Ads, FAQ | Reviewed | Reviewed | Reviewed |
| Resources and all four individual guides | Reviewed | Reviewed | Reviewed |
| Contact, Thank you, Privacy, Terms | Reviewed | Reviewed | Reviewed |
| 404 recovery | Reviewed | Reviewed | Reviewed |

Additional review covered the 320×740 homepage and Ads comparison, the 844×390 contact form, the service example, article prose, plan cards, comparison scrolling, FAQ disclosures, and footer layouts. A local 200% root-font stress fixture exposed a long-heading overflow; headings now wrap within their column. This fixture checks enlarged root type; it is not a browser-zoom or physical-device test.

## Defects found and corrected

- A foreground building obscured the opening tower. The opening camera now looks over the rooftops and shows the tower and launch supports.
- Portrait tablets used phone camera placement despite having text on the left. The tablet flight now stays beside that text; forward scrolling through the flight/finale and reversing to town were visually checked.
- Chrome reported clipped reflection blur and a deprecated shadow setting. Corrected the settings and reduced the reflection map size on phones. Normal final-page checks produced no application errors. An earlier Windows graphics-driver precision warning was nonfatal.
- The phone comparison was 1,827 pixels tall with static headings. It now scrolls in a bounded region, preserves plan names and feature labels, and explains how to scroll. Keyboard Page Down and Right reached later features and Leader while retaining both labels.
- The three-column Ads table required sideways scrolling. Its shorter headings and responsive columns now fit down to 320 pixels.
- Name fields were too narrow on phones and portrait tablets. They now occupy a full row. A phone shortcut jumps straight to the form.
- The floating motion control covered form labels and comparison content. Form and table focus now pause rendering and hide the control until focus leaves.
- Supporting scenes kept rendering when the footer occupied most of a phone screen. Rendering and its control now stop at that point; the Services callback count stayed at 12 across separate observations at the footer.
- Browser Back reloaded the contact document and restored a sendable form after acceptance. A boolean marker in that history entry now restores the sent receipt and disables duplicate submission, including after a reload. A fresh inquiry gets its own history entry. No form answers are stored in history.
- Optional analytics or failed confirmation navigation could turn accepted inquiries into apparent failures. Delivery confirmation is now independent of both.
- Malformed saved campaign data, including JSON null and non-string values, could disable the form. Attribution is now validated and bounded.
- Font arrival moved the second phone action to a new row, shifting the scene and following section. Those actions now use a stable column and the two text fonts are preloaded. Subsequent phone Services measurements recorded no layout shifts.
- A broad eyebrow selector made the example website's button label low contrast. The label is now white on its dark green background.
- Mobile navigation depended on JavaScript, supporting pages were hard to discover, and missing URLs had a plain error response. Native menus, discoverable supporting links, and a branded 404 recovery page now address those paths.

## Browser behavior verified

- Desktop Explore opens and closes with Escape and returns focus. Phone navigation opens and follows links; the native menu also works with scripts blocked. The skip link bypasses header navigation. FAQ disclosures open and close with Enter.
- Plan links retain their selected plan. Empty submission focuses the first required field without sending. A simulated rejection preserves details and exposes a retry message. Accepted submission reaches Thank you. Browser Back restores Request sent; Start another inquiry opens a fresh enabled form. Native submission with JavaScript blocked also reaches confirmation.
- All form-delivery tests used the local provider simulator. No real inquiry was sent. Provider configuration on Coolify is checked separately; a real inbox delivery is not claimed.
- Homepage Pause held its animation callback count at 64 across separate observations while other checks ran; Play resumed activity. Supporting-scene lifecycle simulation held at 5 callbacks while hidden and resumed to 106 after showing the page.
- Reduced motion on the homepage and data saving on Services left zero canvases and loaded only the lightweight controllers. Explicit Play loaded one canvas. Both preference branches are also covered for both controllers in the automated suite.
- Simulated unavailable WebGL retained the emblem, content, and retry control on Home and Services. Actual WEBGL_lose_context tests removed the live scene, displayed the fallback, and recovered one canvas on restoration for both renderers.
- A response policy blocked JavaScript for native fallback checks. Preference/lifecycle fixtures simulated the app's browser signals without changing the owner's settings. Context loss used Chrome's actual WebGL extension. Background/page-cache edge cases and deterministic pause/reverse behavior additionally have controller and geometry regression coverage.

## Performance evidence

Local built-site observations on the test computer, without network or CPU throttling:

| View | FCP / LCP | CLS | Observed long tasks | Animation callback CPU p95 |
| --- | --- | --- | --- | --- |
| Home, desktop, initial local review | 124 / 124 ms | 0 | 2, totaling 365 ms | 1.5–1.6 ms |
| Home, 320-pixel phone viewport | 96 / 96 ms | 0 | 1, totaling 221 ms | 0.9 ms |
| Services, final phone layout | 68 / 68 ms | 0 | 0 | 0.5 ms |
| Home, simulated reduced motion | 84 / 84 ms | 0 | 0 | No animation callbacks |

These are individual local observations, with browser caches involved, not PageSpeed scores or real-user field measurements. Callback CPU time is not GPU frame time or an FPS measurement. PageSpeed Insights returned quota errors, so no score is reported. No conversion improvement is claimed without traffic measurements.

## Release checks

- Coolify-mode build: 17 content pages plus the 404 page.
- Automated suite: 53 tests covering form behavior, exact route/anchor/asset coverage, plan commitments, metadata, server handling, distinct reversible models, motion preferences, cleanup, and camera framing.
- Astro check after the final application changes: 110 files, zero errors, warnings, or hints.
- Deployment target remains the authorized preview/3d-launch branch and Coolify application hometown-boost-3d-preview (bklwhohxof5n40qep7h8n26a).
- Release requirements: verify the deployment SHA and health, check all public routes and built asset hashes, and visually spot-check the public build before reporting completion. The final release response links to that verified deployment.

The separate main branch and custom-domain application are outside this release. Physical phone hardware, other browser engines, real inbox delivery, and real-traffic conversion performance have not been claimed as tested.
