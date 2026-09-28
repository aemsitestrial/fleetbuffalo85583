# AGENTS.md

Context and instructions for AI coding agents working in this repository. This file documents
what is actually in the repo — nothing here is invented. Where something could not be verified,
it is explicitly marked **Unknown**.

Note: `AGENT.md` (referenced by `CLAUDE.md` via `@AGENT.md`) exists but is currently **empty (0
bytes)**. This file (`AGENTS.md`) is the real source of project context until `AGENT.md` is
filled in or repointed.

## 1. Project overview

- Repo name in `package.json`: `@adobe/aem-boilerplate-commerce`, version `1.0.0`, description
  "Starter project for Adobe Commerce on Edge Delivery Services". This metadata is still the
  **upstream boilerplate's**, not renamed for this project — do not treat it as this project's
  real name.
- `README.md` identifies the actual project: **"Frescopa Site Project"**, a coffee brand
  (`frescopa.coffee`), "Based on the boilerplate for AEM Authoring with Edge Delivery Services
  projects that integrate with Adobe Commerce."
- This is an **Adobe Commerce storefront built on Adobe Edge Delivery Services (EDS/Franklin)**,
  authored through AEM Universal Editor (xwalk), with commerce functionality provided by
  `@dropins/storefront-*` packages (cart, checkout, auth, account, order, PDP, payment-services).
- Live environment referenced in docs: `https://frescopa.coffee/`. Preview/test environments seen
  in config: `main--frescopa--aem-showcase.aem.live` (PR template, `tools/sidekick/config.json`)
  and `main--fleetbuffalo85583--aemsitestrial.aem.page` (this repo's actual GitHub org/repo:
  `aemsitestrial/fleetbuffalo85583`). See §18 for the naming inconsistency this creates.
- Business domain: coffee machines/products, locations, blog, standard commerce flows (cart,
  checkout, account, orders, returns).

## 2. Technology stack

- **Runtime**: vanilla JavaScript (ES modules), no framework, no bundler for the site itself —
  this is the standard AEM Edge Delivery Services ("Franklin") architecture: plain JS/CSS blocks
  loaded directly by the browser.
- **Commerce layer**: Adobe Commerce Dropins — `@dropins/storefront-account`,
  `-auth`, `-cart`, `-checkout`, `-order`, `-payment-services`, `-pdp`, plus `@dropins/tools` and
  `@dropins/build-tools` (devDependency). Dropins are vendored into `scripts/__dropins__/` and
  loaded via an `importmap` in `head.html`.
- **Analytics/data layer**: `@adobe/magento-storefront-event-collector`,
  `@adobe/magento-storefront-events-sdk`, Adobe Client Data Layer (`scripts/acdl/`).
- **Authoring**: AEM Universal Editor via the **xwalk** plugin convention (per-block `_*.json`
  model/definition/filter fragments merged into root `component-*.json` files).
- **CLI/dev server**: `@adobe/aem-cli` (`aem up`).
- **Linting**: ESLint 8 (`eslint-config-airbnb-base`, `eslint-plugin-json`, `eslint-plugin-xwalk`),
  Stylelint 16 (`stylelint-config-standard`).
- **Git hooks**: Husky 9 (no lint-staged).
- **JSON build tool**: `merge-json-cli` (assembles the xwalk `component-*.json` files).
- **E2E testing**: Cypress 13, in a separate `cypress/` sub-project with its own `package.json`.
- **No TypeScript** (no `tsconfig.json`/`jsconfig.json`), **no browserslist config** (targets
  modern evergreen browsers only — do not add legacy vendor-prefix fallbacks for IE/old Safari),
  **no bundler config** for the main site (Parcel is used only inside `tools/picker` and
  `tools/segments`, which are separate sidekick-palette mini-apps, not part of the site build).

## 3. Repository structure

```
blocks/           EDS block implementations (JS + CSS + xwalk _*.json per block), ~56 block folders
scripts/          Core EDS/AEM runtime + commerce bootstrap + vendored dropins
styles/           Global CSS (styles.css, fonts.css, article.css, lazy-styles.css, backgrounds/)
models/           Source xwalk fragments (_component-models.json, _component-definition.json,
                  _component-filters.json, _section.json...) merged by `npm run build:json`
tools/            picker/ and segments/ (Parcel+React sidekick palettes), pdp-metadata/ (Node
                  script), sidekick/ (config data), site-creator/ (static tool)
plugins/          experimentation/ — vendored Adobe AEM Experimentation (A/B testing) plugin
cypress/          E2E test suite, own package.json
icons/            SVG/GIF icons (incl. frescopa_logo.svg)
fonts/            woff2 font files used by styles/fonts.css
.github/          CI workflow (lint only) + PR template
.husky/           git hooks (pre-commit auto-rebuilds component-*.json — see §5)
.vscode/          editor settings (Prettier)
custom-teaser/    EMPTY directory at repo root (0 files) — not the real block; do not confuse
                  with blocks/custom-teaser/. Likely a stray scaffolding artifact.
well-known/       well-known/adobe/cloudmanager-challenge.txt only
```

