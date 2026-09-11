# Rendering with GitHub Pages

The default viewer for a bundle. Two files, copied as they are:

- [`assets/github-pages/config.yml`](../assets/github-pages/config.yml) → `docs/_config.yml`, with `title` and `description` filled in.
- [`assets/github-pages/page.html`](../assets/github-pages/page.html) → `docs/_layouts/page.html`.

Set the Pages source to `/docs`. The site's visibility follows the repository's.

Navigation keys in each page's frontmatter:

- `nav_order` on every page, including `log.md`.
- `parent` on every page inside a subdirectory, matching that subdirectory `README.md`'s `title`.
- `has_children: true` on each subdirectory `README.md`.

Wrap `{{ }}` or `{% %}` in code samples with `{% raw %}` … `{% endraw %}`; links out of `docs/` need a full `github.com/…/blob/…` URL.
