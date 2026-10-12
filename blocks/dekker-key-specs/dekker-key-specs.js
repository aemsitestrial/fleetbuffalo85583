import { KeySpecs } from '../../ds-eds-assets/js/dekker-key-specs.js';
import {
  blockRows, readBlockFields, text, html, instrument, loadDekkerCss, render, replaceContent,
  uniqueId,
} from '../../ds-eds-tools/dekker-block.js';

/**
 * dekker-key-specs -- renders dekker-lib's KeySpecs from the design system's compiled DOM build
 * (ds-eds-assets/js/dekker-key-specs.js, package @ac-brandsframework/eds-assets-dekker) with its
 * CSS
 * (ds-eds-assets/css/bundles/dekker-key-specs.css). Markup and look are the design system's; this
 * file only
 * reads the authored fields (_dekker-key-specs.json) and maps them onto the component's props.
 */

export default function decorate(block) {
  loadDekkerCss('dekker-key-specs');
  const { cells } = readBlockFields(blockRows(block), ['title', 'text']);
  const { node, root } = render(KeySpecs, {
    id: uniqueId('dekker-key-specs'),
    title: text(cells.title) || '',
    text: html(cells.text) || '',
  });
  instrument(cells.title, root.querySelector('.cmp-title__text'));
  instrument(cells.text, root.querySelector('.cmp-text'));
  replaceContent(block, node);
}
