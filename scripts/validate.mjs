import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { exists, toPosixPath, walkFiles } from './lib/fs-utils.mjs';
import { runDataValidation } from '../tests/validate-data.mjs';
import { runLinkValidation } from '../tests/validate-links.mjs';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dataDir = path.join(projectRoot, 'data');
const indexPath = path.join(projectRoot, 'index.html');

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

function collectJsonPathReferences(value, sourceRelative, collected = []) {
  if (typeof value === 'string') {
    if (/^(?:\.\.?\/|content\/|assets\/|data\/|generated\/|examples\/)/.test(value)) {
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

  const passed = dataResult.ok && linkResult.ok && htmlResult.ok && referenceResult.ok;

  console.log('--- Summary ---');
  console.log(`Data validation: ${dataResult.ok ? 'PASS' : 'FAIL'}`);
  console.log(`Link validation: ${linkResult.ok ? 'PASS' : 'FAIL'}`);
  console.log(`HTML validation: ${htmlResult.ok ? 'PASS' : 'FAIL'}`);
  console.log(`Reference checks: ${referenceResult.ok ? 'PASS' : 'FAIL'}`);

  if (!passed) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('Validation failed with an unexpected error.');
  console.error(error);
  process.exit(1);
});
