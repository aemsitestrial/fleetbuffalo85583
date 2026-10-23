import renderTable from '../../ds-eds-assets-ac/js/vendor/render-table.js';
import { loadBundle, readFields, replaceContent } from '../../scripts/ds-blocks.js';

/** @param {HTMLElement} block */
export default function decorate(block) {
  loadBundle('ac-table');
  const f = readFields(block);
  const element = renderTable({
    content: { text: f.html('text') },
    options: f.options(['themeType', 'spacingMy', 'spacingMb']),
    editable: { text: f.attrs('text') },
    loadBundle,
  });
  replaceContent(block, f.wrapper, element);
}