Root-level files of note: `head.html`, `fstab.yaml`, `paths.json`, `config.json`,
`helix-query.yaml`, `helix-sitemap.yaml`, `component-definition.json`, `component-models.json`,
`component-filters.json`, `build.mjs`, `postinstall.js`, `default-site.json`, `demo-sidekick.json`.

## 4. Important files and their purposes

| File | Purpose |
|---|---|
| `head.html` | Bootstrap fragment injected into every page `<head>`: importmap for `@dropins/*`, loads `styles.css`, `aem.js`, `scripts.js`, `configs.js`, `commerce.js`, preloads initializers. |
| `scripts/aem.js` | Core Franklin/EDS block-loading + DOM utility library (see §8 for exports). Do not treat as project-specific — this is the standard AEM boilerplate file. |
| `scripts/scripts.js` | Page decoration, lazy/eager/delayed loading orchestration, Universal Editor instrumentation helpers (see §8). |
| `scripts/commerce.js` | Main commerce bootstrap script, loaded via `<script>` in `head.html`. |
| `scripts/configs.js` | Reads/exposes `config.json` values (`getConfigValue`, `checkIsAuthenticated`). |
| `scripts/__dropins__/` | Vendored built `@dropins/*` bundles, imported via the `head.html` importmap. |
| `models/_component-*.json` | **Source** xwalk fragments. Edit these, never edit the root `component-*.json` files directly. |
| `component-definition.json` / `component-models.json` / `component-filters.json` (root) | **Generated** by `npm run build:json` from `models/_component-*.json`. Committed to git (not gitignored). `component-models.json` is excluded from ESLint. |
| `blocks/<name>/_<name>.json` | Per-block xwalk fragment: `{ "definitions": [...], "models": [...], "filters": [...] }`, referenced into `models/_component-*.json` via merge-json-cli `"...": "path#/key"` includes. |
| `fstab.yaml` | Maps the EDS content mountpoint to the AEM author instance markup endpoint. |
| `paths.json` | URL path mappings/includes for the content source (locales en/es/fr/jp, `.helix/config.json`, `.helix/headers.json`). |
| `config.json` | Adobe Commerce backend config: GraphQL endpoints, AEM author/publish hosts. |
| `helix-query.yaml` | Defines the `sitemap` and `enrichment` content indices. |
| `.stylelintrc.json` / `.eslintrc.js` | Lint configs (see §7). |
| `.husky/pre-commit` (→ `.husky/pre-commit.mjs`) | Auto-runs `npm run build:json` and re-stages the three root `component-*.json` files whenever a staged file matches `_*.json`. |
| `.github/workflows/main.yaml` | CI: `npm ci && npm run lint` on every push. No test execution in CI. |

## 5. Development and build commands

From the root `package.json` (exact scripts):

```bash
npm start                  # aem up — local AEM CLI dev server
npm run lint               # npm run lint:js && npm run lint:css
npm run lint:js            # eslint . --ext .json,.js,.mjs
npm run lint:css           # stylelint "blocks/**/*.css" "styles/*.css"
npm run build:json         # rebuilds all three xwalk JSON files (see below)
npm run build:json:models      # merge-json-cli -i "models/_component-models.json" -o "component-models.json"
npm run build:json:definitions # merge-json-cli -i "models/_component-definition.json" -o "component-definition.json"
npm run build:json:filters     # merge-json-cli -i "models/_component-filters.json" -o "component-filters.json"
```

**Whenever you edit any `models/_*.json` file or any `blocks/<name>/_<name>.json` file, you must
run `npm run build:json` afterward** and verify the change actually appears in the corresponding
root `component-*.json` file. The pre-commit hook does this automatically for staged changes, but
when working interactively (not committing) you must run it yourself to see effects reflected,
e.g. before checking behavior against a live preview.

There is no separate "build" step for the site itself — EDS serves `blocks/`, `scripts/`,
`styles/` directly; there is no bundling/transpilation pipeline to run for block JS/CSS changes.

