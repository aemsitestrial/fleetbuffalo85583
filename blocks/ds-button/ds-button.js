import renderButton from '../../ds-eds-assets-ac/js/vendor/render-button.js';
import { loadBundle, readFields, replaceContent } from '../../scripts/ds-blocks.js';

/** @param {HTMLElement} block */
export default function decorate(block) {
  loadBundle('ac-button');
  const f = readFields(block);
  // link + linkText fold into one anchor
  const link = f.link('link');
  const element = renderButton({
    content: {
      text: link.text || f.text('linkText'),
      buttonLink: link.url ? { url: link.url } : undefined,
    },
    options: f.options([
      'linkTarget', 'buttonTheme', 'modifierVariant', 'buttonIcon', 'buttonIconPosition',
      'spacingMy', 'spacingMb',
    ]),
    editable: { text: f.attrs('link') },
    loadBundle,
  });
  replaceContent(block, f.wrapper, element);
}
