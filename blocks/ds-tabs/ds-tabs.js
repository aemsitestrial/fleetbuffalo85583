import renderTabs, { startResponsiveTabs } from '../../ds-eds-assets-ac/js/vendor/render-tabs.js';
import { spacingMy, spacingMb, themeType } from '../../ds-eds-assets-ac/options/common.js';
import { tabsLayout } from '../../ds-eds-assets-ac/options/tabs.js';
import {
  loadBundle, readPanelItems, takeClassOptions, takeFlag, whenShown,
} from '../../scripts/ds-blocks.js';

/** @param {HTMLElement} block */
export default function decorate(block) {
  loadBundle('ac-tabs');
  loadBundle('ac-tabs-item');
  const options = takeClassOptions(block, {
    themeType, tabsLayout, spacingMy, spacingMb,
  });
  const useResponsiveSelect = !takeFlag(block, 'ds-no-responsive-select');
  const { items, editable } = readPanelItems(block);
  const element = renderTabs({
    content: { items, useResponsiveSelect },
    options,
    editable,
  });
  block.replaceChildren(element);
  // The responsive dropdown measures the tabs, so it starts once the section is visible.
  if (useResponsiveSelect) whenShown(block, () => startResponsiveTabs(element));
}
