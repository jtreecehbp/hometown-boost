# Hometown Boost Astro Website

Static Astro marketing site for Hometown Boost, a monthly website and local marketing service for hometown businesses.

## Commands

```sh
npm install
npm run dev
npm run build
npm run astro -- check
```

## Notes

- Built with Astro static output, TypeScript, and plain CSS.
- Contact form submissions are configured for Netlify-managed form handling.
- Canonical metadata defaults to `https://hometownboost.com` through `PUBLIC_SITE_URL`.

## Coolify Preview

Use the included `Dockerfile` for a temporary Coolify preview app.

- Build pack: Dockerfile
- Exposed port: `3000`
- Build output is created by `npm run build`

The preview server redirects contact form POSTs to `/thank-you/` so the form flow does not fail on non-Netlify hosting. Lead capture still requires Netlify Forms or a real form backend.
