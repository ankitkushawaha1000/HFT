import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { exists, toPosixPath, walkFiles } from '../scripts/lib/fs-utils.mjs';

const CATEGORY_VALUES = new Set([
  'behavioral',
  'coding',
  'cpp',
  'design',
  'general',
  'low-latency',
  'math',
  'mock-interview',
  'networking',
  'os',
  'probability',
  'study-plan',
  'systems',
  'trading',
]);

const COMPANY_EVIDENCE_VALUES = new Set([
  'official',
  'inferred',
  'anecdotal',
  'officially-documented',
  'inferred-from-jd',
  'anecdotally-reported',
  'general-preparation',
]);
const REQUIRED_FIELDS = ['id', 'title', 'question', 'category', 'topics', 'difficulty', 'sampleAnswer'];

function looksLikeQuestionRecord(record) {
  if (!record || typeof record !== 'object') {
    return false;
  }

  const hasPrompt = typeof record.question === 'string' || typeof record.prompt === 'string';
  const hasCategory = typeof record.category === 'string' || typeof record.topic === 'string';
  const hasTopics = Array.isArray(record.topics) || Array.isArray(record.tags);
  const hasAnswer = typeof record.sampleAnswer === 'string' || typeof record.answer === 'string';
  return Boolean(record.id && record.title && hasPrompt && hasCategory && hasTopics && hasAnswer);
}

function extractQuestionRecords(data) {
  if (Array.isArray(data)) {
    return data.every(looksLikeQuestionRecord) ? data : [];
  }
  if (data && typeof data === 'object') {
    if (Array.isArray(data.questions) && data.questions.every(looksLikeQuestionRecord)) {
      return data.questions;
    }
    if (looksLikeQuestionRecord(data)) {
      return [data];
    }
  }
  return [];
}

function normalizedRecord(record) {
  return {
    ...record,
    question: record.question ?? record.prompt,
    category: record.category ?? record.topic,
    topics: record.topics ?? record.tags,
    sampleAnswer: record.sampleAnswer ?? record.answer,
  };
}

function hasRequiredValue(record, field) {
  const value = record[field];
  if (Array.isArray(value)) {
    return value.length > 0;
  }
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  return value !== undefined && value !== null;
}

function extractEvidenceValues(question) {
  const values = [];
  const sources = [];

  if (typeof question.companyEvidence === 'string') {
    sources.push(question.companyEvidence);
  } else if (Array.isArray(question.companyEvidence)) {
    for (const entry of question.companyEvidence) {
      if (typeof entry === 'string') {
        sources.push(entry);
      } else if (entry && typeof entry === 'object' && typeof entry.evidence === 'string') {
        sources.push(entry.evidence);
      }
    }
  } else if (question.companyEvidence && typeof question.companyEvidence === 'object') {
    for (const entry of Object.values(question.companyEvidence)) {
      if (typeof entry === 'string') {
        sources.push(entry);
      } else if (entry && typeof entry === 'object' && typeof entry.evidence === 'string') {
        sources.push(entry.evidence);
      }
    }
  }

  if (Array.isArray(question.companies)) {
    for (const entry of question.companies) {
      if (entry && typeof entry === 'object' && typeof entry.evidence === 'string') {
        sources.push(entry.evidence);
      }
    }
  }

  for (const value of sources) {
    values.push(value);
  }

  return values;
}

export async function runDataValidation({ projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..'), silent = false } = {}) {
  const dataDir = path.join(projectRoot, 'data');
  const jsonFiles = await walkFiles(dataDir, (filePath) => filePath.endsWith('.json'));
  const errors = [];
  const seenIds = new Map();
  let questionCount = 0;

  if (!(await exists(dataDir))) {
    if (!silent) {
      console.log('PASS validate-data: data/ directory not present, nothing to validate.');
    }
    return { ok: true, errors: [], filesChecked: 0, questionCount: 0 };
  }

  // questions.json is the intentional aggregate of all category files; skip it for
  // duplicate-ID detection (IDs are already validated in the source files).
  const AGGREGATE_FILES = new Set(['data/questions.json']);

  for (const filePath of jsonFiles) {
    const relativePath = toPosixPath(path.relative(projectRoot, filePath));
    const isAggregate = AGGREGATE_FILES.has(relativePath);
    let parsed;
    try {
      parsed = JSON.parse(await readFile(filePath, 'utf8'));
    } catch (error) {
      errors.push(`${relativePath}: JSON parse failed (${error.message})`);
      continue;
    }

    const records = extractQuestionRecords(parsed);
    for (const [index, rawRecord] of records.entries()) {
      const record = normalizedRecord(rawRecord);
      questionCount += 1;
      for (const field of REQUIRED_FIELDS) {
        if (!hasRequiredValue(record, field)) {
          errors.push(`${relativePath}[${index}]: missing required field \`${field}\``);
        }
      }

      if (record.id && !isAggregate) {
        if (seenIds.has(record.id)) {
          errors.push(`${relativePath}[${index}]: duplicate id \`${record.id}\` (already used in ${seenIds.get(record.id)})`);
        } else {
          seenIds.set(record.id, `${relativePath}[${index}]`);
        }
      }

      if (record.category && !CATEGORY_VALUES.has(record.category)) {
        errors.push(`${relativePath}[${index}]: invalid category \`${record.category}\``);
      }

      if ('topics' in record && !Array.isArray(record.topics)) {
        errors.push(`${relativePath}[${index}]: topics must be an array`);
      }

      for (const evidence of extractEvidenceValues(record)) {
        if (!COMPANY_EVIDENCE_VALUES.has(evidence)) {
          errors.push(`${relativePath}[${index}]: invalid company evidence \`${evidence}\``);
        }
      }
    }
  }

  const ok = errors.length === 0;
  if (!silent) {
    if (ok) {
      console.log(`PASS validate-data: ${jsonFiles.length} files checked, ${questionCount} questions validated.`);
    } else {
      console.error('FAIL validate-data');
      for (const error of errors) {
        console.error(`  - ${error}`);
      }
    }
  }

  return { ok, errors, filesChecked: jsonFiles.length, questionCount };
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const result = await runDataValidation();
  process.exit(result.ok ? 0 : 1);
}
