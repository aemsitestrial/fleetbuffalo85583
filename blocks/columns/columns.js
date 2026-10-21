import { decorateBlock, loadBlock } from '../../scripts/aem.js';

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
function findNestedBlocks(block) {
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
    console.debug(`columns: unexpected row structure in nested "${name}"`, nested.outerHTML);
    return;
  }

  const models = await getModels();
  const model = models.find((m) => m.id === (nested.dataset.aueModel || name));
  const fields = (model?.fields || [])
    .filter((f) => f.name && f.name !== 'classes' && !['tab', 'container'].includes(f.component));
  if (fields.length !== rows.length) {
    console.warn(`columns: nested "${name}" has ${rows.length} rows, model has ${fields.length} fields; left as is`, nested.outerHTML);
    return;
  }

  rows.forEach((row, i) => {
    if (!row.firstElementChild) row.append(document.createElement('div'));
    const key = document.createElement('div');
    key.textContent = fields[i].name;
    row.prepend(key);
  });
}

export default async function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);

  // nested blocks first, so the image-column logic below doesn't touch their inner cells
  const nested = findNestedBlocks(block);
  await Promise.all(nested.map(ensureKeyValueRows));
  nested.forEach(decorateBlock);

  // setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      if (nested.some((el) => col.contains(el))) return;
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          // picture is only content in column
          picWrapper.classList.add('columns-img-col');
        }
      }
    });
  });

  await Promise.all(nested.map((el) => loadBlock(el)));
}
