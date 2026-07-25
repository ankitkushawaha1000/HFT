export function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function slugify(value = '') {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'item';
}

function applyInlineMarkdown(text) {
  return escapeHtml(text)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
}

export function stripMarkdown(markdown = '') {
  return String(markdown)
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1')
    .replace(/[>#*_~-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function extractTitle(markdown = '', fallback = 'Untitled') {
  const heading = String(markdown)
    .split(/\r?\n/)
    .find((line) => /^#\s+/.test(line.trim()));
  return heading ? heading.replace(/^#\s+/, '').trim() : fallback;
}

export function markdownToHtml(markdown = '') {
  const lines = String(markdown).split(/\r?\n/);
  const html = [];
  let inCodeBlock = false;
  let codeFence = '';
  let listOpen = false;
  let paragraph = [];

  const flushParagraph = () => {
    if (paragraph.length) {
      html.push(`<p>${applyInlineMarkdown(paragraph.join(' '))}</p>`);
      paragraph = [];
    }
  };

  const closeList = () => {
    if (listOpen) {
      html.push('</ul>');
      listOpen = false;
    }
  };

  for (const rawLine of lines) {
    const line = rawLine ?? '';
    const trimmed = line.trim();

    if (trimmed.startsWith('```')) {
      flushParagraph();
      closeList();
      if (!inCodeBlock) {
        inCodeBlock = true;
        codeFence = trimmed.slice(3).trim();
        html.push(`<pre><code${codeFence ? ` class="language-${escapeHtml(codeFence)}"` : ''}>`);
      } else {
        inCodeBlock = false;
        codeFence = '';
        html.push('</code></pre>');
      }
      continue;
    }

    if (inCodeBlock) {
      html.push(`${escapeHtml(line)}\n`);
      continue;
    }

    if (!trimmed) {
      flushParagraph();
      closeList();
      continue;
    }

    const headingMatch = trimmed.match(/^(#{1,6})\s+(.*)$/);
    if (headingMatch) {
      flushParagraph();
      closeList();
      const level = headingMatch[1].length;
      const text = applyInlineMarkdown(headingMatch[2].trim());
      html.push(`<h${level}>${text}</h${level}>`);
      continue;
    }

    const listMatch = trimmed.match(/^[-*]\s+(.*)$/);
    if (listMatch) {
      flushParagraph();
      if (!listOpen) {
        html.push('<ul>');
        listOpen = true;
      }
      html.push(`<li>${applyInlineMarkdown(listMatch[1].trim())}</li>`);
      continue;
    }

    if (trimmed.startsWith('>')) {
      flushParagraph();
      closeList();
      html.push(`<blockquote>${applyInlineMarkdown(trimmed.replace(/^>\s?/, ''))}</blockquote>`);
      continue;
    }

    paragraph.push(trimmed);
  }

  flushParagraph();
  closeList();

  if (inCodeBlock) {
    html.push('</code></pre>');
  }

  return html.join('\n');
}

export function buildHtmlDocument({ title, navigationHtml, bodyHtml, description = '' }) {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <style>
      :root {
        color-scheme: light dark;
        font-family: Inter, system-ui, sans-serif;
      }
      body {
        margin: 0;
        background: #0f172a;
        color: #e2e8f0;
      }
      a {
        color: #7dd3fc;
      }
      .layout {
        display: grid;
        grid-template-columns: minmax(220px, 280px) 1fr;
        min-height: 100vh;
      }
      nav {
        padding: 1.5rem;
        background: rgba(15, 23, 42, 0.85);
        border-right: 1px solid rgba(148, 163, 184, 0.2);
      }
      main {
        padding: 2rem;
        max-width: 900px;
      }
      pre {
        overflow-x: auto;
        padding: 1rem;
        border-radius: 0.5rem;
        background: rgba(15, 23, 42, 0.65);
      }
      code {
        font-family: ui-monospace, SFMono-Regular, monospace;
      }
      ul {
        padding-left: 1.25rem;
      }
      @media (max-width: 900px) {
        .layout {
          grid-template-columns: 1fr;
        }
        nav {
          border-right: 0;
          border-bottom: 1px solid rgba(148, 163, 184, 0.2);
        }
      }
    </style>
  </head>
  <body>
    <div class="layout">
      <nav>${navigationHtml}</nav>
      <main>${bodyHtml}</main>
    </div>
  </body>
</html>`;
}
