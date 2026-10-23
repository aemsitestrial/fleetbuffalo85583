import renderCard from '../../ds-eds-assets-ac/js/vendor/render-card.js';
import {
  loadBundle, readFields, readTeaser, replaceContent,
} from '../../scripts/ds-blocks.js';

const OPTION_LISTS = [
  'themeType', 'cardType', 'cardContentModifier', 'cardImageCroppingType', 'cardAemModifier', 'cardFeatureModifier', 'cardIconVariant', 'cardIconType', 'modifierVariant', 'cardAction', 'headlineLineClamp', 'descriptionLineClamp', 'spacingMy', 'spacingMb',
];

/** @param {HTMLElement} block */
export default function decorate(block) {
  loadBundle('ac-card');
  const f = readFields(block);
  const { content, editable } = readTeaser(f);
  // The wrapper loads the bundle of the chosen type itself.
  const element = renderCard({
    content,
    options: f.options(OPTION_LISTS),
    editable,
    loadBundle,
  });
  replaceContent(block, f.wrapper, element);
}
