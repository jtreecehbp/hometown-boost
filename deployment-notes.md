# Rocket site production release — September 28, 2026

The owner authorized updating the rocket site with Foundation and Connect and promoting it to the live domain on Coolify.

## Environments

| Environment | Domain | Coolify app | Branch | Indexing |
| --- | --- | --- | --- | --- |
| Production | hometownboost.com; www redirects to apex | g13cs3l4ds0nv8cz1hop7ohw | main | SITE_INDEXING=on |
| Preview | hometown-boost-preview.40.160.2.98.sslip.io | bklwhohxof5n40qep7h8n26a | preview/3d-launch | SITE_INDEXING=off |

Both apps use the root Dockerfile, port 3000, and `/healthz`. Build arguments are `PUBLIC_FORM_DELIVERY=server` and `PUBLIC_SITE_URL=https://hometownboost.com`. Runtime `FORM_SERVICE_URL` points to the existing Netlify Forms receiver documented in README. The website is hosted by Coolify; that separate inbox bridge remains in use. No DNS change is required.

## Promotion

Build and test locally, verify the preview deployment, and promote the tested rocket tree to main. The two histories diverged: the production migration merge intentionally keeps the rocket tree while retaining the previous main history as its other parent. Do not force-push main. Configure production for Dockerfile deployment before the main push; inspect and verify the resulting deployment, HTTPS, apex/www redirect, indexing, page and asset responses, old-link redirects, inquiry configuration, and browser rendering.

A real inbox test requires the owner's permission to send the test message; simulated tests are documented separately. No analytics provider is enabled by this release.

## Rollback

Previous production commit: `9318b6821fc9595773611bac736414976cbaf36a`.

Previous production image: `g13cs3l4ds0nv8cz1hop7ohw:9318b6821fc9595773611bac736414976cbaf36a`, image ID `sha256:1d65f21f41629b16abb93b3747f35c27bdf5e1f7f7ef7ab558f8a0834d361362`.

Safe application settings and the three preexisting non-secret environment values are saved locally at `C:/Users/jorda/Documents/Codex/release-backups/hometown-boost-20260928/production-before.json`. The deployed image is also retained with rollback tag `hometown-boost-rollback:pre-rocket-20260928`.

To roll back, restore this app's previous Nixpacks configuration (`npm ci`, `npm run build`, `npm run start`, Node 22), and deploy the previous commit or retained image through Coolify. Keep the same domains and non-www redirect. The rocket-only environment variables can remain unused by the old app. Verify the old homepage, HTTPS, and its original robots configuration. Do not change credentials or other applications.

Production deployment UUIDs, final commit, public checks, and remaining limitations are recorded in the central project task `20260928t122128z-b871fefa` under `hometown-boost-v4--1283167b`.
