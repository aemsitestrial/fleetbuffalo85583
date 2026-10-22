import AtlasCopcoDecorate from '../../ds-eds-assets/js/ac-core/container.js';
import { loadNestedBlocks } from '../../scripts/nested-blocks.js';

/**
 * Built by scripts.js (buildSectionBlocks) from an "AC Container" section: renders the container, moves the
 * blocks of the section into its grid (each one an `aem-GridColumn aem-GridColumn--default--12` item) and
 * loads them.
 */
export default function decorate(block) {
  return AtlasCopcoDecorate(block, { loadBlocks: loadNestedBlocks });
}
