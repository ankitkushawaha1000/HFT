import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildHtmlDocument, extractTitle, markdownToHtml, slugify } from './lib/content-utils.mjs';
import { ensureDir, exists, toPosixPath, walkFiles } from './lib/fs-utils.mjs';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputDir = path.join(projectRoot, 'generated');
const targets = [
  { label: 'study plan', directory: path.join(projectRoot, 'content', 'study-plans') },
  { label: 'mock interview', directory: path.join(projectRoot, 'content', 'mock-interviews') },
];

async function loadPlaywrightChromium() {
  for (const specifier of ['playwright', 'playwright-core']) {
    try {
      const module = await import(specifier);
      if (module.chromium) {
        return module.chromium;
      }
    } catch {
      // Try next option.
    }
  }
  return null;
}

async function collectSources() {
  const items = [];
  for (const target of targets) {
    if (!(await exists(target.directory))) {
      continue;
    }
    const files = await walkFiles(target.directory, (filePath) => filePath.endsWith('.md'));
    for (const filePath of files) {
      items.push({ ...target, filePath });
    }
  }
  return items;
}

async function writeManifest(manifest) {
  await ensureDir(outputDir);
  await writeFile(path.join(outputDir, 'manifest.json'), JSON.stringify(manifest, null, 2), 'utf8');
}

async function main() {
  console.log('Generating PDFs...');
  await ensureDir(outputDir);

  const sources = await collectSources();
  const chromium = await loadPlaywrightChromium();

  if (!chromium) {
    const manifest = {
      generatedAt: new Date().toISOString(),
      status: 'skipped',
      reason: 'Playwright is not installed. Run `npm install playwright` or add it to the project before generating PDFs.',
      pdfs: [],
      sourceCount: sources.length,
    };
    await writeManifest(manifest);
    console.log(manifest.reason);
    return;
  }

  const browser = await chromium.launch({ headless: true });
  const pdfs = [];

  try {
    for (const source of sources) {
      const markdown = await readFile(source.filePath, 'utf8');
      const title = extractTitle(markdown, path.basename(source.filePath, '.md'));
      const fileName = `${source.label.replace(/\s+/g, '-')}-${slugify(path.basename(source.filePath, '.md'))}.pdf`;
      const outputPath = path.join(outputDir, fileName);
      const page = await browser.newPage();
      const html = buildHtmlDocument({
        title,
        description: `${source.label} PDF export`,
        navigationHtml: `<h1>${title}</h1><p>Exported from ${toPosixPath(path.relative(projectRoot, source.filePath))}</p>`,
        bodyHtml: markdownToHtml(markdown),
      });
      await page.setContent(html, { waitUntil: 'networkidle' });
      await page.pdf({
        path: outputPath,
        format: 'A4',
        margin: { top: '12mm', right: '12mm', bottom: '12mm', left: '12mm' },
        printBackground: true,
      });
      await page.close();
      pdfs.push({
        title,
        type: source.label,
        source: toPosixPath(path.relative(projectRoot, source.filePath)),
        output: toPosixPath(path.relative(projectRoot, outputPath)),
      });
      console.log(`Created ${fileName}`);
    }
  } finally {
    await browser.close();
  }

  const manifest = {
    generatedAt: new Date().toISOString(),
    status: 'completed',
    pdfs,
    sourceCount: sources.length,
  };
  await writeManifest(manifest);
  console.log(`PDF summary: ${pdfs.length}/${sources.length} files generated.`);
}

main().catch((error) => {
  console.error('PDF generation failed.');
  console.error(error);
  process.exit(1);
});
