import { readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildHtmlDocument, escapeHtml, extractTitle, markdownToHtml, stripMarkdown } from './lib/content-utils.mjs';
import { copyDirectory, ensureDir, exists, toPosixPath, walkFiles } from './lib/fs-utils.mjs';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const contentDir = path.join(projectRoot, 'content');
const dataDir = path.join(projectRoot, 'data');
const assetsDir = path.join(projectRoot, 'assets');
const outputDir = path.join(projectRoot, 'build');

function relativeToRoot(filePath) {
  return toPosixPath(path.relative(projectRoot, filePath));
}

function outputHtmlPathForMarkdown(markdownPath) {
  const relativePath = path.relative(contentDir, markdownPath).replace(/\.md$/i, '.html');
  return path.join(outputDir, relativePath);
}

function outputHtmlPathForJson(jsonPath) {
  const relativePath = path.relative(dataDir, jsonPath).replace(/\.json$/i, '.html');
  return path.join(outputDir, 'data', relativePath);
}

function navList(title, items) {
  if (!items.length) {
    return `<section><h2>${escapeHtml(title)}</h2><p>None found.</p></section>`;
  }

  return `<section><h2>${escapeHtml(title)}</h2><ul>${items
    .map((item) => `<li><a href="${item.href}">${escapeHtml(item.label)}</a></li>`)
    .join('')}</ul></section>`;
}

async function buildMarkdownPages(markdownFiles) {
  const pages = [];

  for (const filePath of markdownFiles) {
    const markdown = await readFile(filePath, 'utf8');
    const title = extractTitle(markdown, path.basename(filePath, '.md'));
    const destination = outputHtmlPathForMarkdown(filePath);
    const destinationRelative = relativeToRoot(destination);
    pages.push({
      title,
      sourcePath: filePath,
      sourceRelative: relativeToRoot(filePath),
      outputPath: destination,
      outputRelative: destinationRelative,
      section: path.dirname(path.relative(contentDir, filePath)) || 'content',
      text: stripMarkdown(markdown),
      htmlBody: markdownToHtml(markdown),
    });
  }

  const navigationHtml = [
    '<h1>HFT Interview Prep</h1>',
    '<p><a href="/index.html">Generated home</a></p>',
    navList(
      'Content',
      pages.map((page) => ({ href: `/${page.outputRelative}`, label: page.title })),
    ),
  ].join('');

  for (const page of pages) {
    await ensureDir(path.dirname(page.outputPath));
    const document = buildHtmlDocument({
      title: page.title,
      description: page.text.slice(0, 160),
      navigationHtml,
      bodyHtml: `<p><a href="/index.html">Home</a></p>${page.htmlBody}`,
    });
    await writeFile(page.outputPath, document, 'utf8');
  }

  return pages;
}

async function buildJsonPages(jsonFiles) {
  const pages = [];

  for (const filePath of jsonFiles) {
    const raw = await readFile(filePath, 'utf8');
    const data = JSON.parse(raw);
    const pretty = JSON.stringify(data, null, 2);
    const destination = outputHtmlPathForJson(filePath);
    const title = path.basename(filePath, '.json');
    pages.push({
      title,
      sourcePath: filePath,
      sourceRelative: relativeToRoot(filePath),
      outputPath: destination,
      outputRelative: relativeToRoot(destination),
      text: pretty,
      section: 'data',
      bodyHtml: `<h1>${escapeHtml(title)}</h1><pre><code>${escapeHtml(pretty)}</code></pre>`,
    });
  }

  const navigationHtml = [
    '<h1>HFT Interview Prep</h1>',
    '<p><a href="/index.html">Generated home</a></p>',
    navList(
      'Data',
      pages.map((page) => ({ href: `/${page.outputRelative}`, label: page.title })),
    ),
  ].join('');

  for (const page of pages) {
    await ensureDir(path.dirname(page.outputPath));
    const document = buildHtmlDocument({
      title: page.title,
      description: `JSON dataset: ${page.title}`,
      navigationHtml,
      bodyHtml: page.bodyHtml,
    });
    await writeFile(page.outputPath, document, 'utf8');
  }

  return pages;
}

async function main() {
  console.log('Building static site...');

  await rm(outputDir, { recursive: true, force: true });
  await ensureDir(outputDir);

  const markdownFiles = await walkFiles(contentDir, (filePath) => filePath.endsWith('.md'));
  const jsonFiles = await walkFiles(dataDir, (filePath) => filePath.endsWith('.json'));

  const markdownPages = await buildMarkdownPages(markdownFiles);
  const jsonPages = await buildJsonPages(jsonFiles);
  const allPages = [...markdownPages, ...jsonPages];

  const copiedAssets = await copyDirectory(assetsDir, path.join(outputDir, 'assets'));

  const searchIndex = allPages.map((page) => ({
    title: page.title,
    url: `/${page.outputRelative}`,
    section: page.section,
    source: page.sourceRelative,
    excerpt: page.text.slice(0, 240),
    content: page.text,
  }));

  await writeFile(path.join(outputDir, 'search-index.json'), JSON.stringify(searchIndex, null, 2), 'utf8');

  const sitemap = {
    generatedAt: new Date().toISOString(),
    pages: allPages.map((page) => ({
      title: page.title,
      source: page.sourceRelative,
      url: `/${page.outputRelative}`,
    })),
  };
  await writeFile(path.join(outputDir, 'sitemap.json'), JSON.stringify(sitemap, null, 2), 'utf8');

  const homeBody = `
    <h1>HFT Interview Prep</h1>
    <p>Research date: 2026-07-24</p>
    <h2>Content pages</h2>
    <ul>${markdownPages
      .map((page) => `<li><a href="/${page.outputRelative}">${escapeHtml(page.title)}</a></li>`)
      .join('') || '<li>No markdown content found.</li>'}</ul>
    <h2>Data pages</h2>
    <ul>${jsonPages
      .map((page) => `<li><a href="/${page.outputRelative}">${escapeHtml(page.title)}</a></li>`)
      .join('') || '<li>No JSON data found.</li>'}</ul>
  `;

  const homeNavigation = [
    '<h1>Navigation</h1>',
    navList(
      'Content',
      markdownPages.map((page) => ({ href: `/${page.outputRelative}`, label: page.title })),
    ),
    navList(
      'Data',
      jsonPages.map((page) => ({ href: `/${page.outputRelative}`, label: page.title })),
    ),
  ].join('');

  await writeFile(
    path.join(outputDir, 'index.html'),
    buildHtmlDocument({
      title: 'HFT Interview Prep',
      description: 'Generated static site for HFT interview preparation content.',
      navigationHtml: homeNavigation,
      bodyHtml: homeBody,
    }),
    'utf8',
  );

  console.log(`Markdown pages: ${markdownPages.length}`);
  console.log(`JSON pages: ${jsonPages.length}`);
  console.log(`Search records: ${searchIndex.length}`);
  console.log(`Assets copied: ${copiedAssets ? 'yes' : 'no'}`);
  console.log(`Output directory: ${outputDir}`);
}

main().catch((error) => {
  console.error('Build failed.');
  console.error(error);
  process.exit(1);
});
