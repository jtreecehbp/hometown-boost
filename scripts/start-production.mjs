import { readFile, stat } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";
import { Readable } from "node:stream";
import { pathToFileURL } from "node:url";

const args = process.argv.slice(2);

function readArg(name) {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : undefined;
}

const port = Number(readArg("--port") ?? process.env.PORT ?? 3000);
const host = readArg("--hostname") ?? process.env.HOST ?? "0.0.0.0";
const clientRoot = path.resolve("dist/client");
const workerPath = path.resolve("dist/server/index.js");
const { default: worker } = await import(pathToFileURL(workerPath).href);

const contentTypes = new Map([
  [".avif", "image/avif"],
  [".css", "text/css; charset=utf-8"],
  [".gif", "image/gif"],
  [".html", "text/html; charset=utf-8"],
  [".ico", "image/x-icon"],
  [".jpeg", "image/jpeg"],
  [".jpg", "image/jpeg"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".png", "image/png"],
  [".svg", "image/svg+xml; charset=utf-8"],
  [".webp", "image/webp"],
  [".woff", "font/woff"],
  [".woff2", "font/woff2"],
]);

async function staticResponse(request) {
  const url = new URL(request.url);
  if (url.pathname === "/" || url.pathname.startsWith("/.vite/")) return null;

  let pathname;
  try {
    pathname = decodeURIComponent(url.pathname).replaceAll("\\", "/");
  } catch {
    return new Response("Bad request", { status: 400 });
  }

  const filePath = path.resolve(clientRoot, `.${pathname}`);
  if (
    filePath !== clientRoot &&
    !filePath.startsWith(`${clientRoot}${path.sep}`)
  ) {
    return new Response("Not found", { status: 404 });
  }

  let fileStats;
  try {
    fileStats = await stat(filePath);
  } catch {
    return null;
  }

  if (!fileStats.isFile()) return null;

  const extension = path.extname(filePath).toLowerCase();
  const isHashedAsset = pathname.startsWith("/assets/");
  const headers = new Headers({
    "Cache-Control": isHashedAsset
      ? "public, max-age=31536000, immutable"
      : "public, max-age=3600",
    "Content-Length": String(fileStats.size),
    "Content-Type": contentTypes.get(extension) ?? "application/octet-stream",
  });

  if (request.method === "HEAD") {
    return new Response(null, { status: 200, headers });
  }

  return new Response(await readFile(filePath), { status: 200, headers });
}

const assets = {
  async fetch(request) {
    return (await staticResponse(request)) ?? new Response("Not found", { status: 404 });
  },
};

function toRequest(req) {
  const origin = `http://${req.headers.host ?? `${host}:${port}`}`;
  const url = new URL(req.url ?? "/", origin);
  const method = req.method ?? "GET";
  const hasBody = method !== "GET" && method !== "HEAD";
  const init = {
    method,
    headers: req.headers,
  };

  if (hasBody) {
    init.body = Readable.toWeb(req);
    init.duplex = "half";
  }

  return new Request(url, init);
}

function sendResponse(response, res) {
  res.statusCode = response.status;
  if (response.statusText) res.statusMessage = response.statusText;

  response.headers.forEach((value, key) => {
    if (key !== "set-cookie") res.setHeader(key, value);
  });

  const cookies = response.headers.getSetCookie?.() ?? [];
  if (cookies.length) res.setHeader("set-cookie", cookies);

  if (!response.body) {
    res.end();
    return;
  }

  Readable.fromWeb(response.body).pipe(res);
}

const server = createServer(async (req, res) => {
  try {
    const request = toRequest(req);
    const response =
      (await staticResponse(request)) ??
      (await worker.fetch(
        request,
        { ASSETS: assets },
        {
          waitUntil() {},
          passThroughOnException() {},
        },
      ));
    sendResponse(response, res);
  } catch (error) {
    console.error(error);
    if (!res.headersSent) res.writeHead(500);
    res.end("Internal Server Error");
  }
});

server.listen(port, host, () => {
  console.log(`Hometown Boost production site: http://${host}:${port}`);
});
