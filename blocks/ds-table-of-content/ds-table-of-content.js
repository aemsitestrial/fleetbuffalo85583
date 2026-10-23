import renderTableOfContent from '../../ds-eds-assets-ac/js/vendor/render-table-of-content.js';
import buildTocItems from '../../ds-eds-assets-ac/js/vendor/build-toc-items.js';
import { loadBundle, readFields, replaceContent } from '../../scripts/ds-blocks.js';

/** @param {HTMLElement} block */
export default function decorate(block) {
  loadBundle('ac-table-of-content');
  const f = readFields(block);
  const startLevel = f.text('startLevel') || 'h2';
  const stopLevel = f.text('stopLevel') || 'h3';
  // Lists the headings already in the page; headings that blocks render later are not seen.
  const items = buildTocItems(block.closest('main') || document.body, {
    startLevel, stopLevel, exclude: block,
  });
  const element = renderTableOfContent({
    content: { startLevel, stopLevel, items },
    options: f.options(['tocListType', 'spacingMy', 'spacingMb']),
    loadBundle,
  });
  replaceContent(block, f.wrapper, element);
}