`postinstall`/`postupdate` run `node build.mjs && node postinstall.js` (dropins install
tooling). Exact internal behavior of `build.mjs`/`postinstall.js`: **Unknown** (not read in
detail) — treat as vendored dropins tooling, do not modify without inspecting first.

Sub-project scripts (each has its own `package.json`, run from within that directory):
- `cypress/`: `npm run cypress:open` / `cypress:run` (PaaS config), `cypress:saas:open` /
  `cypress:saas:run` (SaaS config).
- `plugins/experimentation/`: `npm run lint:js` / `lint:css` / `lint` (its own, older stylelint
  version — 15.10.3/34.0.0 vs. root's 16/37).
- `tools/pdp-metadata/`: `npm start` (`node pdp-metadata.js`).
- `tools/picker/`, `tools/segments/`: Parcel-based sidekick palette apps — `npm run start` /
  `watch` / `build`.

## 6. Testing commands

- **E2E**: Cypress, in `cypress/` (separate `package.json`, must `cd cypress` or otherwise target
  that package first — it is not wired into the root `package.json` at all).
  ```bash
  npm run cypress:open       # cypress open --browser chrome --config-file cypress.paas.config.js
  npm run cypress:run        # cypress run --config-file cypress.paas.config.js --env grepTags=-@skipPaas
  npm run cypress:saas:open  # cypress open --browser chrome --config-file cypress.saas.config.js
  npm run cypress:saas:run   # cypress run --config-file cypress.saas.config.js --env grepTags=-@skipSaas
  ```
  Specs live in `cypress/src/tests/e2eTests/` (checkout flows, account, store switcher, stock
  messages) and `cypress/src/tests/e2eTests/events/` (storefront event-collector assertions:
  add-to-cart, auth, initialization, checkout, product view, search, recs, cart view).
- **No unit test framework** is present anywhere in the repo (no Jest/Vitest/Playwright, no
  `"test"` script in the root `package.json`).
- **CI does not run Cypress** — `.github/workflows/main.yaml` only runs `npm ci && npm run lint`.
  There is currently no automated regression safety net beyond linting; be extra careful with
  block JS/CSS changes since nothing will catch a behavioral regression in CI.

## 7. Code conventions

- **ESLint** (`.eslintrc.js`): extends `airbnb-base`, `plugin:json/recommended`,
  `plugin:xwalk/recommended`; parser `@babel/eslint-parser`; `env.browser: true`. Notable
  overridden rules:
  - `import/extensions`: `.js` extensions **required** on imports.
  - `linebreak-style`: unix only.
  - `no-console`: allowed for `warn`, `error`, `info`, `debug` (plain `console.log` is not
    allowed).
  - `no-unused-vars`: `_`-prefixed args/vars are allowed to be unused.
  - `no-param-reassign` and `no-use-before-define` relaxed for function params/hoisting.
  - `.eslintignore` excludes vendored/generated code: `scripts/acdl`, `scripts/__dropins__`,
    `scripts/commerce-events-collector.js`, `scripts/commerce-events-sdk.js`,
    `scripts/widgets`, `scripts/htm.js`, `dompurify.min.js`, `tools/picker`, `tools/segments`,
    `tools/pdp-metadata`, `plugins/`, `cypress/`, `component-models.json`,
    `blocks/form/rules/formula/*`, `blocks/form/rules/model/*`,
    `blocks/form/rules/functionRegistration.js`, `blocks/video/videojs/video.min.js`.
- **Stylelint** (`.stylelintrc.json`): extends `stylelint-config-standard`; ignores `**/*.min.css`;
  `at-rule-no-vendor-prefix` disabled; custom `selector-class-pattern`:
  `^[a-z][a-z0-9]*(-[a-z0-9]+)*(__[a-z0-9]+(-[a-z0-9]+)*)?(--[a-z0-9]+(-[a-z0-9]+)*)?$` (kebab-case
  block, one level of `__element`, one level of `--modifier` — standard BEM-ish, single-level
  only, no `__a__b` or `--x--y`).
- **Prettier** (`.prettierrc.json` + `.vscode/settings.json`): `singleQuote: true`,
  `jsxSingleQuote: true`, `useTabs: false`. `editor.formatOnSave` is **off** in the committed
  VS Code settings.
- **`.editorconfig`**: 2-space indent for `.js`/`.json`, 4-space indent for `.css`.
- Run `npm run lint` before considering any change done — it is the only thing CI checks.
- **`/* eslint-disable */` at the top of a file is a common, accepted pattern in this codebase**
  (found in ~60% of block `.js` files, e.g. `blocks/cards/cards.js`, `blocks/teaser/teaser.js`,
  `blocks/custom-teaser/custom-teaser.js`). This is not something to "clean up" reflexively —
  it reflects that these files intentionally use patterns airbnb-base flags (e.g. building DOM via
  template-literal HTML strings). Don't strip these disables without actually fixing the
  underlying lint violations first (see the custom-teaser.css cleanup precedent — that file's
  22 stacked `stylelint-disable` comments were removed only after the underlying CSS was actually
  fixed to be compliant).

## 8. JavaScript/TypeScript conventions

No TypeScript anywhere in this repo — plain ES modules only.

`scripts/aem.js` exports (standard AEM/Franklin boilerplate — do not reinvent these):
```
buildBlock, createOptimizedPicture, decorateBlock, decorateBlocks, decorateButtons,
decorateIcons, decorateSections, decorateTemplateAndTheme, getMetadata, loadBlock,
loadCSS, loadFooter, loadHeader, loadScript, loadSection, loadSections,
readBlockConfig, sampleRUM, setup, toCamelCase, toClassName, waitForFirstImage,
wrapTextNodes
```

`scripts/scripts.js` exports (project-level orchestration + Universal Editor helpers):
```
getAllMetadata(scope)
moveAttributes(from, to, attrs)
moveInstrumentation(from, to)   — carries Universal Editor aue-* instrumentation attrs from an
                                   old element onto its replacement; use this whenever you create
                                   a brand-new element to replace an authored one
decorateMain(main)
fetchIndex(indexFile, pageSize = 500)
rootLink(link)
getConsent(topic)
```

Import path convention: blocks import these via relative paths, e.g.
```js
import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';
```
`rootLink` and `readBlockConfig` are the most frequently imported project helpers across
`blocks/**/*.js` after the two above.

## 9. CSS conventions

- BEM-ish naming is used within individual components, e.g.
  `.cmp-teaser`, `.cmp-teaser__pretitle`, `.cmp-teaser__content`, `.cmp-teaser__title`,
  `.cmp-teaser__title-link`, `.cmp-teaser__description` — matches the stylelint
  `selector-class-pattern` regex from §7.
- Simpler blocks use flat, non-BEM class names scoped by the block's own class, e.g.
  `blocks/hero/hero.css`'s `.hero`, `.hero picture`; `blocks/columns/columns.css`'s `.columns > div`.
  Either convention is acceptable depending on component complexity — match whichever the
  block you're touching already uses.
- Modern range media query syntax is used, e.g. `@media (width >= 900px)` (not
  `@media (min-width: 900px)`), consistent with targeting evergreen browsers only (no
  browserslist config exists — do not add legacy vendor-prefixed CSS fallbacks like
  `-ms-flexbox`, `-webkit-box-orient`, `-o-object-fit`; they are dead weight here).
- `styles/styles.css` defines the global design-token custom properties under `:root`, including
  Adobe Commerce Dropin tokens (`--color-brand-*`, `--color-neutral-*`,
  `--color-positive/warning/alert/informational-*`, `--shape-*`, `--spacing-*`, `--type-*`,
  `--grid-*`) and Frescopa brand tokens (`--frescopa-color-background`, `--frescopa-color-black`,
  `--frescopa-color-brand`, `--frescopa-color-primary/secondary/tertiary`,
  `--frescopa-color-text`) plus layout tokens (`--column-width`, `--gap`, `--nav-height`,
  `--site-width`, `--background-color`). Reuse these tokens instead of hardcoding colors/spacing
  in block CSS.
- `styles/fonts.css` declares `@font-face` for `roboto` and `roboto-condensed` from
  `../fonts/*.woff2`.
- Run `npm run lint:css` (or the full `npm run lint`) before considering CSS changes done — a
  file full of `stylelint-disable` comments is not treated as acceptable long-term (see §7);
  fix the underlying CSS rather than suppressing the rule, following the pattern already used
  to clean up `blocks/custom-teaser/custom-teaser.css` in this repo's own history.

## 10. AEM/EDS-specific conventions

- This project uses the **xwalk** Universal Editor integration. Every authorable component needs
  entries in three places, normally sourced from one per-block `_<name>.json` file:
  1. `definitions` — where/how it appears in the Universal Editor component picker
     (`plugins.xwalk.page.resourceType` + `template`).
  2. `models` — the authoring dialog's field schema.
  3. `filters` — what child components a container may hold (empty array `[]` for non-container
     blocks).
- The per-block `_<name>.json` fragments are pulled into the three **source** aggregate files
  (`models/_component-definition.json`, `models/_component-models.json`,
  `models/_component-filters.json`) via merge-json-cli's `{"...": "../blocks/<name>/_*.json#/definitions"}`
  include syntax, then compiled into the **root** `component-definition.json` /
  `component-models.json` / `component-filters.json` via `npm run build:json`. Only the root
  files are actually served/consumed by AEM's Universal Editor and Edge Delivery Services at
  runtime — the `models/_*.json` source files are never read directly by AEM.
- `models/_component-definition.json`'s `"Blocks"` group lists each block **explicitly by name**
  (no wildcard) — a new flat block must be added here manually, e.g.
  `{ "...": "../blocks/custom-teaser/_*.json#/definitions" }`. In contrast,
  `models/_component-models.json` and `models/_component-filters.json` use a wildcard glob
  (`"../blocks/*/_*.json#/models"` / `#/filters"`) that picks up every block folder automatically.
  **This asymmetry is a common source of "my new block doesn't show up in the editor" bugs** —
  always check whether the block was added to the `"Blocks"` group in
  `models/_component-definition.json` specifically, not just to its own `_<name>.json`.
- Known existing bug in this file: `"../blocks/bloglist/_*.json#/definitions"` (no hyphen)
  references a folder that doesn't exist — the actual folder is `blocks/blog-list/` (with a
  hyphen). `blocks/blog-list/_blog-list.json` itself is well-formed, but its definitions likely
  never make it into the merged `component-definition.json` because of this glob mismatch. Fix
  this if you touch `blog-list`, but it's out of scope to fix opportunistically otherwise.
