// @ts-check
import MarkdownItAsync from 'markdown-it-async';
import mditAsyncFmTitleFn from './index.js';
import { describe, it } from "node:test"
import assert from "node:assert"

describe('mdit-async-fm-title', () => {
  it('should add H1 from frontmatter', async () => {
    // Arrange
    const md = MarkdownItAsync();
    mditAsyncFmTitleFn(md);
    const src = `---
title: Hello World
---
This is content.`;

    // Act
    const html = await md.renderAsync(src, {});

    // Assert
    assert(html.includes('<h1>Hello World</h1>'), 'Should add H1 from frontmatter');
    assert(html.includes('<p>This is content.</p>'), 'Should keep content');
  });

  it('should not add H1 if already present', async () => {
    // Arrange
    const md = MarkdownItAsync();
    mditAsyncFmTitleFn(md);
    const src = `---
title: Hello World
---
# Hello World

This is content.`;

    // Act
    const html = await md.renderAsync(src, {});

    // Assert
    assert((html.match(/<h1>/g) || []).length === 1, 'Should have only one H1');
    assert(html.includes('<h1>Hello World</h1>'), 'Should keep H1');
    assert(html.includes('<p>This is content.</p>'), 'Should keep content');
  });

  it('should not add H1 if env.path matches exclude', async () => {
    // Arrange
    const md = MarkdownItAsync();
    mditAsyncFmTitleFn(md, { exclude: ['skipme'] });
    const src = `---
title: Skipped
---
Content.`;

    // Act
    const html = await md.renderAsync(src, { path: 'skipme/file.md' });

    // Assert
    assert(!html.includes('<h1>Skipped</h1>'), 'Should not add H1 if excluded');
    assert(html.includes('<p>Content.</p>'), 'Should keep content');
  });

  it('should use custom title key', async () => {
    // Arrange
    const md = MarkdownItAsync();
    mditAsyncFmTitleFn(md, { titleKey: 'customTitle' });
    const src = `---
customTitle: Custom!
---
Content.`;

    // Act
    const html = await md.renderAsync(src, {});

    // Assert
    assert(html.includes('<h1>Custom!</h1>'), 'Should use custom title key');
    assert(html.includes('<p>Content.</p>'), 'Should keep content');
  });
});