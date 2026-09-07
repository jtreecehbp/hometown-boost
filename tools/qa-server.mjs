import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, relative, isAbsolute, extname, join, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createAppServer } from '../server.mjs';

// A local-only browser fixture. It never calls the live form provider.
const root = fileURLToPath(new URL('../dist/', import.meta.url));
const client = await readFile(new URL('./qa-metrics.js', import.meta.url), 'utf8');
let accepted = 0, rejected = 0;
const app = createAppServer({
  root, indexing: false, formServiceUrl: 'https://local-fixture.netlify.app/',
  fetchImpl: async (_url, options) => {
    const input = new URLSearchParams(options.body);
    const fail = input.get('name') === 'QA Failure';
    if (fail) rejected++; else accepted++;
    return new Response(fail ? 'Rejected by local fixture' : 'Accepted by local fixture', { status: fail ? 422 : 200 });
  },
});
const serveApp = app.listeners('request')[0];
const server = createServer(async (req, res) => {
  const url = new URL(req.url || '/', 'http://localhost');
  if (url.pathname === '/__qa/metrics.js') {
    res.writeHead(200, {'Content-Type':'text/javascript; charset=utf-8','Cache-Control':'no-store'});
    res.end(client); return;
  }
  if (url.pathname === '/__qa/status') {
    res.writeHead(200, {'Content-Type':'application/json','Cache-Control':'no-store'});
    res.end(JSON.stringify({ accepted, rejected, realInquiriesSent: 0 })); return;
  }
  if (req.method === 'GET') {
    try {
      const pathname = decodeURIComponent(url.pathname);
      const directory = resolve(root, '.' + pathname);
      const within = relative(root, directory);
      if (!pathname.includes('\\') && !pathname.includes('\0') && within !== '..' && !within.startsWith('..' + sep) && !isAbsolute(within)) {
        const file = extname(directory) ? directory : join(directory, 'index.html');
        if (extname(file) === '.html' && (await stat(file)).isFile()) {
          const html = (await readFile(file, 'utf8')).replace('</head>', '<script src="/__qa/metrics.js"></script></head>');
          res.writeHead(file.endsWith('404.html') ? 404 : 200, {
            'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store','X-Robots-Tag':'noindex, nofollow',
            ...(url.searchParams.get('qa_mode') === 'no-js' ? { 'Content-Security-Policy': "script-src 'none'" } : {}),
          });
          res.end(html); return;
        }
      }
    } catch { /* The app serves its normal error page and non-HTML assets. */ }
  }
  void serveApp(req, res);
});
server.listen(Number(process.env.QA_PORT) || 0, '127.0.0.1', () => console.log('Local browser QA: http://127.0.0.1:' + server.address().port + '/'));
const stop = () => server.close(() => process.exit(0));
process.on('SIGINT', stop); process.on('SIGTERM', stop);
