import renderAccordion from '../../ds-eds-assets-ac/js/vendor/render-accordion.js';
import { spacingMy, spacingMb } from '../../ds-eds-assets-ac/options/common.js';
import {
  loadBundle, readPanelItems, takeClassOptions, takeFlag,
} from '../../scripts/ds-blocks.js';

/** @param {HTMLElement} block */
export default function decorate(block) {
  loadBundle('ac-accordion');
  loadBundle('ac-accordion-item');
  const options = takeClassOptions(block, { spacingMy, spacingMb });
  const singleExpansion = !takeFlag(block, 'ds-multiple-expansion');
  const { items, editable } = readPanelItems(block);
  block.replaceChildren(renderAccordion({
    content: { items, singleExpansion },
    options,
    editable,
  }));
}
