import renderSeparator from '../../ds-eds-assets-ac/js/vendor/render-separator.js';
import { loadBundle, readFields, replaceContent } from '../../scripts/ds-blocks.js';

/** @param {HTMLElement} block */
export default function decorate(block) {
  loadBundle('ac-separator');
  const f = readFields(block);
  const element = renderSeparator({
    content: { isDecorative: f.bool('isDecorative') },
    options: f.options(['separatorTheme', 'spacingMy', 'spacingMb']),
    loadBundle,
  });
  replaceContent(block, f.wrapper, element);
}
