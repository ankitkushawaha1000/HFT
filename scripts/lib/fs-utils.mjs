import { cp, mkdir, readdir, stat } from 'node:fs/promises';
import path from 'node:path';

export async function exists(targetPath) {
  try {
    await stat(targetPath);
    return true;
  } catch {
    return false;
  }
}

export async function ensureDir(dirPath) {
  await mkdir(dirPath, { recursive: true });
}

export async function walkFiles(rootDir, predicate = () => true) {
  if (!(await exists(rootDir))) {
    return [];
  }

  const files = [];
  const entries = await readdir(rootDir, { withFileTypes: true });

  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    const fullPath = path.join(rootDir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walkFiles(fullPath, predicate)));
    } else if (predicate(fullPath, entry)) {
      files.push(fullPath);
    }
  }

  return files;
}

export async function copyDirectory(sourceDir, destinationDir) {
  if (!(await exists(sourceDir))) {
    return false;
  }

  await ensureDir(destinationDir);
  await cp(sourceDir, destinationDir, { recursive: true });
  return true;
}

export function toPosixPath(value) {
  return value.split(path.sep).join('/');
}
