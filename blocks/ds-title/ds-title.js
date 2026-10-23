import renderTitle from '../../ds-eds-assets-ac/js/vendor/render-title.js';
import { loadBundle, readFields, replaceContent } from '../../scripts/ds-blocks.js';

/** @param {HTMLElement} block */
export default function decorate(block) {
  loadBundle('ac-title');
  const f = readFields(block);
  const { url } = f.link('link');
  const element = renderTitle({
    content: { text: f.text('title'), link: url ? { url } : undefined },
    options: {
      // title + titleType fold into one heading, so the level is its tag
      headingTag: f.heading('title') || f.text('titleType'),
      ...f.options(['themeType', 'spacingMy', 'spacingMb']),
    },
    editable: { text: f.attrs('title') },
    loadBundle,
  });
  replaceContent(block, f.wrapper, element);
}