- Every block model entry needs a matching `id` between its `definitions[].template.model` (or
  for item definitions, the item's own template) and its `models[].id` — an id mismatch (e.g. a
  container and its item accidentally sharing the same id) silently breaks the author dialog /
  filter linkage. Verify these three ids line up whenever adding or editing a block:
  container definition id ↔ its `template.filter` ↔ the `filters[].id` entry; item definition id
  ↔ its `template.model` ↔ the `models[].id`.
- Two block shapes exist side by side in this repo:
  - **Flat, single-instance block** (e.g. `teaser`, `custom-teaser`, `hero`, `offer`): one
    `definitions` entry with `resourceType: core/franklin/components/block/v1/block`, one
    `models` entry, `filters: []`. Authored content is one row per model field, in field order.
    Decorate with `const props = [...block.children].map((row) => row.firstElementChild);` then
    destructure positionally.
  - **Container + repeating item block** (e.g. `cards`/`card`, `columns`/`column`): two
    `definitions` entries — a container (`resourceType: .../block`) and an item
    (`resourceType: .../block/item`), distinct ids, container's `template.filter` matching a
    `filters[]` entry whose `components` list contains the item's id. Authored content is one
    child element per item; each item's own children are its fields in field order.
- `npm run build:json` (or the pre-commit hook) must be re-run after any `_*.json` edit — see §5.
- `fstab.yaml` maps the EDS content mountpoint to one AEM author instance
  (`author-p130360-e1272151.adobeaemcloud.com`), while `config.json`'s `aem.author` points at a
  **different** author instance (`author-p153710-e1614654.adobeaemcloud.com`). This
  discrepancy was not resolved during investigation — flag it rather than assuming either is
  wrong (**Unknown** which is authoritative).
