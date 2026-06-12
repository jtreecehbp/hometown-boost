import { createReadStream, existsSync } from "node:fs";
import { stat } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { createServer } from "node:http";
import { fileURLToPath } from "node:url";

const port = Number.parseInt(process.env.PORT || "3000", 10);
const root = fileURLToPath(new URL("./dist/", import.meta.url));

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".gif": "image/gif",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp",
  ".xml": "application/xml; charset=utf-8",
};

function send(res, statusCode, body, headers = {}) {
  res.writeHead(statusCode, {
    "Cache-Control": "no-store",
    ...headers,
  });
  res.end(body);
}

function getFilePath(pathname) {
  const decoded = decodeURIComponent(pathname);
  const cleaned = normalize(decoded)
    .replace(/^(\.\.([/\\]|$))+/, "")
    .replace(/^[/\\]+/, "");
  const basePath = join(root, cleaned);

  if (decoded.endsWith("/")) return join(basePath, "index.html");
  if (extname(decoded)) return basePath;

  const directoryIndex = join(basePath, "index.html");
  if (existsSync(directoryIndex)) return directoryIndex;

  return `${basePath}.html`;
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);

  if (req.method === "POST" && url.pathname === "/thank-you/") {
    req.resume();
    send(res, 303, "", { Location: "/thank-you/" });
    return;
  }

  if (req.method !== "GET" && req.method !== "HEAD") {
    send(res, 405, "Method not allowed", { Allow: "GET, HEAD, POST" });
    return;
  }

  const filePath = getFilePath(url.pathname);

  try {
    const file = await stat(filePath);
    if (!file.isFile()) throw new Error("Not a file");

    const headers = {
      "Content-Length": String(file.size),
      "Content-Type": mimeTypes[extname(filePath)] || "application/octet-stream",
    };

    if (filePath.includes(`${join("dist", "_astro")}`) || filePath.match(/\.(ico|png|svg|webp)$/)) {
      headers["Cache-Control"] = "public, max-age=31536000, immutable";
    } else if (url.pathname === "/__forms.html") {
      headers["X-Robots-Tag"] = "noindex, follow";
    }

    res.writeHead(200, headers);
    if (req.method === "HEAD") {
      res.end();
      return;
    }

    createReadStream(filePath).pipe(res);
  } catch {
    send(res, 404, "Not found", { "Content-Type": "text/plain; charset=utf-8" });
  }
});

server.listen(port, "0.0.0.0", () => {
  console.log(`Hometown Boost preview server listening on port ${port}`);
});
