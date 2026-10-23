import renderImage from '../../ds-eds-assets-ac/js/vendor/render-image.js';
import { loadBundle, readFields, replaceContent } from '../../scripts/ds-blocks.js';

/** @param {HTMLElement} block */
export default function decorate(block) {
  loadBundle('ac-image');
  const f = readFields(block);
  const image = f.image('image');
  const element = renderImage({
    content: { src: image.src, alt: image.alt || f.text('imageAlt') },
    options: f.options(['spacingMy', 'spacingMb']),
    editable: { src: f.attrs('image') },
    loadBundle,
  });
  replaceContent(block, f.wrapper, element);
}