- `paths.json` content source path is dated `/content/2026/40/fleetbuffalo85583/` with en/es/fr/jp
  locale mappings.

## 11. Block development guidelines

When adding a new block, mirror an existing block of the same shape rather than inventing a new
pattern:

- **Flat single-instance block** → copy the shape of `blocks/teaser/` (`teaser.js`, `teaser.css`,
  `_teaser.json`). Decorate function pattern:
  ```js
  export default function decorate(block) {
    const props = [...block.children].map((row) => row.firstElementChild);
    // destructure `props` in the exact order of the model's `fields` array
  }
  ```
- **Container + repeating item block** → copy the shape of `blocks/cards/` (`cards.js`,
  `_cards.json`). Decorate function pattern:
  ```js
  export default function decorate(block) {
    [...block.children].forEach((row) => { /* row = one item; row.children = that item's fields */ });
  }
  ```
- Always import `createOptimizedPicture` from `../../scripts/aem.js` for any authored image field
  (don't hand-roll `<img>`/`<picture>` markup or responsive `srcset` logic).
- Always call `moveInstrumentation(oldEl, newEl)` from `../../scripts/scripts.js` whenever you
  create a **new** element to replace an authored one (e.g. a generated `<picture>` replacing the
  authored image container, or a relabeled action link) — this preserves Universal Editor's
  in-context-editing attributes. You do not need it when you just reuse the original element and
  only change its `className`/append it elsewhere.
- Fields whose only purpose is to add a modifier class to the block (e.g. a `select` of style/
  layout variants) should have their text value read and added via `classList.add(...)`, and the
  field's own element must then be **removed from the rendered output** — never leave a
  modifier-only field's raw text visible in the DOM. This is the exact class of bug fixed in
  `blocks/custom-teaser/custom-teaser.js` in this repo's own history.
- Every new block folder needs, at minimum: `<name>.js`, `<name>.css`, `_<name>.json`
  (definitions + models + filters), and an explicit reference added to
  `models/_component-definition.json`'s `"Blocks"` group (see §10 — this step is easy to forget
  since the models/filters wildcards make it seem automatic).
