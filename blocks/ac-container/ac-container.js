import AtlasCopcoDecorate from '../../ds-eds-assets/js/ac-core/container.js';
import { prepareNestedBlocks, loadNestedBlocks } from '../../scripts/nested-blocks.js';

/**
 * Authored like the Columns block: rows of column cells, each cell holding default content or blocks.
 * Nested blocks are prepared first, the cells then move into the container markup, and the nested
 * blocks load last, inside their final place.
 */
export default async function decorate(block) {
  const nested = await prepareNestedBlocks(block);
  AtlasCopcoDecorate(block);
  await loadNestedBlocks(nested);
}
