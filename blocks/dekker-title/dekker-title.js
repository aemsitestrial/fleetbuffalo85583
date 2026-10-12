import { Title } from '../../ds-eds-assets/js/dekker-title.js';
import { moveInstrumentation } from '../../scripts/scripts.js';
import { loadCSS } from '../../scripts/aem.js';
import uniqueId from '../../ds-eds-tools/unique-id.js';

/**
 * Dekker Title -- renders dekker-lib's Title from the design system's compiled DOM build
 * (ds-eds-assets/js/dekker-title.js, package @ac-brandsframework/eds-assets-dekker), with its
 * CSS from the same package. Nothing here restyles or re-implements the title: the markup is
 * the DS component's (div.title > div.cmp-title > hN.cmp-title__text), and its look comes from
 * ds-eds-assets/css/bundles/dekker-title.css plus the brand's globals.
 *
 * Fields (blocks/dekker-title/_dekker-title.json, "key-value": true, so each row is
 * <div><div>fieldName</div><div>value</div></div> and an empty field has no row):
 *   text       the title text
 *   type       heading level, h1-h6 (default h2)
 *   linkUrl    optional link; the text becomes a.cmp-title__link
 *   highlight  optional colour, a class from ds-eds-assets/js/options/title.js (titleHighlight)
 */
const FIELD_NAMES = ['text', 'type', 'linkUrl', 'highlight'];
const HEADING_TYPES = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
const DEFAULT_TYPE = 'h2';
// dekker-lib's CSS is scoped under this class (css/brands.json bodyClasses).
const BRAND_CLASS = 'ds-dekker';

// The block's rows by field name. A row whose first cell is not a known field name is skipped.
function rowsByName(rows) {
  const byName = {};
  rows.forEach((row) => {
    const name = row.children[0]?.textContent.trim();
    if (FIELD_NAMES.includes(name)) byName[name] = row;
  });
  return byName;
}

const valueCell = (row) => row?.children[1];
const textOf = (row) => valueCell(row)?.textContent.trim() || undefined;
const hrefOf = (row) => {
  const cell = valueCell(row);
  return (cell?.querySelector('a')?.getAttribute('href') || cell?.textContent || '').trim() || undefined;
};

export default function decorate(block) {
  // Brand globals once per page, then this block's own bundle. loadCSS is idempotent.
  loadCSS(`${window.hlx.codeBasePath}/ds-eds-assets/css/foundational/dekker-lib.css`);
  loadCSS(`${window.hlx.codeBasePath}/ds-eds-assets/css/bundles/dekker-title.css`);

  // A flat (no-filter) xwalk block can get an extra wrapper carrying data-aue-resource between
  // the .block element and its rows. Copy that identity onto the block so Universal Editor
  // re-runs decorate() on edit (same handling as blocks/ac-card/ac-card.js).
  const [firstChild] = [...block.children];
  const hasInnerResource = firstChild?.hasAttribute('data-aue-resource');
  const rows = hasInnerResource ? [...firstChild.children] : [...block.children];
  if (hasInnerResource && !block.hasAttribute('data-aue-resource')) {
    ['data-aue-resource', 'data-aue-type', 'data-aue-behavior', 'data-aue-model', 'data-aue-label', 'data-aue-component']
      .forEach((attr) => {
        const value = firstChild.getAttribute(attr);
        if (value) block.setAttribute(attr, value);
      });
  }

  const byName = rowsByName(rows);
  const text = textOf(byName.text) || '';
  const authoredType = textOf(byName.type);
  const type = HEADING_TYPES.includes(authoredType) ? authoredType : DEFAULT_TYPE;
  const linkUrl = hrefOf(byName.linkUrl);
  const highlight = textOf(byName.highlight);

  const title = Title({
    id: uniqueId('dekker-title'),
    type,
    text,
    link: linkUrl ? { valid: true, url: linkUrl } : undefined,
    // The option values are the classes themselves (title--highlight-N).
    className: highlight,
  });

  // Keep in-place editing of the text: move its instrumentation onto the rendered heading.
  const textCell = valueCell(byName.text);
  const instrumented = textCell?.querySelector('[data-aue-prop],[data-richtext-prop]') || textCell;
  const heading = title.querySelector('.cmp-title__text');
  if (instrumented && heading) moveInstrumentation(instrumented, heading);

  block.textContent = '';
  block.classList.add(BRAND_CLASS);
  block.append(title);
}
