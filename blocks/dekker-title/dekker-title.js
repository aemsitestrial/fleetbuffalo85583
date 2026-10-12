import { Title } from '../../ds-eds-assets/js/dekker-title.js';
import {
  blockRows, readBlockFields, text, href, instrument, loadDekkerCss, render, replaceContent,
  uniqueId,
} from '../../ds-eds-tools/dekker-block.js';

/**
 * dekker-title -- renders dekker-lib's Title from the design system's compiled DOM build
 * (ds-eds-assets/js/dekker-title.js, package @ac-brandsframework/eds-assets-dekker) with its CSS
 * (ds-eds-assets/css/bundles/dekker-title.css). Markup and look are the design system's; this file
 * only reads the authored fields (_dekker-title.json) and maps them onto the component's props.
 *
 * Fields: text, type (h1-h6, default h2), linkUrl (optional; the text becomes a link) and
 * highlight (a class from ds-eds-assets/js/options/title.js, titleHighlight).
 */
const HEADING_TYPES = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

export default function decorate(block) {
  loadDekkerCss('dekker-title');
  const { cells } = readBlockFields(blockRows(block), ['text', 'type', 'linkUrl', 'highlight']);
  const type = text(cells.type);
  const linkUrl = href(cells.linkUrl);
  const { node, root } = render(Title, {
    id: uniqueId('dekker-title'),
    type: HEADING_TYPES.includes(type) ? type : 'h2',
    text: text(cells.text) || '',
    link: linkUrl ? { valid: true, url: linkUrl } : undefined,
    className: text(cells.highlight),
  });
  instrument(cells.text, root.querySelector('.cmp-title__text'));
  replaceContent(block, node);
}
