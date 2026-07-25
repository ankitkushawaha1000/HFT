import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { exists, toPosixPath, walkFiles } from './lib/fs-utils.mjs';
import { runDataValidation } from '../tests/validate-data.mjs';
import { runLinkValidation } from '../tests/validate-links.mjs';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dataDir = path.join(projectRoot, 'data');
const indexPath = path.join(projectRoot, 'index.html');
const companiesDir = path.join(projectRoot, 'companies');
const contentIndexPath = path.join(projectRoot, 'data', 'content-index.json');

function validateHtmlStructure(html) {
  const checks = [
    { label: 'doctype', valid: /<!DOCTYPE html>/i.test(html) },
    { label: 'html tag', valid: /<html[\s>]/i.test(html) && /<\/html>/i.test(html) },
    { label: 'head tag', valid: /<head[\s>]/i.test(html) && /<\/head>/i.test(html) },
    { label: 'body tag', valid: /<body[\s>]/i.test(html) && /<\/body>/i.test(html) },
    { label: 'title tag', valid: /<title>[^<]+<\/title>/i.test(html) },
  ];

  const errors = checks.filter((check) => !check.valid).map((check) => `Missing or invalid ${check.label}.`);
  return { ok: errors.length === 0, errors };
}

function collectHtmlReferences(html) {
  const references = [];
  const pattern = /(?:href|src)="([^"]+)"/g;
  for (const match of html.matchAll(pattern)) {
    const value = match[1];
    if (/^(?:https?:|mailto:|tel:|#|data:)/i.test(value)) {
      continue;
    }
    references.push(value);
  }
  return references;
}

function collectNavRoutes(html) {
  const routes = [];
  const pattern = /<a[^>]*class="[^"]*\bnav-link\b[^"]*"[^>]*data-route="([^"]+)"[^>]*>/g;
  for (const match of html.matchAll(pattern)) {
    routes.push(match[1]);
  }
  return routes;
}

function collectJsonPathReferences(value, sourceRelative, collected = []) {
  if (typeof value === 'string') {
    if (
      /^(?:\.\.?\/|content\/|assets\/|data\/|generated\/)/.test(value)
      || /^examples\/.+\.[a-z0-9]+$/i.test(value)
    ) {
      collected.push({ sourceRelative, value });
    }
    return collected;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      collectJsonPathReferences(item, sourceRelative, collected);
    }
    return collected;
  }

  if (value && typeof value === 'object') {
    for (const item of Object.values(value)) {
      collectJsonPathReferences(item, sourceRelative, collected);
    }
  }

  return collected;
}

function expectedCompanyRouteFor(relativePath) {
  const normalized = toPosixPath(relativePath);
  if (normalized === 'README.md') return 'companies';
  const parts = normalized.split('/');
  if (parts.length === 2 && parts[1] === 'README.md') {
    return `companies/${parts[0]}`;
  }
  if (parts.length >= 3 && parts[1].startsWith('round-')) {
    if (parts[2] === 'questions.md') {
      return `companies/${parts[0]}/${parts[1]}`;
    }
    return `companies/${parts[0]}/${parts[1]}/${parts[2].replace(/\.md$/i, '')}`;
  }
  return null;
}

function parseCompanyReadmeFirms(markdown) {
  const firms = new Set();
  for (const match of markdown.matchAll(/- \[x\] \[[^\]]+\]\(([^)]+)\)/g)) {
    firms.add(match[1].replace(/\/$/, ''));
  }
  return firms;
}

async function validateReferencedFiles() {
  const errors = [];

  if (!(await exists(indexPath))) {
    errors.push('index.html does not exist.');
  } else {
    const html = await readFile(indexPath, 'utf8');
    for (const reference of collectHtmlReferences(html)) {
      const absolutePath = path.resolve(projectRoot, reference);
      if (!(await exists(absolutePath))) {
        errors.push(`index.html references missing file: ${reference}`);
      }
    }
  }

  const jsonFiles = await walkFiles(dataDir, (filePath) => filePath.endsWith('.json'));
  for (const jsonFile of jsonFiles) {
    const sourceRelative = toPosixPath(path.relative(projectRoot, jsonFile));
    const parsed = JSON.parse(await readFile(jsonFile, 'utf8'));
    const references = collectJsonPathReferences(parsed, sourceRelative);
    for (const reference of references) {
      const absolutePath = reference.value.startsWith('./') || reference.value.startsWith('../')
        ? path.resolve(path.dirname(jsonFile), reference.value)
        : path.resolve(projectRoot, reference.value);
      if (!(await exists(absolutePath))) {
        errors.push(`${reference.sourceRelative} references missing file: ${reference.value}`);
      }
    }
  }

  return { ok: errors.length === 0, errors };
}

