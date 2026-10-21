import { decorateBlock, loadBlock } from './aem.js';
import { moveAttributes } from './scripts.js';

let modelsPromise;

/** component-models.json is served from the code bus; fetched once and only when needed. */
function getModels() {
  if (!modelsPromise) {
    modelsPromise = fetch(`${window.hlx.codeBasePath}/component-models.json`)
      .then((resp) => (resp.ok ? resp.json() : []))
      .catch(() => []);
  }
  return modelsPromise;
}

/**
 * Blocks authored inside a column cell (e.g. ac-* components) sit below the
 * `div.section > div > div` level that decorateBlocks() handles. Find the
 * outermost classed <div> in each cell, however deep the cell nests it.
 */
export function findNestedBlocks(block) {
  return [...block.children]
    .flatMap((row) => [...row.children])
    .flatMap((cell) => [...cell.querySelectorAll('div[class]')].filter((el) => {
      const outer = el.parentElement.closest('div[class]');
      return !el.dataset.blockStatus && (!outer || outer === cell || !cell.contains(outer));
    }));
}

/**
 * ac-* blocks read their fields from `[field name | value]` rows. If a nested
 * block arrives with value-only rows (one row per model field, in model order),
 * add the field-name cell so the block can read it.
 */
async function ensureKeyValueRows(nested) {
  const name = nested.classList[0];
  let rows = [...nested.children];
  // Universal Editor can wrap the rows of a key-value block in one instrumented element
  if (rows.length === 1 && rows[0].hasAttribute('data-aue-resource') && rows[0].children.length) {
    rows = [...rows[0].children];
  }
  if (!rows.length || rows.every((row) => row.children.length === 2)) return;
  if (!rows.every((row) => row.children.length <= 1)) {
    console.debug(`nested-blocks: unexpected row structure in nested "${name}"`, nested.outerHTML);
    return;
  }

  const models = await getModels();
  const model = models.find((m) => m.id === (nested.dataset.aueModel || name));
  const fields = (model?.fields || [])
    .filter((f) => f.name && f.name !== 'classes' && !['tab', 'container'].includes(f.component));
  if (fields.length !== rows.length) {
    console.warn(`nested-blocks: nested "${name}" has ${rows.length} rows, model has ${fields.length} fields; left as is`, nested.outerHTML);
    return;
  }

  rows.forEach((row, i) => {
    if (!row.firstElementChild) row.append(document.createElement('div'));
    const key = document.createElement('div');
    key.textContent = fields[i].name;
    row.prepend(key);
  });
}

/**
 * A block authored in a column can arrive wrapped in a <p> (a block inside a paragraph is
 * invalid HTML and breaks the layout). Replace each such <p> with a <div>, keeping its content
 * and attributes (Universal Editor instrumentation included).
 */
function unwrapParagraphs(nested) {
  nested.forEach((el) => {
    const p = el.parentElement;
    if (p?.tagName !== 'P') return;
    const div = document.createElement('div');
    moveAttributes(p, div);
    div.append(...p.childNodes);
    p.replaceWith(div);
  });
}

/**
 * Prepares the blocks nested in the column cells of `block` (key-value rows, block classes) without
 * loading them. Returns them, to be passed to `loadNestedBlocks` once the parent has its final DOM.
 */
export async function prepareNestedBlocks(block) {
  const nested = findNestedBlocks(block);
  unwrapParagraphs(nested);
  await Promise.all(nested.map(ensureKeyValueRows));
  nested.forEach(decorateBlock);
  return nested;
}

/** Loads (JS + CSS) the blocks returned by `prepareNestedBlocks`. */
export function loadNestedBlocks(nested) {
  return Promise.all(nested.map((el) => loadBlock(el)));
}
