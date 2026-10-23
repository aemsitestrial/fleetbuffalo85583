import renderAccordion from '../../ds-eds-assets-ac/js/vendor/render-accordion.js';
import { spacingMy, spacingMb } from '../../ds-eds-assets-ac/options/common.js';
import {
  loadBundle, replaceContent, readPanelItems, takeClassOptions, takeFlag,
} from '../../scripts/ds-blocks.js';

/** @param {HTMLElement} block */
export default function decorate(block) {
  loadBundle('ac-accordion');
  loadBundle('ac-accordion-item');
  const options = takeClassOptions(block, { spacingMy, spacingMb });
  const singleExpansion = !takeFlag(block, 'ds-multiple-expansion');
  const { items, editable } = readPanelItems(block);
  const element = renderAccordion({
    content: { items, singleExpansion },
    options,
    editable,
  });
  // The old ac-accordion's controller binds every .cmp-accordion on the page; this class is its
  // "already initialised" guard, so it leaves this accordion to its own behaviour.
  [element, ...element.querySelectorAll('.cmp-accordion')]
    .filter((el) => el.matches('.cmp-accordion'))
    .forEach((el) => el.classList.add('accordion--initialized'));
  replaceContent(block, null, element);
}
