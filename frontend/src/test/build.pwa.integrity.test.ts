import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import fs from 'fs';
import path from 'path';
import * as acorn from 'acorn';
import zlib from 'zlib';
import http from 'http';

const DIST_DIR = path.resolve(__dirname, '../../dist');

describe('Empirical Verification: PWA Manifest & Standards', () => {
  it('verifies dist/manifest.webmanifest exists and is valid JSON', () => {
    const manifestPath = path.join(DIST_DIR, 'manifest.webmanifest');
    expect(fs.existsSync(manifestPath), 'manifest.webmanifest must exist in dist/').toBe(true);

    const raw = fs.readFileSync(manifestPath, 'utf8');
    let manifest: Record<string, unknown>;
    expect(() => {
      manifest = JSON.parse(raw);
    }, 'manifest.webmanifest must be strictly valid JSON').not.toThrow();

    expect(manifest!.name).toBe('TNPSC தோழன் - ExamBuddy');
    expect(manifest!.short_name).toBe('TNPSC தோழன்');
    expect(manifest!.start_url).toBe('/');
    expect(manifest!.display).toBe('standalone');
    expect(manifest!.background_color).toBe('#051424');
    expect(manifest!.theme_color).toBe('#051424');
    expect(manifest!.orientation).toBe('portrait');
    expect(manifest!.lang).toBe('ta');
    expect(Array.isArray(manifest!.icons)).toBe(true);
    expect((manifest!.icons as unknown[]).length).toBeGreaterThanOrEqual(2);
  });

  it('empirically inspects all manifest icons on disk (PNG magic bytes, dimensions, sizes)', () => {
    const manifestPath = path.join(DIST_DIR, 'manifest.webmanifest');
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

    interface ManifestIcon {
      src: string;
      sizes: string;
      type: string;
      purpose?: string;
    }

    const icons: ManifestIcon[] = manifest.icons;

    icons.forEach((icon) => {
      const cleanSrc = icon.src.replace(/^\//, '');
      const iconPath = path.join(DIST_DIR, cleanSrc);
      expect(fs.existsSync(iconPath), `Icon file ${icon.src} must exist at ${iconPath}`).toBe(true);

      const buf = fs.readFileSync(iconPath);
      expect(buf.length, `Icon ${icon.src} must not be empty`).toBeGreaterThan(100);

      // Verify PNG magic bytes: 0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A
      expect(buf[0]).toBe(0x89);
      expect(buf[1]).toBe(0x50); // P
      expect(buf[2]).toBe(0x4e); // N
      expect(buf[3]).toBe(0x47); // G
      expect(buf[4]).toBe(0x0d);
      expect(buf[5]).toBe(0x0a);
      expect(buf[6]).toBe(0x1a);
      expect(buf[7]).toBe(0x0a);

      // Read dimensions from PNG IHDR chunk (offset 16 for width, offset 20 for height)
      const width = buf.readUInt32BE(16);
      const height = buf.readUInt32BE(20);

      const [expectedW, expectedH] = icon.sizes.split('x').map(Number);
      expect(width, `Icon width for ${icon.src}`).toBe(expectedW);
      expect(height, `Icon height for ${icon.src}`).toBe(expectedH);

      expect(icon.type).toBe('image/png');
      expect(icon.purpose).toContain('maskable');
    });
  });

  it('verifies favicon.svg exists and is valid SVG markup', () => {
    const faviconPath = path.join(DIST_DIR, 'favicon.svg');
    expect(fs.existsSync(faviconPath)).toBe(true);

    const content = fs.readFileSync(faviconPath, 'utf8');
    expect(content).toContain('<svg');
    expect(content).toContain('</svg>');
    expect(content).toContain('viewBox');
  });
});

describe('Empirical Verification: Service Worker (sw.js)', () => {
  const swPath = path.join(DIST_DIR, 'sw.js');

  it('verifies sw.js exists and compiles cleanly without syntax errors', () => {
    expect(fs.existsSync(swPath), 'sw.js must exist in dist/').toBe(true);

    const swCode = fs.readFileSync(swPath, 'utf8');
    expect(swCode.length).toBeGreaterThan(50);

    // Validate JavaScript syntax using acorn
    expect(() => {
      acorn.parse(swCode, { ecmaVersion: 'latest', sourceType: 'script' });
    }, 'sw.js must have valid JavaScript syntax').not.toThrow();
  });

  it('verifies all static cache assets in sw.js physically exist on disk', () => {
    const swCode = fs.readFileSync(swPath, 'utf8');

    // Extract STATIC_ASSETS array
    const match = swCode.match(/const\s+STATIC_ASSETS\s*=\s*(\[[^\]]+\])/);
    expect(match, 'sw.js must declare a STATIC_ASSETS array').not.toBeNull();
    const matchGroup = match?.[1] ?? '[]';

    const assets: string[] = JSON.parse(matchGroup.replace(/'/g, '"'));
    expect(assets.length).toBeGreaterThan(0);

    assets.forEach((assetPath) => {
      if (assetPath === '/') return; // Root URL
      const cleanPath = assetPath.replace(/^\//, '');
      const filePath = path.join(DIST_DIR, cleanPath);
      expect(fs.existsSync(filePath), `Cached asset ${assetPath} must exist at ${filePath}`).toBe(true);
      expect(fs.statSync(filePath).size).toBeGreaterThan(0);
    });
  });

  it('verifies sw.js implements install, activate, and fetch lifecycle events', () => {
    const swCode = fs.readFileSync(swPath, 'utf8');
    expect(swCode).toContain("addEventListener('install'");
    expect(swCode).toContain("addEventListener('activate'");
    expect(swCode).toContain("addEventListener('fetch'");
    expect(swCode).toContain('skipWaiting()');
    expect(swCode).toContain('clients.claim()');
  });
});

describe('Empirical Verification: index.html & Header Metadata', () => {
  const htmlPath = path.join(DIST_DIR, 'index.html');

  it('verifies index.html has complete mobile-first PWA meta tags', () => {
    expect(fs.existsSync(htmlPath)).toBe(true);
    const html = fs.readFileSync(htmlPath, 'utf8');

    // Mobile viewport with viewport-fit=cover
    expect(html).toContain('viewport-fit=cover');
    expect(html).toContain('width=device-width');

    // Theme color
    expect(html).toContain('<meta name="theme-color" content="#051424"');

    // iOS Web App Tags
    expect(html).toContain('apple-mobile-web-app-capable');
    expect(html).toContain('apple-mobile-web-app-status-bar-style');
    expect(html).toContain('apple-touch-icon');

    // Web manifest link
    expect(html).toContain('<link rel="manifest" href="/manifest.webmanifest"');

    // Google Fonts preconnect & links
    expect(html).toContain('https://fonts.googleapis.com');
    expect(html).toContain('https://fonts.gstatic.com');
    expect(html).toContain('Plus+Jakarta+Sans');
    expect(html).toContain('Be+Vietnam+Pro');
    expect(html).toContain('Noto+Sans+Tamil');
    expect(html).toContain('Material+Symbols+Outlined');

    // Service worker inline registration script
    expect(html).toContain('serviceWorker.register');
  });

  it('verifies all script and link tags in index.html resolve to existing dist assets', () => {
    const html = fs.readFileSync(htmlPath, 'utf8');

    // Find all src="..." and href="..."
    const srcMatches = Array.from(html.matchAll(/src="([^"]+)"/g))
      .map((m) => m[1])
      .filter((s): s is string => typeof s === 'string');
    const hrefMatches = Array.from(html.matchAll(/href="([^"]+)"/g))
      .map((m) => m[1])
      .filter((s): s is string => typeof s === 'string');

    const localRefs = [...srcMatches, ...hrefMatches].filter(
      (ref) => !ref.startsWith('http://') && !ref.startsWith('https://') && !ref.startsWith('data:')
    );

    expect(localRefs.length).toBeGreaterThan(0);

    localRefs.forEach((ref) => {
      const cleanRef = ref.replace(/^\//, '');
      const assetPath = path.join(DIST_DIR, cleanRef);
      expect(fs.existsSync(assetPath), `Asset ${ref} referenced in index.html must exist at ${assetPath}`).toBe(true);
      expect(fs.statSync(assetPath).size).toBeGreaterThan(0);
    });
  });
});

describe('Empirical Verification: Bundle Integrity & Size Budgets', () => {
  const assetsDir = path.join(DIST_DIR, 'assets');

  it('verifies all JavaScript chunks parse cleanly as ES Modules with Acorn', () => {
    const files = fs.readdirSync(assetsDir);
    const jsFiles = files.filter((f) => f.endsWith('.js'));
    expect(jsFiles.length).toBeGreaterThanOrEqual(2); // At least vendor and index

    jsFiles.forEach((jsFile) => {
      const fullPath = path.join(assetsDir, jsFile);
      const code = fs.readFileSync(fullPath, 'utf8');
      expect(code.length, `Chunk ${jsFile} must not be empty`).toBeGreaterThan(0);

      // Verify it parses as an ES Module
      expect(() => {
        acorn.parse(code, { ecmaVersion: 'latest', sourceType: 'module' });
      }, `Chunk ${jsFile} must be syntactically valid ES Module JavaScript`).not.toThrow();
    });
  });

  it('analyzes chunk allocation and flags orphan chunks', () => {
    const files = fs.readdirSync(assetsDir);
    const iconsChunk = files.find((f) => f.startsWith('icons-') && f.endsWith('.js'));
    expect(iconsChunk).toBeDefined();

    // Verify icons chunk is generated by manualChunks even if empty (30 bytes stub)
    const code = fs.readFileSync(path.join(assetsDir, iconsChunk!), 'utf8');
    expect(code).toContain('vendor-');
    expect(code.length).toBeLessThan(100); // Documents stub chunk finding
  });

  it('enforces PWA bundle size budgets (raw and gzip)', () => {
    const files = fs.readdirSync(assetsDir);

    let totalJsRawBytes = 0;
    let totalJsGzipBytes = 0;
    let totalCssRawBytes = 0;
    let totalCssGzipBytes = 0;

    files.forEach((file) => {
      const filePath = path.join(assetsDir, file);
      const content = fs.readFileSync(filePath);
      const gzipContent = zlib.gzipSync(content);

      if (file.endsWith('.js')) {
        totalJsRawBytes += content.length;
        totalJsGzipBytes += gzipContent.length;
      } else if (file.endsWith('.css')) {
        totalCssRawBytes += content.length;
        totalCssGzipBytes += gzipContent.length;
      }
    });

    // Total JS gzip budget: < 200 KB (target was < 150 KB, actual is ~55 KB)
    expect(totalJsGzipBytes).toBeLessThan(200 * 1024);

    // Total CSS gzip budget: < 50 KB (actual is ~3.7 KB)
    expect(totalCssGzipBytes).toBeLessThan(50 * 1024);

    // Total initial load (JS + CSS) gzip budget: < 250 KB
    expect(totalJsGzipBytes + totalCssGzipBytes).toBeLessThan(250 * 1024);
  });

  it('verifies stylesheet contains design system tokens and glassmorphism rules', () => {
    const files = fs.readdirSync(assetsDir);
    const cssFile = files.find((f) => f.endsWith('.css'));
    expect(cssFile, 'Built CSS file must exist in assets/').toBeDefined();

    const cssContent = fs.readFileSync(path.join(assetsDir, cssFile!), 'utf8');

    // Verify key color hexes or variables exist in CSS
    expect(cssContent).toContain('#051424'); // OLED Navy surface
    expect(cssContent).toContain('backdrop-filter'); // Glassmorphism backdrop-blur
    expect(cssContent).toContain('env(safe-area-inset'); // Safe area padding

    // Check for undefined CSS variable references
    expect(cssContent).not.toContain('var(--undefined)');
    expect(cssContent).not.toContain('var(--tw-empty)');
  });
});

describe('Empirical Verification: Static HTTP Serving & MIME Conformance', () => {
  let server: http.Server;
  let baseUrl: string;

  const mimeMap: Record<string, string> = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json',
    '.webmanifest': 'application/manifest+json',
    '.png': 'image/png',
    '.svg': 'image/svg+xml',
  };

  beforeAll(async () => {
    await new Promise<void>((resolve) => {
      server = http.createServer((req, res) => {
        const urlStr = req.url ?? '/';
        let reqPath = urlStr.split('?')[0] ?? '/';
        if (reqPath === '/') reqPath = '/index.html';
        const filePath = path.join(DIST_DIR, reqPath.replace(/^\//, ''));

        if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
          const ext = path.extname(filePath);
          res.writeHead(200, { 'Content-Type': mimeMap[ext] || 'application/octet-stream' });
          fs.createReadStream(filePath).pipe(res);
        } else {
          res.writeHead(404);
          res.end('Not Found');
        }
      });
      server.listen(0, () => {
        const address = server.address();
        const port = typeof address === 'object' && address ? address.port : 0;
        baseUrl = `http://localhost:${port}`;
        resolve();
      });
    });
  });

  afterAll(async () => {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  });

  it('serves manifest.webmanifest with 200 OK and valid JSON', async () => {
    const res = await fetch(`${baseUrl}/manifest.webmanifest`);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.name).toBe('TNPSC தோழன் - ExamBuddy');
    expect(json.theme_color).toBe('#051424');
  });

  it('serves sw.js with 200 OK and text/javascript header', async () => {
    const res = await fetch(`${baseUrl}/sw.js`);
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toContain('text/javascript');
    const text = await res.text();
    expect(text).toContain('CACHE_NAME');
  });

  it('serves icon-192.png and icon-512.png with image/png header', async () => {
    const res192 = await fetch(`${baseUrl}/icons/icon-192.png`);
    expect(res192.status).toBe(200);
    expect(res192.headers.get('content-type')).toBe('image/png');
    const buf192 = await res192.arrayBuffer();
    expect(buf192.byteLength).toBe(3142);

    const res512 = await fetch(`${baseUrl}/icons/icon-512.png`);
    expect(res512.status).toBe(200);
    expect(res512.headers.get('content-type')).toBe('image/png');
    const buf512 = await res512.arrayBuffer();
    expect(buf512.byteLength).toBe(9452);
  });

  it('serves index.html with 200 OK and text/html header', async () => {
    const res = await fetch(`${baseUrl}/index.html`);
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toContain('text/html');
  });

  it('serves all dist/assets/ scripts and stylesheets with 200 OK', async () => {
    const htmlRes = await fetch(`${baseUrl}/index.html`);
    const html = await htmlRes.text();

    const assetMatches = Array.from(html.matchAll(/(?:src|href)="(\/assets\/[^"]+)"/g))
      .map((m) => m[1])
      .filter((s): s is string => typeof s === 'string');
    expect(assetMatches.length).toBeGreaterThan(0);

    for (const asset of assetMatches) {
      const res = await fetch(`${baseUrl}${asset}`);
      expect(res.status, `Asset ${asset} must return 200 OK`).toBe(200);
    }
  });
});
