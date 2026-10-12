import { Button } from '../../ds-eds-assets/js/dekker-button.js';
import {
  blockRows, readBlockFields, text, href, classes, instrument, loadDekkerCss, render,
  replaceContent, uniqueId,
} from '../../ds-eds-tools/dekker-block.js';

/**
 * dekker-button -- renders dekker-lib's Button from the design system's compiled DOM build
 * (ds-eds-assets/js/dekker-button.js, package @ac-brandsframework/eds-assets-dekker) with its CSS
 * (ds-eds-assets/css/bundles/dekker-button.css). Markup and look are the design system's; this file
 * only
 * reads the authored fields (_dekker-button.json) and maps them onto the component's props.
 * type is the base button prop (primary, secondary, tetriary); size and fontWeight are classes
 * from ds-eds-assets/js/options/button.js.
 */

export default function decorate(block) {
  loadDekkerCss('dekker-button');
  const { cells } = readBlockFields(blockRows(block), ['text', 'linkUrl', 'target', 'type', 'size', 'fontWeight']);
  const url = href(cells.linkUrl);
  const { node, root } = render(Button, {
    id: uniqueId('dekker-button'),
    text: text(cells.text) || '',
    type: text(cells.type) || 'primary',
    target: text(cells.target) || '_self',
    buttonLink: url ? { url, valid: true } : undefined,
    className: classes(text(cells.size), text(cells.fontWeight)),
  });
  instrument(cells.text, root.querySelector('.cmp-button__text') || root.querySelector('.cmp-button'));
  replaceContent(block, node);
}
