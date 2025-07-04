# mdit-async-fm-title

A markdown-it plugin to inject an H1 title from frontmatter asynchronously.

## Features

- Extracts the `title` (or custom key) from frontmatter and prepends it as an H1 if not already present.
- Skips files based on path exclusion.
- Supports async rendering with [markdown-it-async](https://www.npmjs.com/package/markdown-it-async).

## Installation

```sh
npm install mdit-async-fm-title
```

## Usage

```js
import MarkdownItAsync from 'markdown-it-async';
import mditAsyncFmTitleFn from 'mdit-async-fm-title';

const md = MarkdownItAsync();
mditAsyncFmTitleFn(md, {
  exclude: ['node_modules', 'drafts'], // optional
  titleKey: 'title' // optional
});

const src = `---
title: Hello World
---
This is content.`;

const html = await md.renderAsync(src, {});
console.log(html);
// Output will include <h1>Hello World</h1> if not already present
```

## Options

- `exclude` (array): List of path substrings to skip processing (default: `[]`).
- `titleKey` (string): Frontmatter key to use for the title (default: `'title'`).

## Example

If your markdown file contains:

```markdown
---
title: My Page
---
Some content here.
```

The rendered HTML will start with:

```html
<h1>My Page</h1>
<p>Some content here.</p>
```

If an H1 is already present, the plugin will not add another.

## License

ISC
