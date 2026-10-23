import renderEmbedIframe from '../../ds-eds-assets-ac/js/vendor/render-embed-iframe.js';
import { loadBundle, readFields, replaceContent } from '../../scripts/ds-blocks.js';

/** @param {HTMLElement} block */
export default function decorate(block) {
  loadBundle('ac-embed-iframe');
  const f = readFields(block);
  // Returns undefined for an address the frame may not load; the block is then left empty.
  const element = renderEmbedIframe({
    content: {
      src: f.link('src').url,
      title: f.text('title'),
      width: f.text('width'),
      height: f.text('height'),
    },
    options: f.options(['spacingMy', 'spacingMb']),
    loadBundle,
  });
  replaceContent(block, f.wrapper, element);
}