- After registering, run `npm run build:json` and verify the new block's id appears in the root
  `component-definition.json`, `component-models.json`, and (if a container) `component-filters.json`.
- Run `npm run lint` on any new/changed block before considering it done.
- Do not assume a `.js` file exists just because its CSS/model does — `blocks/hero/hero.js` is
  currently an **empty 0-byte file** despite `hero.css` and `_hero.json` being fully implemented.
  If you're asked to work on Hero, check this first; there is no existing `decorate()` logic to
  extend, only to write.

## 12. Universal Editor guidelines

- Universal Editor authoring is driven entirely by the xwalk model/definition/filter JSON
  described in §10 — there is no separate "Universal Editor config" beyond `models/` and the
  per-block `_*.json` files plus the built root `component-*.json` files.
- `head.html` is the authoring/runtime bootstrap: it sets up the `@dropins/*` importmap and
  preloads `editor-support.js` / `editor-support-rte.js` / `form-editor-support.js` machinery for
  in-context editing (these exist in `scripts/` — treat as standard boilerplate, do not modify
  without a specific reason).
- A field named literally `classes` (type `multiselect`) is special: the platform applies its
  value directly as classes on the block's root element automatically, with no JS needed — see
  `blocks/teaser/_teaser.json`'s `classes` field (Theme/Alignment/Background Color groups). If a
  block needs exactly one combined multi-class picker, prefer this convention over a hand-rolled
  select. `custom-teaser` intentionally uses **separate** `select` fields (`teaserStyle`,
  `teaserModifier`, etc.) instead, because it needs several independent modifier classes at once —
  in that case you must extract + apply the class(es) manually in `decorate()` (see §11).
- Changes to any `_*.json` model file only take effect in the Universal Editor after
  `npm run build:json` has run **and** the resulting root `component-*.json` files have been
  pushed and synced to the AEM code bus. If a newly-registered block still doesn't appear in the
  component picker after a correct local rebuild, check whether the **AEM Code Sync GitHub App**
  is actually installed on the repository (see §13) before assuming the JSON registration is
  wrong — a repo without that GitHub App simply never syncs code changes to the preview/live
  environment, regardless of how many times you push.
- `eslint-plugin-xwalk` (`plugin:xwalk/recommended` in `.eslintrc.js`) lints the xwalk JSON
  fragments themselves — running `npm run lint:js` also validates `_*.json` files, not just
  block `.js` files.

## 13. AEM Code Sync / deployment workflow

- Per `README.md`'s own setup instructions, step 2 is: **"Add the AEM Code Sync GitHub App to the
  repository, so your code changes get synced with EDS."** This is a manual, one-time
  GitHub-org-level action (installing `https://github.com/apps/aem-code-sync` against this repo) —
  it is not something achievable via any command in this repo, and nothing in the repo enforces
  or checks that it's been done.
- As of this investigation, this repo's code bus (`main--fleetbuffalo85583--aemsitestrial.aem.page`)
  was observed serving a **stale** `component-definition.json` (missing a just-committed,
  just-pushed change), and a direct admin API call
  (`POST https://admin.hlx.page/code/aemsitestrial/fleetbuffalo85583/main/...`) returned
  `400: "github bot not installed on repository"`. **If code changes aren't showing up on the
  preview/live site despite being committed and pushed to `main`, this is the first thing to
  check/report** — it is very likely the actual cause, not a bug in the pushed code itself.
- There is no separate CD/deploy workflow file — `.github/workflows/main.yaml` only lints
  (`npm ci && npm run lint`) on every push; it does not deploy anything. Deployment to
  preview/live is handled entirely by the AEM Code Sync GitHub App (once installed) reacting to
  pushes to `main` (and other branches, for per-branch previews).
