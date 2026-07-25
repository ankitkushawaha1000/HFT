import http from 'node:http';
import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const port = Number.parseInt(process.env.PORT ?? '8000', 10);

const MIME_TYPES = {
  '.css': 'text/css; charset=utf-8',
  '.gif': 'image/gif',
  '.html': 'text/html; charset=utf-8',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
};

function setCorsHeaders(response) {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function resolveRequestPath(requestUrl) {
  const parsed = new URL(requestUrl, `http://127.0.0.1:${port}`);
  const pathname = decodeURIComponent(parsed.pathname);
  const safePath = path.normalize(path.join(projectRoot, pathname));
  if (!safePath.startsWith(projectRoot)) {
    return null;
  }
  return { parsed, pathname, safePath };
}

function renderDirectoryListing(requestPath, entries) {
  const items = entries
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((entry) => {
      const suffix = entry.isDirectory() ? '/' : '';
      const href = path.posix.join(requestPath.endsWith('/') ? requestPath : `${requestPath}/`, `${entry.name}${suffix}`);
      return `<li><a href="${href}">${entry.name}${suffix}</a></li>`;
    })
    .join('');

  const parent = requestPath === '/' ? '' : `<p><a href="${path.posix.dirname(requestPath === '/' ? '/' : requestPath) || '/'}">⬅ Parent</a></p>`;

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Index of ${requestPath}</title>
    <style>
      body { font-family: system-ui, sans-serif; margin: 2rem; }
      a { color: #2563eb; }
    </style>
  </head>
  <body>
    <h1>Index of ${requestPath}</h1>
    ${parent}
    <ul>${items}</ul>
  </body>
</html>`;
}

const server = http.createServer(async (request, response) => {
  setCorsHeaders(response);

  if (request.method === 'OPTIONS') {
    response.writeHead(204);
    response.end();
    return;
  }

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.writeHead(405, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Method Not Allowed');
    return;
  }

  const resolved = resolveRequestPath(request.url ?? '/');
  if (!resolved) {
    response.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Forbidden');
    return;
  }

  try {
    const stats = await stat(resolved.safePath);

    if (stats.isDirectory()) {
      const indexPath = path.join(resolved.safePath, 'index.html');
      try {
        const indexFile = await readFile(indexPath);
        response.writeHead(200, { 'Content-Type': MIME_TYPES['.html'] });
        if (request.method === 'GET') {
          response.end(indexFile);
        } else {
          response.end();
        }
        return;
      } catch {
        const entries = await readdir(resolved.safePath, { withFileTypes: true });
        const html = renderDirectoryListing(resolved.pathname, entries);
        response.writeHead(200, { 'Content-Type': MIME_TYPES['.html'] });
        response.end(request.method === 'GET' ? html : undefined);
        return;
      }
    }

    const ext = path.extname(resolved.safePath).toLowerCase();
    const mimeType = MIME_TYPES[ext] ?? 'application/octet-stream';
    const body = request.method === 'GET' ? await readFile(resolved.safePath) : null;
    response.writeHead(200, { 'Content-Type': mimeType });
    response.end(body ?? undefined);
  } catch {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Not Found');
  }
});

server.listen(port, () => {
  console.log(`Serving ${projectRoot} at http://localhost:${port}`);
});

function shutdown(signal) {
  console.log(`Received ${signal}. Shutting down...`);
  server.close(() => {
    console.log('Server stopped.');
    process.exit(0);
  });
}

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => shutdown(signal));
}