async function validateRoutesAndCoverage() {
  const errors = [];

  if (!(await exists(contentIndexPath))) {
    return { ok: false, errors: ['data/content-index.json does not exist.'] };
  }

  const contentIndex = JSON.parse(await readFile(contentIndexPath, 'utf8'));
  const contentRouteMap = new Map(contentIndex.map((entry) => [entry.route, entry]));
  const staticRoutes = new Set(['home', 'question-bank', 'mock-interviews']);
  const legacyRoutes = new Set([
    'study-plans', 'behavioral', 'cpp', 'systems', 'low-latency', 'design', 'trading', 'coding',
    'optiver', 'research'
  ]);

  const html = await readFile(indexPath, 'utf8');
  for (const route of collectNavRoutes(html)) {
    if (!staticRoutes.has(route) && !legacyRoutes.has(route) && !contentRouteMap.has(route)) {
      errors.push(`index.html nav route is unresolved: ${route}`);
    }
  }

  if (await exists(companiesDir)) {
    const checklistPath = path.join(companiesDir, 'README.md');
    if (await exists(checklistPath)) {
      const checklistFirms = parseCompanyReadmeFirms(await readFile(checklistPath, 'utf8'));
      const diskFirms = new Set((await readdir(companiesDir, { withFileTypes: true }))
        .filter((entry) => entry.isDirectory())
        .map((entry) => entry.name));

      for (const firm of checklistFirms) {
        if (!diskFirms.has(firm)) {
          errors.push(`companies/README.md references missing firm folder: ${firm}`);
        }
      }
      for (const firm of diskFirms) {
        if (!checklistFirms.has(firm)) {
          errors.push(`companies/${firm} exists but is missing from companies/README.md checklist`);
        }
      }
    } else {
      errors.push('companies/README.md is missing.');
    }

    const companyMarkdownFiles = await walkFiles(companiesDir, (filePath) => filePath.endsWith('.md'));
    for (const filePath of companyMarkdownFiles) {
      const relative = toPosixPath(path.relative(companiesDir, filePath));
      const expectedRoute = expectedCompanyRouteFor(relative);
      if (!expectedRoute) continue;
      const expectedPath = `content/companies/${relative}`;
      const entry = contentRouteMap.get(expectedRoute);
      if (!entry) {
        errors.push(`data/content-index.json missing company route: ${expectedRoute}`);
        continue;
      }
      if (entry.path !== expectedPath) {
        errors.push(`Route ${expectedRoute} must use path ${expectedPath} (found ${entry.path})`);
      }
    }
  }

  const hftExamplesDir = path.join(projectRoot, 'examples', 'hft');
  if (await exists(hftExamplesDir)) {
    const expectedExampleRoutes = new Set(['examples', 'examples/cpp']);
    for (const entry of await readdir(hftExamplesDir, { withFileTypes: true })) {
      if (entry.isDirectory() && /^\d+-/.test(entry.name)) {
        expectedExampleRoutes.add(`examples/hft/${entry.name.replace(/^\d+-/, '')}`);
      }
    }
    for (const route of expectedExampleRoutes) {
      if (!contentRouteMap.has(route)) {
        errors.push(`data/content-index.json missing example route: ${route}`);
      }
    }
  }

  return { ok: errors.length === 0, errors };
}

async function main() {
  console.log('Running master validation...');

  const dataResult = await runDataValidation({ projectRoot, silent: false });
  const linkResult = await runLinkValidation({ projectRoot, silent: false });

  let htmlResult = { ok: false, errors: ['index.html does not exist.'] };
  if (await exists(indexPath)) {
    htmlResult = validateHtmlStructure(await readFile(indexPath, 'utf8'));
    if (htmlResult.ok) {
      console.log('PASS HTML structure: index.html');
    } else {
      console.error('FAIL HTML structure: index.html');
      for (const error of htmlResult.errors) {
        console.error(`  - ${error}`);
      }
    }
  } else {
    console.error('FAIL HTML structure: index.html missing');
  }

  const referenceResult = await validateReferencedFiles();
  if (referenceResult.ok) {
    console.log('PASS referenced files check');
  } else {
    console.error('FAIL referenced files check');
    for (const error of referenceResult.errors) {
      console.error(`  - ${error}`);
    }
  }

  const routeCoverageResult = await validateRoutesAndCoverage();
  if (routeCoverageResult.ok) {
    console.log('PASS nav/content route coverage');
  } else {
    console.error('FAIL nav/content route coverage');
    for (const error of routeCoverageResult.errors) {
      console.error(`  - ${error}`);
    }
  }

  const passed = dataResult.ok && linkResult.ok && htmlResult.ok && referenceResult.ok && routeCoverageResult.ok;

  console.log('--- Summary ---');
  console.log(`Data validation: ${dataResult.ok ? 'PASS' : 'FAIL'}`);
  console.log(`Link validation: ${linkResult.ok ? 'PASS' : 'FAIL'}`);
  console.log(`HTML validation: ${htmlResult.ok ? 'PASS' : 'FAIL'}`);
  console.log(`Reference checks: ${referenceResult.ok ? 'PASS' : 'FAIL'}`);
  console.log(`Route coverage: ${routeCoverageResult.ok ? 'PASS' : 'FAIL'}`);

  if (!passed) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('Validation failed with an unexpected error.');
  console.error(error);
  process.exit(1);
});
