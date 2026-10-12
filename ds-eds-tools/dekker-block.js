import { loadCSS } from '../scripts/aem.js';
import { moveInstrumentation } from '../scripts/scripts.js';
import { patchPicture } from '../ds-eds-assets/js/vendor/patch-picture.js';
import uniqueId from './unique-id.js';

/**
 * Shared glue for the dekker-* blocks. Each block renders one dekker-lib component from the
 * design system's compiled DOM build (ds-eds-assets/js/dekker-<name>.js, package
 * @ac-brandsframework/eds-assets-dekker) with that package's CSS; this file holds what every
 * block does around that render call: load the CSS, read the authored rows, carry Universal
 * Editor instrumentation onto the rendered markup, and swap the block's content.
 *
 * Authored content:
 * - A block's own fields use "key-value": true, so each row is
 *   <div><div>fieldName</div><div>value</div></div>, and an empty field has no row.
 * - Items of a container block (tabs, carousels, news and product blocks) are one row each, with
 *   one child per field in the order of the item model's fields.
 */

export { uniqueId, moveInstrumentation, patchPicture };

// dekker-lib's CSS is scoped under this class (ds-eds-assets/css/brands.json bodyClasses).
export const BRAND_CLASS = 'ds-dekker';

export const assetPath = (path) => `${window.hlx.codeBasePath}/ds-eds-assets/${path}`;

/** Brand globals once per page (loadCSS is idempotent), then the block's own bundle. */
export function loadDekkerCss(blockName) {
  loadCSS(assetPath('css/foundational/dekker-lib.css'));
  loadCSS(assetPath(`css/bundles/${blockName}.css`));
}

/**
 * The block's rows. A flat (no-filter) xwalk block can get an extra wrapper carrying
 * data-aue-resource between the .block element and its rows; its identity is copied onto the
 * block so Universal Editor re-runs decorate() on edit (same handling as blocks/ac-card).
 * A container block's children are its rows and items as they are: an item carries its own
 * data-aue-resource, so `container` skips the unwrapping.
 */
export function blockRows(block, { container = false } = {}) {
  const [firstChild] = [...block.children];
  const hasInnerResource = !container && firstChild?.hasAttribute('data-aue-resource');
  if (!hasInnerResource) return [...block.children];
  if (!block.hasAttribute('data-aue-resource')) {
    ['data-aue-resource', 'data-aue-type', 'data-aue-behavior', 'data-aue-model', 'data-aue-label', 'data-aue-component']
      .forEach((attr) => {
        const value = firstChild.getAttribute(attr);
        if (value) block.setAttribute(attr, value);
      });
  }
  return [...firstChild.children];
}

const namedRow = (row, names) => row.children.length === 2
  && names.includes(row.children[0].textContent.trim());

/**
 * Splits a block's rows into its own fields (key-value rows named in `names`) and the rest
 * (the items of a container block): { cells: { name: valueCell }, rest: [rows] }.
 */
export function readBlockFields(rows, names) {
  const cells = {};
  const rest = [];
  rows.forEach((row) => {
    const [label, value] = row.children;
    if (namedRow(row, names)) cells[label.textContent.trim()] = value;
    else rest.push(row);
  });
  return { cells, rest };
}

/** An item's fields, one child per field in model order: { name: cell }. */
export function readItemFields(item, names) {
  const children = [...item.children];
  if (children.length && children.every((row) => namedRow(row, names))) {
    return readBlockFields(children, names).cells;
  }
  const cells = {};
  names.forEach((name, index) => { cells[name] = children[index]; });
  return cells;
}

export const text = (cell) => cell?.textContent.trim() || undefined;

/** A rich text cell's markup, without the editor attributes it carries. */
export function html(cell) {
  if (!cell) return undefined;
  const copy = cell.cloneNode(true);
  copy.querySelectorAll('*').forEach((el) => [...el.attributes]
    .filter(({ name }) => /^data-(aue|richtext)-/.test(name))
    .forEach(({ name }) => el.removeAttribute(name)));
  return copy.innerHTML.trim() || undefined;
}

