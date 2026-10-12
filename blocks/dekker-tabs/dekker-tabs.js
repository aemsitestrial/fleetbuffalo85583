import { Tabs } from '../../ds-eds-assets/js/dekker-tabs.js';
import { Tab } from '../../ds-eds-assets/js/vendor/tabs-controller.js';
import {
  blockRows, readItemFields, text, html, instrument, moveInstrumentation,
  loadDekkerCss, render, replaceContent, uniqueId,
} from '../../ds-eds-tools/dekker-block.js';

// The controller of each rendered element, kept so it is not created twice for one element.
const controllers = new WeakMap();
/**
 * dekker-tabs -- renders dekker-lib's Tabs from the design system's compiled DOM build
 * (ds-eds-assets/js/dekker-tabs.js, package @ac-brandsframework/eds-assets-dekker) with its CSS
 * (ds-eds-assets/css/bundles/dekker-tabs.css). Markup and look are the design system's; this file
 * only
 * reads the authored fields (_dekker-tabs.json) and maps them onto the component's props.
 * One item per tab (title + rich text content). Switching is the aem-core-lib Tab controller
 * (ds-eds-assets/js/vendor/tabs-controller.js).
 */

export default function decorate(block) {
  loadDekkerCss('dekker-tabs');
  const items = blockRows(block, { container: true });
  const tabs = items.map((item) => ({ item, cells: readItemFields(item, ['title', 'content']), id: uniqueId('dekker-tab') }));
  const { node, root } = render(Tabs, {
    id: uniqueId('dekker-tabs'),
    activeItem: tabs[0]?.id,
    useResponsiveType: 'container',
    ':itemsOrder': tabs.map((t) => t.id),
    ':items': Object.fromEntries(tabs.map((t) => [t.id, {
      'cq:panelTitle': text(t.cells.title) || '',
      ':itemsOrder': ['text'],
      ':items': { text: { id: `${t.id}-text`, text: html(t.cells.content) || '', richText: true } },
      columnClassNames: {},
      gridClassNames: '',
      columnCount: 12,
      ':type': 'tab',
    }])),
    ':type': 'tabs',
    dataLayer: {},
  });
  const tabButtons = root.querySelectorAll('.cmp-tabs__tab');
  const panels = root.querySelectorAll('.cmp-tabs__tabpanel');
  tabs.forEach((t, index) => {
    moveInstrumentation(t.item, panels[index]);
    instrument(t.cells.title, tabButtons[index]);
    instrument(t.cells.content, panels[index]?.querySelector('.cmp-text'));
  });
  replaceContent(block, node);
  const tabsEl = block.querySelector('.tabs');
  if (tabsEl && !controllers.has(tabsEl)) controllers.set(tabsEl, new Tab({ el: tabsEl }));
}