- `.github/pull_request_template.md` expects every PR description to include a GitHub issue
  reference and before/after test URLs on `main--frescopa--aem-showcase.aem.live` (see §18 for
  the site-identity caveat this implies).

## 14. Rules for modifying existing code

- **Never edit the root `component-definition.json` / `component-models.json` /
  `component-filters.json` directly.** They are generated. Edit the corresponding
  `models/_component-*.json` or `blocks/<name>/_<name>.json` source file, then run
  `npm run build:json`.
- Preserve existing block CSS class names and HTML structure unless you have a concrete reason to
  change them (a real bug, a real lint violation, an explicit user request) — other code
  (CSS files with the same BEM class names, e.g. `.cmp-teaser__*` shared between the legacy and
  `.ac-core`-scoped sections of `custom-teaser.css`) may depend on exact class names.
- When fixing lint violations in CSS or JS, fix the underlying issue rather than adding a new
  `stylelint-disable`/`eslint-disable` comment, unless the violation is for something genuinely
  unfixable in-place (e.g. a third-party/platform-generated class name that must stay as-is —
  in that case use the narrowest possible scoped disable, e.g.
  `/* stylelint-disable-next-line selector-class-pattern -- AEM-generated grid class name,
  cannot be renamed */` on the one selector, never a blanket file-level disable).
- When a `select`/`multiselect` field's only purpose is to add a class, make sure it is actually
  wired to do so in `decorate()` and never left rendering as visible text — check both the field's
  model definition (does its value match an actual CSS class name that exists?) and the block JS
  (is the field consumed via classList, not appended as content?).
- Don't assume a container/item registration is correct just because it parses — verify the
  container id, item id, `template.filter`/`template.model`, and the corresponding
  `filters[].id`/`filters[].components` all cross-reference each other correctly (see §10). A
  duplicated or mismatched id is a real bug pattern that has occurred in this repo's own history
  (`custom-teaser`'s item definition initially duplicated its container's id).
- Re-run `npm run lint` and, for any `_*.json` change, `npm run build:json`, before considering a
  change complete.

## 15. Rules for adding new functionality

- Match the existing shape (flat vs. container+item) to what's actually being authored — don't
  default to a repeating-list/container structure just because it seems more flexible; check
  whether the component is genuinely meant to be authored multiple times per page or once (see
  §11's guidance and the `custom-teaser` precedent, which was initially over-built as a
  container+item grid before being corrected to match its single-instance intent).
- Reuse `scripts/aem.js` / `scripts/scripts.js` exports (§8) rather than re-implementing
  equivalents (image optimization, block/section decoration, RUM sampling, metadata reading,
  Universal Editor instrumentation).
- Reuse the design tokens in `styles/styles.css` (`--color-*`, `--spacing-*`, `--type-*`,
  `--frescopa-color-*`, etc.) rather than hardcoding new color/spacing values.
- Do not introduce a bundler, a new CSS methodology, TypeScript, or a new test framework — none
  of these exist in the project today and none were requested; stick to plain ES modules / plain
  CSS / Cypress, per the "don't recommend unused technologies" rule.
- Do not add browserslist-driven vendor-prefixed CSS fallbacks — there is no browserslist config,
  and the project's own CSS uses modern range media query syntax, implying evergreen-browser-only
  support.
- New E2E coverage belongs in `cypress/src/tests/e2eTests/` following the existing spec file
  naming/`describe`/`it` conventions (see §6); there is no unit test framework to add tests to
  instead.

## 16. Common pitfalls and things an AI agent should avoid

