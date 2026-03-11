/**
 * Safe content reader utilities.
 *
 * Keystatic's reader throws on entries with unexpected frontmatter fields.
 * This module provides:
 *  - safeReadAll: Catches per-entry errors so malformed files don't break listings
 *  - rawReadAll: Reads .md files directly with gray-matter for full compatibility
 */
import { createReader } from '@keystatic/core/reader';
import keystaticConfig from '../../keystatic.config';
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';

// Configure marked with syntax highlighting via marked-highlight extension
marked.use(
  markedHighlight({
    langPrefix: 'hljs language-',
    highlight(code: string, lang: string) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return hljs.highlight(code, { language: lang }).value;
        } catch {
          // fall through
        }
      }
      try {
        return hljs.highlightAuto(code).value;
      } catch {
        return code;
      }
    },
  })
);

// Configure custom renderer with heading IDs for TOC anchor linking
const renderer = new marked.Renderer();
renderer.heading = function ({ text, depth }: { text: string; depth: number }) {
  const id = text
    .toLowerCase()
    .replace(/<[^>]+>/g, '') // strip HTML tags
    .replace(/[^\w\s-]/g, '') // remove special chars
    .replace(/\s+/g, '-') // spaces to hyphens
    .replace(/-+/g, '-') // collapse multiple hyphens
    .trim();
  return `<h${depth} id="${id}">${text}</h${depth}>`;
};

marked.use({ renderer });

export function getReader() {
  return createReader(process.cwd(), keystaticConfig);
}

type CollectionName = keyof ReturnType<typeof getReader>['collections'];

/**
 * Read all entries from a collection via Keystatic, skipping any that fail
 * schema validation. Returns successfully parsed entries only.
 */
export async function safeReadAll<T extends CollectionName>(collectionName: T) {
  const reader = getReader();
  const collection = reader.collections[collectionName];

  try {
    return await collection.all();
  } catch {
    const slugs = await collection.list();
    const results: { slug: string; entry: any }[] = [];

    for (const slug of slugs) {
      try {
        const entry = await collection.read(slug);
        if (entry) {
          results.push({ slug, entry });
        }
      } catch {
        console.warn(`[docs-cms] Skipping ${collectionName}/${slug}: schema validation failed`);
      }
    }

    return results;
  }
}

/**
 * Directory mapping from collection names to filesystem paths (relative to repo root).
 */
const collectionDirs: Record<string, string> = {
  adrs: 'docs/adr',
  roads: 'docs/roads',
  changes: 'docs/changes',
  nfrs: 'docs/nfr',
  bdd: 'docs/bdd',
  ddd: 'docs/ddd',
  personas: 'docs/personas',
  userStories: 'docs/user-stories',
  capabilities: 'docs/capabilities',
  plans: 'docs/plans',
  agents: 'docs/agents',
};

/** Map collection name to its URL path segment */
export const collectionUrlPaths: Record<string, string> = {
  adrs: 'adr',
  roads: 'roads',
  changes: 'changes',
  nfrs: 'nfr',
  bdd: 'bdd',
  ddd: 'ddd',
  personas: 'personas',
  userStories: 'user-stories',
  capabilities: 'capabilities',
  plans: 'plans',
  agents: 'agents',
};

/** Map collection name to its filesystem path relative to repo root (for GitHub edit links) */
export const collectionFsPaths: Record<string, string> = collectionDirs;

/** Map collection name to its display label */
export const collectionLabels: Record<string, string> = {
  adrs: 'Architecture Decisions',
  roads: 'Roadmap',
  changes: 'Changes',
  nfrs: 'Non-Functional Requirements',
  bdd: 'BDD Documentation',
  ddd: 'DDD Documentation',
  personas: 'Personas',
  userStories: 'User Stories',
  capabilities: 'Capabilities',
  plans: 'Plans',
  agents: 'Agents',
};

export interface RawEntry {
  slug: string;
  frontmatter: Record<string, any>;
  content: string;
}

/**
 * Read all .md files from a collection directory using gray-matter.
 * This bypasses Keystatic's strict schema validation entirely.
 * Use this for rendering pages where Keystatic's reader fails.
 */
export function rawReadAll(collectionName: string): RawEntry[] {
  const repoRoot = path.resolve(process.cwd(), '..');
  const dirPath = path.join(repoRoot, collectionDirs[collectionName] ?? collectionName);

  if (!fs.existsSync(dirPath)) {
    console.warn(`[docs-cms] Directory not found: ${dirPath}`);
    return [];
  }

  const files = fs.readdirSync(dirPath).filter((f) => f.endsWith('.md'));
  const entries: RawEntry[] = [];

  for (const file of files) {
    // Skip non-content files
    if (file === 'README.md' || file === 'TEMPLATE.md' || file === 'CHANGELOG.md') continue;

    const filePath = path.join(dirPath, file);
    const raw = fs.readFileSync(filePath, 'utf-8');
    const { data: frontmatter, content } = matter(raw);
    const slug = file.replace(/\.md$/, '');

    entries.push({ slug, frontmatter, content });
  }

  return entries;
}

/**
 * Read a single .md file by slug from a collection directory.
 */
export function rawRead(collectionName: string, slug: string): RawEntry | null {
  const repoRoot = path.resolve(process.cwd(), '..');
  const dirPath = path.join(repoRoot, collectionDirs[collectionName] ?? collectionName);
  const filePath = path.join(dirPath, `${slug}.md`);

  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data: frontmatter, content } = matter(raw);
  return { slug, frontmatter, content };
}

/**
 * Convert raw markdown content to HTML using marked.
 * Headings automatically get id attributes for TOC linking.
 * Code blocks get syntax highlighting via highlight.js.
 */
export function renderMarkdown(md: string): string {
  return marked.parse(md, { async: false }) as string;
}

/**
 * Format a date value (string, Date, or undefined) to YYYY-MM-DD.
 * Returns empty string for falsy or unparseable values.
 */
export function formatDate(value: unknown): string {
  if (!value) return '';
  const d = value instanceof Date ? value : new Date(String(value));
  if (isNaN(d.getTime())) return String(value);
  return d.toISOString().slice(0, 10);
}

/**
 * Given a flat list of entries and the current slug, find the previous and next entries.
 * Returns { prev, next } with label and href, or undefined if at boundaries.
 */
export function getPrevNext(
  entries: RawEntry[],
  currentSlug: string,
  urlPrefix: string,
  labelFn: (entry: RawEntry) => string
): { prev?: { label: string; href: string }; next?: { label: string; href: string } } {
  const idx = entries.findIndex((e) => e.slug === currentSlug);
  if (idx === -1) return {};

  const prev = idx > 0
    ? { label: labelFn(entries[idx - 1]), href: `${urlPrefix}/${entries[idx - 1].slug}` }
    : undefined;

  const next = idx < entries.length - 1
    ? { label: labelFn(entries[idx + 1]), href: `${urlPrefix}/${entries[idx + 1].slug}` }
    : undefined;

  return { prev, next };
}
