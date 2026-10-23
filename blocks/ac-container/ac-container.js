import AtlasCopcoDecorate from '../../ds-eds-assets/js/ac-core/container.js';
import { loadFragment } from '../fragment/fragment.js';

// Classes of every item in the container's aem-Grid.
const GRID_ITEM = ['aem-GridColumn', 'aem-GridColumn--default--12'];

/** The fragment path from the block's `fragment` row (a link, or plain text). */
function fragmentPath(block) {
  const rows = [...block.querySelectorAll(':scope > div, :scope > div > div')]
    .filter((row) => row.children.length === 2);
  const row = rows.find((r) => r.firstElementChild.textContent.trim() === 'fragment');
  const cell = row?.children[1];
  const link = cell?.querySelector('a');
  return (link ? link.getAttribute('href') : cell?.textContent.trim()) || '';
}

/**
 * AC Container: renders the container from the block fields, then loads the fragment page linked in its
 * "Content" field and moves the fragment's blocks and default content into it. With the AEM grid every
 * item is a grid column (aem-Grid > `aem-GridColumn aem-GridColumn--default--12`); without it the items
 * go right into cmp-container. (Blocks cannot be nested in a block on published pages, so the content
 * comes from a fragment.)
 */
export default async function decorate(block) {
  const path = fragmentPath(block);
  AtlasCopcoDecorate(block);

  const fragment = path ? await loadFragment(path) : null;
  if (!fragment) return;
  const grid = block.querySelector(':scope > .cmp-container > .aem-Grid');
  const holder = grid ?? block.querySelector(':scope > .cmp-container');
  if (!holder) return;
  // every section of the fragment: its blocks (one element each once loaded) and default content wrappers
  const items = [...fragment.querySelectorAll(':scope > .section')].flatMap((section) => [...section.children]);
  items.forEach((item) => {
    if (grid) item.classList.add(...GRID_ITEM);
    holder.append(item);
  });
}
