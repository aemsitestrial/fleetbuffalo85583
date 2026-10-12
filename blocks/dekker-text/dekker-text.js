import { Text } from '../../ds-eds-assets/js/dekker-text.js';
import {
  blockRows, readBlockFields, html, text, instrument, loadDekkerCss, render, replaceContent,
  uniqueId,
} from '../../ds-eds-tools/dekker-block.js';

/**
 * dekker-text -- renders dekker-lib's Text from the design system's compiled DOM build
 * (ds-eds-assets/js/dekker-text.js, package @ac-brandsframework/eds-assets-dekker) with its CSS
 * (ds-eds-assets/css/bundles/dekker-text.css). Markup and look are the design system's; this file
 * only
 * reads the authored fields (_dekker-text.json) and maps them onto the component's props.
 * variant: a class from ds-eds-assets/js/options/text.js (textVariant).
 */

export default function decorate(block) {
  loadDekkerCss('dekker-text');
  const { cells } = readBlockFields(blockRows(block), ['text', 'variant']);
  const { node, root } = render(Text, {
    id: uniqueId('dekker-text'),
    text: html(cells.text) || '',
    className: text(cells.variant),
  });
  instrument(cells.text, root.querySelector('.cmp-text'));
  replaceContent(block, node);
}
