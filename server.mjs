import { createReadStream, existsSync } from "node:fs";
import { stat } from "node:fs/promises";
import { extname, join, resolve, relative, isAbsolute, sep } from "node:path";
import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import { createGzip } from "node:zlib";
import { pipeline } from "node:stream/promises";

const defaultRoot = fileURLToPath(new URL("./dist/", import.meta.url));
const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".gif": "image/gif",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp",
  ".xml": "application/xml; charset=utf-8",
  ".woff2": "font/woff2",
};
const limits = {
  name: 120,
  businessName: 160,
  email: 254,
  serviceArea: 200,
  phone: 40,
  websiteUrl: 500,
  industry: 150,
  message: 5000,
  planInterest: 100,
  googleAdsInterest: 30,
  landing_page: 1000,
  source_url: 1000,
  referrer: 1000,
  utm_source: 200,
  utm_medium: 200,
  utm_campaign: 200,
  utm_content: 200,
  utm_term: 200,
};
const send = (res, status, body, headers = {}) => {
  res.writeHead(status, {
    "Cache-Control": "no-store",
    "Content-Type": "text/plain; charset=utf-8",
    ...headers,
  });
  res.end(body);
};
const json = (res, status, data) =>
  send(res, status, JSON.stringify(data), {
    "Content-Type": "application/json; charset=utf-8",
  });
const wantsJson = (req) =>
  String(req.headers.accept || "").toLowerCase().includes("application/json");
const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
})[character]);

function contactError(req, res, status, message) {
  if (wantsJson(req)) {
    json(res, status, { ok: false, error: message });
    return;
  }
  const explanation = status === 503
    ? "The contact form is temporarily unavailable. Please email us so we can help."
    : status === 415
      ? "Please return to the contact form and try again."
      : status === 413
        ? "Your inquiry is too long. Please shorten it and try again."
        : message === "Invalid inquiry."
          ? "Please return to the contact form and check your details."
          : message;
  send(res, status, `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex,nofollow"><meta name="theme-color" content="#10253f">
<title>Let’s Try Again | Hometown Boost</title>
<style>
*{box-sizing:border-box}body{margin:0;background:#edf6fd;color:#10253f;font:1rem/1.65 system-ui,sans-serif}
header,main{width:min(100% - 40px,680px);margin-inline:auto}header{padding:32px 0}header a{font-weight:800;font-size:1.15rem;text-decoration:none}
main{margin-bottom:48px;padding:clamp(24px,6vw,48px);background:#fff;border:1px solid #d6e4ee;border-radius:24px;box-shadow:0 20px 60px #10253f0a}
h1{font-size:clamp(2rem,6vw,2.8rem);line-height:1.12;letter-spacing:-.035em;margin:0 0 24px}p{margin:0 0 20px;overflow-wrap:anywhere}
a{color:#174b76;text-underline-offset:4px}.actions{display:flex;flex-wrap:wrap;gap:12px;margin-top:28px}.actions a{display:inline-flex;align-items:center;min-height:48px;padding:12px 18px;border-radius:10px;font-weight:700;text-decoration:none;border:1px solid #bccfdf}.actions a:first-child{background:#10253f;color:#fff;border-color:#10253f}
a:focus-visible{outline:3px solid #d95b0b;outline-offset:4px}.label{font-size:.75rem;font-weight:800;letter-spacing:.13em;color:#a34210}
</style></head><body><header><a href="/">Hometown Boost</a></header><main>
<p class="label">LET’S GET YOU CONNECTED</p><h1>We couldn’t confirm your request.</h1>
<p>${escapeHtml(explanation)}</p><p>Use your browser’s Back button to review your details, or open the contact form to start again.</p>
<div class="actions"><a href="/contact/">Return to contact form</a><a href="mailto:hello@hometownboost.com">Email Hometown Boost</a></div>
</main></body></html>`, {
    "Content-Type": "text/html; charset=utf-8",
    "X-Robots-Tag": "noindex, nofollow",
  });
}

function serviceEndpoint(value) {
  if (!value) return null;
  try {
    const url = new URL(value);
    // The destination is server configuration, never a field supplied by a visitor.
    if (
      url.protocol !== "https:" ||
      !url.hostname.endsWith(".netlify.app") ||
      url.username ||
      url.password
    )
      return null;
    return url;
  } catch {
    return null;
  }
}
function filePathFor(root, pathname) {
  const decoded = decodeURIComponent(pathname);
  if (decoded.includes("\\") || decoded.includes("\0")) return null;
  const path = resolve(root, "." + decoded);
  const within = relative(root, path);
  if (within === ".." || within.startsWith(".." + sep) || isAbsolute(within))
    return null;
  if (decoded.endsWith("/")) return join(path, "index.html");
  if (extname(path)) return path;
  const directoryIndex = join(path, "index.html");
  return existsSync(directoryIndex) ? directoryIndex : path + ".html";
}
async function readForm(req) {
  let size = 0;
  const parts = [];
  for await (const part of req) {
    size += part.length;
    if (size > 32768) throw new Error("too-large");
    parts.push(part);
  }
  return new URLSearchParams(Buffer.concat(parts).toString("utf8"));
}