export function href(cell) {
  if (!cell) return undefined;
  return (cell.querySelector('a')?.getAttribute('href') || cell.textContent || '').trim() || undefined;
}

export function imageSrc(cell) {
  const img = cell?.querySelector('img');
  if (img) return img.getAttribute('src');
  const url = href(cell);
  return url && /^(https?:\/\/|\/)/.test(url) ? url : undefined;
}

/** Joins the class values of style fields (each may hold several space-separated classes). */
export const classes = (...values) => values.filter(Boolean).join(' ') || undefined;

/** Moves a field's instrumentation from its authored cell onto the element that renders it. */
export function instrument(cell, target) {
  if (!cell || !target) return;
  const source = cell.querySelector('[data-aue-prop],[data-richtext-prop]') || cell;
  moveInstrumentation(source, target);
}

// Teaser-shaped fields shared by the teaser, card, hero and news blocks and their items.
export const TEASER_FIELDS = ['image', 'imageAlt', 'pretitle', 'title', 'description', 'date', 'actionText', 'actionUrl'];

/** aem-core-lib Teaser props from teaser-shaped cells. */
export function teaserProps(cells, idPrefix) {
  const id = uniqueId(idPrefix);
  const actionText = text(cells.actionText);
  return {
    id,
    imagePath: imageSrc(cells.image),
    pretitle: text(cells.pretitle),
    title: text(cells.title),
    description: html(cells.description),
    date: text(cells.date),
    imageLinkHidden: true,
    titleLinkHidden: true,
    actionsEnabled: !!actionText,
    actions: actionText
      ? [{ id: `${id}-action`, title: actionText, link: { url: href(cells.actionUrl) || '#', valid: true } }]
      : [],
  };
}

/** After a teaser-shaped render: the authored <picture>, alt text and in-place editing. */
export function finishTeaser(root, cells) {
  patchPicture(cells.image, root);
  const alt = text(cells.imageAlt);
  if (alt) root.querySelector('.cmp-image img')?.setAttribute('alt', alt);
  instrument(cells.pretitle, root.querySelector('.cmp-teaser__pretitle'));
  instrument(cells.title, root.querySelector('.cmp-teaser__title'));
  instrument(cells.description, root.querySelector('.cmp-teaser__description'));
  instrument(cells.actionText, root.querySelector('.cmp-teaser__action-link'));
  instrument(cells.image, root.querySelector('.cmp-image'));
}

/** aem-core-lib Image props from an image cell and its alt cell. */
export function imageProps(imageCell, altCell, idPrefix = 'image') {
  const id = uniqueId(idPrefix);
  return {
    id, uuid: id, src: imageSrc(imageCell) || '', alt: text(altCell) || '', ':type': 'image',
  };
}

/**
 * Navigation items (aem-core-lib INavigationChild) from an authored, possibly nested list:
 * <ul><li><a href="/x">X</a><ul>...</ul></li></ul>.
 */
export function navigationItems(cell, level = 0) {
  const list = cell?.querySelector(':scope > ul, :scope > ol') || (level === 0 ? cell?.querySelector('ul, ol') : null);
  if (!list) return [];
  return [...list.children].filter((li) => li.tagName === 'LI').map((li) => {
    const link = li.querySelector(':scope > a, :scope > p > a');
    const url = link?.getAttribute('href') || '';
    return {
      id: uniqueId('navigation-item'),
      path: url,
      link: { url, valid: !!url },
      title: (link?.textContent || li.firstChild?.textContent || '').trim(),
      description: '',
      level,
      active: false,
      current: false,
      children: navigationItems(li, level + 1),
      dataLayer: {},
      ':type': 'navigation-item',
    };
  });
}

/**
 * Calls a DS render function. A component wrapped in StyleWrapper comes back as a
 * DocumentFragment; `root` is its first element either way, `node` is what to append.
 */
export function render(component, props) {
  const node = component(props);
  const root = node instanceof DocumentFragment ? node.firstElementChild : node;
  return { node, root };
}

/** Replaces the block's authored content with the rendered component, under the brand class. */
export function replaceContent(block, ...rendered) {
  block.textContent = '';
  block.classList.add(BRAND_CLASS);
  block.append(...rendered);
}
