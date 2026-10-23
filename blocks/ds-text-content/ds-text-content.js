import renderTextContent from '../../ds-eds-assets-ac/js/vendor/render-text-content.js';
import {
  loadBundle, readFields, readTeaser, replaceContent,
} from '../../scripts/ds-blocks.js';

const OPTION_LISTS = [
  'textContentType', 'textContentModifier', 'themeType', 'headlineLineClamp', 'descriptionLineClamp', 'spacingMy', 'spacingMb',
];

/** @param {HTMLElement} block */
export default function decorate(block) {
  const f = readFields(block);
  const { content, editable } = readTeaser(f);
  // The wrapper loads the bundle of the chosen type itself.
  const element = renderTextContent({
    content,
    options: f.options(OPTION_LISTS),
    editable,
    loadBundle,
  });
  replaceContent(block, f.wrapper, element);
}
