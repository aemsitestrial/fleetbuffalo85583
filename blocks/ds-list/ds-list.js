import renderList from '../../ds-eds-assets-ac/js/vendor/render-list.js';
import { spacingMy, spacingMb, themeType } from '../../ds-eds-assets-ac/options/common.js';
import { listItemType, listGridRows } from '../../ds-eds-assets-ac/options/list.js';
import {
  loadBundle, readTeaserItems, takeClassOptions,
} from '../../scripts/ds-blocks.js';

/** @param {HTMLElement} block */
export default function decorate(block) {
  loadBundle('ac-list');
  loadBundle('ac-list-item');
  const options = takeClassOptions(block, {
    themeType, listItemType, listGridRows, spacingMy, spacingMb,
  });
  const { items, editable } = readTeaserItems(block, ['itemStyle']);
  // The wrapper loads the bundles of the chosen item styles itself.
  block.replaceChildren(renderList({
    content: { items },
    options,
    editable,
    loadBundle,
  }));
}