/** Portable static hosting and a same-origin bridge to the existing form inbox. */
export function createAppServer({
  root = defaultRoot,
  formServiceUrl = process.env.FORM_SERVICE_URL || "",
  indexing = process.env.SITE_INDEXING !== "off",
  fetchImpl = fetch,
} = {}) {
  const endpoint = serviceEndpoint(formServiceUrl);
  return createServer(async (req, res) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    if (!indexing) res.setHeader("X-Robots-Tag", "noindex, nofollow");
    let url;
    try {
      url = new URL(req.url || "/", "http://localhost");
    } catch {
      send(res, 400, "Invalid request.");
      return;
    }

    if (
      url.pathname === "/healthz" &&
      (req.method === "GET" || req.method === "HEAD")
    ) {
      send(res, 200, req.method === "HEAD" ? "" : "ok");
      return;
    }
    if (url.pathname === "/api/contact" && req.method === "GET") {
      json(res, endpoint ? 200 : 503, { available: !!endpoint });
      return;
    }
    if (url.pathname === "/api/contact" && req.method === "POST") {
      if (!endpoint) {
        req.resume();
        contactError(req, res, 503, "The form service is not configured.");
        return;
      }
      if (
        !String(req.headers["content-type"])
          .toLowerCase()
          .startsWith("application/x-www-form-urlencoded")
      ) {
        req.resume();
        contactError(req, res, 415, "Unsupported form format.");
        return;
      }
      if (Number(req.headers["content-length"] || 0) > 32768) {
        req.resume();
        contactError(req, res, 413, "The inquiry is too large.");
        return;
      }
      if (req.headers.origin) {
        try {
          if (new URL(req.headers.origin).host !== req.headers.host)
            throw new Error("origin");
        } catch {
          req.resume();
          contactError(req, res, 403, "Submit this form from the website.");
          return;
        }
      }
      try {
        const input = await readForm(req);
        if (input.get("form-name") !== "contact" || input.get("bot-field")) {
          contactError(req, res, 400, "Invalid inquiry.");
          return;
        }
        const payload = new URLSearchParams({
          "form-name": "contact",
          "bot-field": "",
        });
        for (const [field, max] of Object.entries(limits)) {
          const value = (input.get(field) || "").trim();
          if (value.length > max) {
            contactError(req, res, 400, "Please shorten the " + field + " field.");
            return;
          }
          payload.set(field, value);
        }
        if (
          ["name", "businessName", "email", "serviceArea"].some(
            (field) => !payload.get(field),
          ) ||
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.get("email"))
        ) {
          contactError(req, res, 400, "Enter your name, business, valid email, and service area.");
          return;
        }
        const result = await fetchImpl(endpoint.href, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: payload.toString(),
          signal: AbortSignal.timeout(15000),
          redirect: "follow",
        });
        if (!result.ok) {
          contactError(req, res, 502, "Your inquiry could not be confirmed. Please try again.");
          return;
        }
        // Release the upstream response without storing inquiry details or logging them.
        await result.body?.cancel();
        if (wantsJson(req))
          json(res, 200, { ok: true });
        else send(res, 303, "", { Location: "/thank-you/" });
      } catch (error) {
        if (!res.headersSent && !res.destroyed)
          contactError(req, res, error.message === "too-large" ? 413 : 502,
            "Your inquiry could not be confirmed. Please try again or email hello@hometownboost.com.");
      }
      return;
    }
    if (req.method !== "GET" && req.method !== "HEAD") {
      req.resume();
      send(res, 405, "Method not allowed.", { Allow: "GET, HEAD" });
      return;
    }
    if (url.pathname === "/robots.txt" && !indexing) {
      send(
        res,
        200,
        req.method === "HEAD" ? "" : "User-agent: *\nDisallow: /\n",
      );
      return;
    }
    let path;
    try {
      path = filePathFor(root, url.pathname);
    } catch {
      send(res, 400, "Invalid path.");
      return;
    }
    if (!path) {
      send(res, 404, "Not found.");
      return;
    }
    let file;
    let status = path === resolve(root, "404.html") ? 404 : 200;
    try {
      file = await stat(path);
      if (!file.isFile()) throw new Error("Not a file");
    } catch {
      // Recover human-facing page URLs without disguising missing scripts or images.
      if (!["", ".html"].includes(extname(url.pathname).toLowerCase())) {
        send(res, 404, req.method === "HEAD" ? "" : "Not found.");
        return;
      }
      path = join(root, "404.html");
      status = 404;
      try {
        file = await stat(path);
        if (!file.isFile()) throw new Error("Not a file");
      } catch {
        send(res, 404, req.method === "HEAD" ? "" : "Not found.");
        return;
      }
    }
    try {
      const extension = extname(path);
      const compressible = [
        ".html",
        ".css",
        ".js",
        ".json",
        ".svg",
        ".txt",
        ".xml",
      ].includes(extension);
      const compressed =
        compressible &&
        file.size > 1024 &&
        /\bgzip\b/.test(req.headers["accept-encoding"] || "");
      const headers = {
        "Content-Type": mimeTypes[extension] || "application/octet-stream",
        "Cache-Control": status === 404
          ? "no-store"
          : url.pathname.startsWith("/_astro/")
          ? "public, max-age=31536000, immutable"
          : extension === ".html"
            ? "no-cache"
            : "public, max-age=3600",
      };
      if (compressible) headers.Vary = "Accept-Encoding";
      if (compressed) headers["Content-Encoding"] = "gzip";
      else headers["Content-Length"] = String(file.size);
      if (url.pathname === "/__forms.html" || status === 404)
        headers["X-Robots-Tag"] = "noindex, nofollow";
      res.writeHead(status, headers);
      if (req.method === "HEAD") {
        res.end();
        return;
      }
      if (compressed) await pipeline(createReadStream(path), createGzip(), res);
      else await pipeline(createReadStream(path), res);
    } catch {
      if (!res.headersSent) send(res, 404, "Not found.");
      else if (!res.destroyed) res.destroy();
    }
  });
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const port = Number.parseInt(process.env.PORT || "3000", 10);
  const server = createAppServer();
  server.listen(port, "0.0.0.0", () =>
    console.log("Hometown Boost listening on port " + port),
  );
  const shutdown = () => {
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(1), 10000).unref();
  };
  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
}
