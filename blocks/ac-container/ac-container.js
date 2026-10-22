import AtlasCopcoDecorate from '../../ds-eds-assets/js/ac-core/container.js';
import { prepareNestedBlocks, loadNestedBlocks } from '../../scripts/nested-blocks.js';

// Names shown in the Universal Editor (Layers, selection). AEM labels every block of the Columns
// resource "Columns" and its cells "Column"; the editor reads the labels from the page, so they
// are set here.
const BLOCK_LABEL = 'ac-container';
const COLUMN_LABEL = 'ac-container-column';

/**
 * Authored like the Columns block: rows of column cells, each cell holding default content or blocks.
 * Nested blocks are prepared first, the cells then move into the container markup, and the nested
 * blocks load last, inside their final place.
 */
export default async function decorate(block) {
  if (block.hasAttribute('data-aue-resource')) block.dataset.aueLabel = BLOCK_LABEL;
  [...block.children]
    .flatMap((row) => [...row.children])
    .filter((cell) => cell.hasAttribute('data-aue-resource'))
    .forEach((cell) => { cell.dataset.aueLabel = COLUMN_LABEL; });

  const nested = await prepareNestedBlocks(block);
  AtlasCopcoDecorate(block);
  await loadNestedBlocks(nested);
}
