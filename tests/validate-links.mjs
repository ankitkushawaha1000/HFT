import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { exists, toPosixPath, walkFiles } from '../scripts/lib/fs-utils.mjs';

const LINK_PATTERN = /\[[^\]]+\]\(((?:\.\.?\/)[^)#\s]+)(?:#[^)\s]*)?\)/g;

export async function runLinkValidation({ projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..'), silent = false } = {}) {
  const contentDir = path.join(projectRoot, 'content');
  const markdownFiles = await walkFiles(contentDir, (filePath) => filePath.endsWith('.md'));
  const errors = [];
  let checked = 0;

  for (const filePath of markdownFiles) {
    const relativePath = toPosixPath(path.relative(projectRoot, filePath));
    const lines = (await readFile(filePath, 'utf8')).split(/\r?\n/);

    for (const [lineIndex, line] of lines.entries()) {
      for (const match of line.matchAll(LINK_PATTERN)) {
        const target = match[1];
        checked += 1;
        const resolved = path.resolve(path.dirname(filePath), target);
        if (!(await exists(resolved))) {
          errors.push(`${relativePath}:${lineIndex + 1} -> ${target}`);
        }
      }
    }
  }

  const ok = errors.length === 0;
  if (!silent) {
    if (ok) {
      console.log(`PASS validate-links: ${checked} links checked, 0 broken.`);
    } else {
      console.error('FAIL validate-links');
      for (const error of errors) {
        console.error(`  - ${error}`);
      }
      console.error(`Summary: ${checked} links checked, ${errors.length} broken.`);
    }
  }

  return { ok, errors, checked, broken: errors.length };
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const result = await runLinkValidation();
  if (result.ok) {
    console.log(`Summary: ${result.checked} links checked, ${result.broken} broken.`);
  }
  process.exit(result.ok ? 0 : 1);
}