- **Forgetting to add a new flat block to `models/_component-definition.json`'s `"Blocks"`
  group.** Unlike models/filters, this group is an explicit list, not a wildcard — this is the
  single most likely reason "I registered my block but it's not in the editor" (confirmed root
  cause found for `custom-teaser` earlier in this repo's history).
- **Forgetting to run `npm run build:json` after editing any `_*.json` file** and then concluding
  a registration change "didn't work" when it was simply never compiled into the root
  `component-*.json` files.
- **Assuming a missing block in the live/preview editor is a JSON bug** without first checking
  whether the AEM Code Sync GitHub App is installed and whether the push actually synced (§13) —
  this repo has concretely hit this exact false trail before.
- **Treating `blocks/custom-teaser/README.md`'s provenance claims as fact.** That file describes
  an entirely different, unrelated toolchain (`ac-core-lib`, `atlascopco-core-components`,
  `.eds-poc/`, `docs/capgemini-package/`) that does not exist anywhere in this repository. It does
  not accurately describe how this repo's `custom-teaser` block was actually built or is
  registered — do not use it as a source of truth; verify against the actual `_custom-teaser.json`
  and `custom-teaser.js` instead.
- **Blindly running `stylelint --fix` / `eslint --fix` and shipping the result unreviewed.**
  Stylelint's autofix has been observed (in this repo, on `custom-teaser.css`) to rewrite an
  invalid vendor-prefixed value (`display: -ms-flexbox`) into an equally-invalid unprefixed one
  (`display: flexbox`), and to produce duplicate declarations. Autofix is fine for safe mechanical
  changes (quoting, media range notation, color function modernization) but the full diff must be
  reviewed, not trusted wholesale.
- **Confusing the empty root-level `custom-teaser/` directory with the real
  `blocks/custom-teaser/`.** The former is a stray empty folder; all real block code lives under
  `blocks/`.
- **Assuming `blocks/<name>/<name>.js` exists just because `<name>.css`/`_<name>.json` do** — at
  least one block (`hero`) currently has a 0-byte `.js` file despite full CSS/model support.
- **Adding legacy vendor-prefixed CSS** (`-ms-*`, old `-webkit-box*` flexbox, `-o-object-fit`) —
  there is no browserslist target requiring it, and it will trip
  `declaration-property-value-no-unknown` / `declaration-block-no-duplicate-properties` under
  this repo's stylelint config.
- **Editing the root `component-*.json` files directly** instead of their `models/_*.json` /
  `blocks/*/_*.json` sources (§14).
- **CI will not catch behavioral/E2E regressions** — it only lints. Be more careful than usual
  with block logic changes since there's no automated functional safety net in CI.

## 17. Git conventions

- Commit history (`git log --oneline`) uses **short, lower-case, free-text imperative summaries**,
  e.g. `create custom teaser`, `update custom-teaser styles`, `update custom-teaser registration`,
  `Update config.json`. **No conventional-commits prefixes** (`feat:`, `fix:`, etc.) are used in
  practice, despite `CONTRIBUTING.md` being a generic Adobe/Project Helix OSS template that
  references a `npm run commit` wizard — **that script does not exist in this repo's
  `package.json`**; don't tell users to run it.
- `.github/pull_request_template.md` asks for a linked GitHub issue and before/after test URLs
  (on `main--frescopa--aem-showcase.aem.live`) in every PR description — follow this format when
  drafting PR descriptions.
- No commitlint config, no lint-staged config. The only automated git-hook behavior is the
  `.husky/pre-commit` → `.husky/pre-commit.mjs` script, which rebuilds and re-stages the three
  root `component-*.json` files whenever a staged file matches `_*.json` (see §5/§10).

## 18. Project-specific architectural decisions / quirks discovered

- **Two registration shapes coexist by design**: flat single-instance blocks (`teaser`,
  `custom-teaser`, `hero`, `offer`, ...) vs. container+repeating-item blocks (`cards`/`card`,
  `columns`/`column`, `form`/its many sub-components). Always identify which shape a component
  needs before registering/writing it (see §10, §11).
- **Site identity is inconsistent across config files** — this repo is
  `aemsitestrial/fleetbuffalo85583` on GitHub, but: `README.md`/`tools/sidekick/config.json`/
  `.github/pull_request_template.md` reference `frescopa`/`aem-showcase`; `demo-sidekick.json`
  (a boilerplate leftover) references `aem-boilerplate-commerce`/`hlxsites`; `paths.json`'s
  content path is `/content/2026/40/fleetbuffalo85583/`; `fstab.yaml` and `config.json` each
  reference a **different** AEM author Cloud Service instance
  (`author-p130360-e1272151` vs. `author-p153710-e1614654`). Treat this repo as a fork/scaffold
  that has not been fully renamed/consolidated — **do not assume any one of these identifiers is
  "the" canonical one** without asking; flag the specific ambiguity if it matters to a task
  (**Unknown** which host/identity is authoritative).
- **`models/_component-definition.json` has a stale glob**: `blocks/bloglist/_*.json` (no hyphen)
  vs. the real folder `blocks/blog-list/` (with hyphen) — likely means blog-list's Universal
  Editor definitions are silently missing from the compiled `component-definition.json`. Not
  fixed as part of this audit (out of scope unless you're asked to touch `blog-list`); flagged
  here so it isn't mistaken for intentional.
- **`blocks/custom-teaser/README.md`'s stated provenance is not trustworthy** (see §16) — it
  references a design-system/toolchain that doesn't exist in this repo.
- **No browserslist config anywhere** (root or `plugins/experimentation`) — an explicit choice (or
  at least a consistent one) to target modern evergreen browsers only; CSS throughout uses modern
  range media query syntax.
