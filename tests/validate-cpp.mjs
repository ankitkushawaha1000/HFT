import { rm } from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { exists } from '../scripts/lib/fs-utils.mjs';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const buildDir = path.join(projectRoot, 'build', 'cpp-validation');

function runCommand(command, args, options = {}) {
  return new Promise((resolve) => {
    const child = spawn(command, args, {
      cwd: options.cwd ?? projectRoot,
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (chunk) => {
      stdout += chunk;
    });
    child.stderr.on('data', (chunk) => {
      stderr += chunk;
    });

    child.on('error', (error) => {
      resolve({ ok: false, code: null, stdout, stderr, error });
    });
    child.on('close', (code) => {
      resolve({ ok: code === 0, code, stdout, stderr });
    });
  });
}

async function commandAvailable(command) {
  const result = await runCommand(command, ['--version']);
  return result.ok || (!result.ok && result.code !== null);
}

async function main() {
  const hasCmake = await commandAvailable('cmake');
  const hasCompiler = await commandAvailable('g++');

  if (!hasCmake || !hasCompiler) {
    console.log('SKIP validate-cpp: cmake and/or g++ not available in this environment.');
    process.exit(0);
  }

  if (!(await exists(path.join(projectRoot, 'CMakeLists.txt')))) {
    console.error('FAIL validate-cpp: root CMakeLists.txt not found.');
    process.exit(1);
  }

  await rm(buildDir, { recursive: true, force: true });

  const configure = await runCommand('cmake', ['-S', '.', '-B', buildDir, '-DCMAKE_BUILD_TYPE=Debug']);
  if (!configure.ok) {
    console.error('FAIL validate-cpp: configure step failed.');
    process.stderr.write(configure.stdout);
    process.stderr.write(configure.stderr);
    process.exit(1);
  }

  const build = await runCommand('cmake', ['--build', buildDir, '--parallel']);
  if (!build.ok) {
    console.error('FAIL validate-cpp: build step failed.');
    process.stderr.write(build.stdout);
    process.stderr.write(build.stderr);
    process.exit(1);
  }

  const test = await runCommand('ctest', ['--test-dir', buildDir, '--output-on-failure']);
  if (!test.ok) {
    console.error('FAIL validate-cpp: ctest failed.');
    process.stderr.write(test.stdout);
    process.stderr.write(test.stderr);
    process.exit(1);
  }

  console.log('PASS validate-cpp');
  console.log(configure.stdout.trim());
  console.log(build.stdout.trim());
  console.log(test.stdout.trim());
}

main().catch((error) => {
  console.error('FAIL validate-cpp: unexpected error.');
  console.error(error);
  process.exit(1);
});
