# Publishing with GitHub Pages

The smallest Jekyll setup that renders the bundle as a navigable site. Two files, copied as they are and edited only where they say to:

- [`assets/github-pages/config.yml`](../assets/github-pages/config.yml) → `docs/_config.yml`, with `title` and `description` filled in.
- [`assets/github-pages/page.html`](../assets/github-pages/page.html) → `docs/_layouts/page.html`, unchanged.

Set the Pages publishing source to `/docs`, so the bundle root is the site root and nothing outside it is published.

Every plugin in that config ships with GitHub Pages, so the site builds with the default Pages workflow and no `Gemfile`.

## Navigation

just-the-docs reads three keys, and each page carries its own in frontmatter, so adding a page is one file edit and its place in the tree is stated where it is read.

- `nav_order` on every page, including `log.md` — sibling order.
- `parent` on every page inside a subdirectory, matching that subdirectory `README.md`'s `title`.
- `has_children: true` on each subdirectory `README.md`.

The theme renders the page listing, so a `README.md` body carries the domain's own prose — what this group of pages is, and the CONTEXT vocabulary at the bundle root — and describes the knowledge rather than the screen.

## Rendering the frontmatter

`title` and `description` become the page `<title>` and meta description through the theme's `jekyll-seo-tag`. `type`, `status`, `stale_after`, `sources`, `generated`, and `verified` are ordinary page variables that no plugin reads, so the bundle's own metadata is invisible until a layout prints it. Printing them is the whole job of `page.html`.

`jekyll-default-layout`, on by default with Pages, applies `page` to every page that declares no `layout` of its own.

## What breaks

- **Liquid runs over every page body.** A `{{ job.id }}` or `{% ... %}` in a code sample is interpreted at build time. GitHub Pages runs Jekyll 3.10, which has no `render_with_liquid` switch, so wrap such samples in `{% raw %}` … `{% endraw %}`.
- **A plain `jekyll build` applies no layout and fetches no remote theme.** Check locally with `github-pages build`, which resolves the same plugin set Pages runs.
- **Links that climb out of the site root 404.** `../README.md` resolves on GitHub's file view, so this only shows up on the site; such links need a `github.com/<owner>/<repository>/blob/<default branch>/` URL. Links within `docs/` stay relative.
- **Paths starting with `_` are not published**, apart from Jekyll's own `_layouts`. Keep subdirectory names free of a leading underscore.
- **kramdown differs from GitHub's renderer.** Task-list checkboxes (`- [ ]`) render as literal text; tables, fenced code, and `[^id]` footnotes are fine.
