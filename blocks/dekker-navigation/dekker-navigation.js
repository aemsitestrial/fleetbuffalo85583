import { Navigation } from '../../ds-eds-assets/js/dekker-navigation.js';
import {
  blockRows, readBlockFields, navigationItems, instrument, loadDekkerCss, render, replaceContent,
  uniqueId,
} from '../../ds-eds-tools/dekker-block.js';

/**
 * dekker-navigation -- renders dekker-lib's Navigation from the design system's compiled DOM build
 * (ds-eds-assets/js/dekker-navigation.js, package @ac-brandsframework/eds-assets-dekker) with its
 * CSS
 * (ds-eds-assets/css/bundles/dekker-navigation.css). Markup and look are the design system's; this
 * file only
 * reads the authored fields (_dekker-navigation.json) and maps them onto the component's props.
 * The links are authored as a (nested) list in a rich text field.
 */

export default function decorate(block) {
  loadDekkerCss('dekker-navigation');
  const { cells } = readBlockFields(blockRows(block), ['items']);
  const { node, root } = render(Navigation, {
    id: uniqueId('dekker-navigation'),
    items: navigationItems(cells.items),
    dataLayer: {},
    ':type': 'navigation',
  });
  instrument(cells.items, root.querySelector('.cmp-navigation') || root);
  replaceContent(block, node);
}
