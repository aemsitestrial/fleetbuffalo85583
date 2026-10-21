import AtlasCopcoDecorate from '../../ds-eds-assets/js/ac-core/content-with-splide-carousel-expand.js';
import { loadNestedBlocks } from '../../scripts/nested-blocks.js';

/**
 * Built by scripts.js (buildSectionBlocks) from a section of this type: renders the component, moves the
 * blocks of the section into it and loads them before the component's controllers start.
 */
export default function decorate(block) {
  return AtlasCopcoDecorate(block, { loadBlocks: loadNestedBlocks });
}
