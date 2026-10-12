import { Search } from '../../ds-eds-assets/js/dekker-search.js';
import {
  blockRows, readBlockFields, text, href, loadDekkerCss, render, replaceContent, uniqueId,
} from '../../ds-eds-tools/dekker-block.js';

/**
 * dekker-search -- renders dekker-lib's Search from the design system's compiled DOM build
 * (ds-eds-assets/js/dekker-search.js, package @ac-brandsframework/eds-assets-dekker) with its CSS
 * (ds-eds-assets/css/bundles/dekker-search.css). Markup and look are the design system's; this file
 * only
 * reads the authored fields (_dekker-search.json) and maps them onto the component's props.
 * The form sends `search_query` to the authored search page.
 */

export default function decorate(block) {
  loadDekkerCss('dekker-search');
  const { cells } = readBlockFields(blockRows(block), ['action', 'placeholder']);
  const { node } = render(Search, {
    id: uniqueId('dekker-search'),
    action: href(cells.action) || '/search',
    placeholder: text(cells.placeholder),
  });
  replaceContent(block, node);
}
