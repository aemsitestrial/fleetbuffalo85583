import AtlasCopcoDecorate from '../../ds-eds-assets/js/ac-core/container.js';
import { prepareNestedBlocks, loadNestedBlocks } from '../../scripts/nested-blocks.js';

/**
 * A Columns block with one cell, holding any number of blocks added with the add button. The nested
 * blocks are prepared first, then become the items of the container grid
 * (`aem-GridColumn aem-GridColumn--default--12`), and load last, in their final place.
 */
export default async function decorate(block) {
  // the name in the Universal Editor (Layers): AEM labels every block of the Columns resource "Columns"
  if (block.hasAttribute('data-aue-resource')) block.dataset.aueLabel = 'ac-container';
  const nested = await prepareNestedBlocks(block);
  AtlasCopcoDecorate(block);
  await loadNestedBlocks(nested);
}
