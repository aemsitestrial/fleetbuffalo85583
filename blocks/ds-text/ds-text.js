import renderText from '../../ds-eds-assets-ac/js/vendor/render-text.js';
import { loadBundle, readFields, replaceContent } from '../../scripts/ds-blocks.js';

/** @param {HTMLElement} block */
export default function decorate(block) {
  loadBundle('ac-text');
  const f = readFields(block);
  const element = renderText({
    content: { text: f.html('text') },
    options: f.options([
      'textIcon', 'themeType', 'textContentAlignment', 'textLargeSize', 'spacingMy', 'spacingMb',
    ]),
    editable: { text: f.attrs('text') },
    loadBundle,
  });
  replaceContent(block, f.wrapper, element);
}
