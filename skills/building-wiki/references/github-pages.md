# Publishing with GitHub Pages

The smallest Jekyll setup that renders the bundle as a site. Set the Pages publishing source to `/docs` and put `_config.yml` in `docs/`, so the bundle root is the site root and nothing outside it is published.

```yaml
title: <repository name>
url: https://<owner>.github.io
baseurl: /<repository name>
theme: jekyll-theme-minimal

plugins:
  - jekyll-optional-front-matter   # log.md has no frontmatter
  - jekyll-relative-links          # ../reference/apple.md → the rendered page
  - jekyll-readme-index            # README.md serves as each subdirectory's index

readme_index:
  with_frontmatter: true           # default false skips every README that has frontmatter — all of ours do

exclude:
  - raw                            # mirrored sources are not for publishing
```

All three plugins are on the GitHub Pages allowlist, so this builds with the default Pages workflow and no `Gemfile`. `docs/README.md` is the site root without any plugin; `jekyll-readme-index` is for the subdirectories.

## What the frontmatter does on the site

`title` and `description` become the page `<title>` and meta description through the theme's `jekyll-seo-tag`. `type`, `status`, `stale_after`, `sources`, `generated`, and `verified` are ordinary page variables that no plugin reads. Timestamps parse as YAML dates and `human:h3y6e` as a plain string; footnotes render, since kramdown supports `[^id]`.

## What breaks

- **Liquid runs over every page body.** A `{{ job.id }}` or `{% ... %}` in a code sample is interpreted at build time. GitHub Pages runs Jekyll 3.10, which has no `render_with_liquid` switch, so wrap such samples in `{% raw %}` … `{% endraw %}`.
- **Paths starting with `_` are not published.** Keep subdirectory names free of a leading underscore.
- **kramdown differs from GitHub's renderer.** Task-list checkboxes (`- [ ]`) render as literal text; tables and fenced code are fine.
