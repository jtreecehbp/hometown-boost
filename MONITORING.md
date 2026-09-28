# Website measurement and inquiry follow-up

## Current release

The Astro site has a consent-controlled GA4 adapter, adapted from the existing isolated monitoring worktree. The shared `src/monitoring/monitoring.mjs` remains byte-identical to that kit. The old vinext worktree was not merged or changed.

Google collection stays off until a real Hometown Boost measurement ID and its property settings are verified. The September 28 browser session is waiting at Google's optional email-preferences prompt; it has not established a usable Hometown property. No Google Ads account or conversion destination has been linked by this release. Prepared code is not proof of live collection.

Coolify build variables (public identifiers, not secrets):

```text
PUBLIC_WEBSITE_ANALYTICS_ENABLED=false
PUBLIC_GA4_MEASUREMENT_ID=
PUBLIC_GA4_AUTOMATIC_MEASUREMENT_DISABLED=false
```

Before enabling, verify the website stream belongs to `hometownboost.com`, disable Enhanced Measurement and Google signals/user-provided data/advertising personalization for this reviewed collection path, and set the release assertion only after checking the Google settings. Rebuild the application with its actual ID. Preview hosts and private/unknown routes remain excluded even if build variables are present.

The footer's Analytics settings control is available even while measurement is off. When configured on a reviewed production route, equal Allow and Decline controls appear. Permission is property-scoped and expires after 180 days. Withdrawal stores denial, removes this kit's cookies where possible, and reloads to stop Google's loaded code. No form answers are sent to analytics. A random accepted-inquiry receipt is hashed locally for duplicate suppression and never transmitted to Google.

## Events and advertising links

- `page_view`: fixed public page names and clean URLs.
- `primary_cta_click`: fixed plan/request labels; a click is not a lead.
- `phone_click` / `email_click`: actions, not confirmed conversations.
- `generate_lead`: only an accepted response from `/api/contact` with an opaque receipt. At most once per receipt in a browser tab. This is provider acceptance, not proof of a delivered notification or a customer purchase.

Mark `generate_lead` as a GA4 key event after property setup. Import/link it in the intended Google Ads account only after checking the account identity and avoiding a second primary conversion for the same inquiry. No ad budget, campaign, or paid service is started by this website release.

Approved launch campaign links:

- Google Search: `https://hometownboost.com/start/?utm_source=google&utm_medium=cpc&utm_campaign=foundation_launch`
- Paid Facebook: `https://hometownboost.com/start/?utm_source=facebook&utm_medium=paid_social&utm_campaign=foundation_launch`
- GBP: `https://hometownboost.com/?utm_source=google&utm_medium=organic&utm_campaign=gbp_profile`

Only approved campaign constants enter GA4. Existing first-touch inquiry attribution still accompanies the form; Google Ads click IDs are not collected by this adapter. Consent choices, ad blocking, and missing provider access limit coverage. Google profile call clicks and website call clicks must not be added together as unique leads.

## Verified inquiry delivery

Production uses the existing Netlify receiver `hometown-boost-temp-20260605000628` (site `0b30aaae-c498-48ee-b60e-af5932097dbf`, contact form `6a9b81f2420c5b00089669f0`). Keep its published receiver deploy available when moving the main website.

On September 28, the receiver had no notification hook. Added an email notification to the owner's connected business inbox, `jordan@hometownboost.com`, with subject **Hometown Boost - New website inquiry**. Hook `6aba8170ac26886336cc74a8` applies to submission creation on this receiver (which has one contact form).

Exactly one authorized live test, `HB-20260928-01`, was submitted through the public browser form. It reached the confirmation page, was stored as Netlify submission `6aba818ca06e7410027f8c99`, retained its internal/qa/launch_verification tags, and arrived in the owner's Gmail inbox. Exclude this labeled test from business results. Local tests use the mock provider and send no messages.

## Follow-up routine

1. Review new-inquiry notifications in the business inbox. If notifications stop, check the Netlify form inbox as well as the site's availability endpoint; an availability response alone does not prove delivery.
2. Reply with the recommended plan, supported tools, written scope, and agreed launch window. Confirm outside software and ad costs before commitment. No specific response-time promise has been invented.
3. Track each real inquiry privately through **new → contacted → qualified → proposal → won/lost**. Keep source, plan, first reply date, outcome, and (only when confirmed) booked revenue in the business's private customer records. Do not put customer details in this repository or analytics events.
4. Review campaign inquiries and confirmed outcomes together each month. Do not label accepted forms as booked customers. The public sample report is explicitly invented and is not evidence of actual results.

## Checks

`npm run build`, `npm test`, and `npm run astro -- check` cover route/pricing consistency, form acceptance/failure, receipt-based measurement, explicit consent, withdrawal, URL sanitization, and the deferred rocket startup. The tests use a fake window and a test-only ID without contacting Google.

Before saying collection is live, verify browser requests after consent and actual receipt in the correct Google property. Verify no Google script before permission, decline persistence, withdrawal, allowed CTA labels, and no lead event on failed forms or a direct thank-you visit.
