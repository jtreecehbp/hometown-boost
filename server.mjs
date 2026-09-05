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
        json(res, 503, {
          ok: false,
          error: "The form service is not configured.",
        });
        return;
      }
      if (
        !String(req.headers["content-type"])
          .toLowerCase()
          .startsWith("application/x-www-form-urlencoded")
      ) {
        req.resume();
        json(res, 415, { ok: false, error: "Unsupported form format." });
        return;
      }
      if (Number(req.headers["content-length"] || 0) > 32768) {
        req.resume();
        json(res, 413, { ok: false, error: "The inquiry is too large." });
        return;
      }
      if (req.headers.origin) {
        try {
          if (new URL(req.headers.origin).host !== req.headers.host)
            throw new Error("origin");
        } catch {
          req.resume();
          json(res, 403, {
            ok: false,
            error: "Submit this form from the website.",
          });
          return;
        }
      }
      try {
        const input = await readForm(req);
        if (input.get("form-name") !== "contact" || input.get("bot-field")) {
          json(res, 400, { ok: false, error: "Invalid inquiry." });
          return;
        }
        const payload = new URLSearchParams({
          "form-name": "contact",
          "bot-field": "",
        });
        for (const [field, max] of Object.entries(limits)) {
          const value = (input.get(field) || "").trim();
          if (value.length > max) {
            json(res, 400, {
              ok: false,
              error: "Please shorten the " + field + " field.",
            });
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
          json(res, 400, {
            ok: false,
            error: "Enter your name, business, valid email, and service area.",
          });
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
          json(res, 502, {
            ok: false,
            error: "Your inquiry could not be confirmed. Please try again.",
          });
          return;
        }
        // Release the upstream response without storing inquiry details or logging them.
        await result.body?.cancel();
        if (String(req.headers.accept || "").includes("application/json"))
          json(res, 200, { ok: true });
        else send(res, 303, "", { Location: "/thank-you/" });
      } catch (error) {
        if (!res.headersSent && !res.destroyed)
          json(res, error.message === "too-large" ? 413 : 502, {
            ok: false,
            error:
              "Your inquiry could not be confirmed. Please try again or email hello@hometownboost.com.",
          });
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
    try {
      const file = await stat(path);
      if (!file.isFile()) throw new Error("Not a file");
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
        "Cache-Control": url.pathname.startsWith("/_astro/")
          ? "public, max-age=31536000, immutable"
          : extension === ".html"
            ? "no-cache"
            : "public, max-age=3600",
      };
      if (compressible) headers.Vary = "Accept-Encoding";
      if (compressed) headers["Content-Encoding"] = "gzip";
      else headers["Content-Length"] = String(file.size);
      if (url.pathname === "/__forms.html")
        headers["X-Robots-Tag"] = "noindex, nofollow";
      res.writeHead(200, headers);
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
