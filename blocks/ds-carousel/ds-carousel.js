import renderCarousel, { startCarousel } from '../../ds-eds-assets-ac/js/vendor/render-carousel.js';
import { spacingMy, spacingMb } from '../../ds-eds-assets-ac/options/common.js';
import { carouselItemType, carouselTheme } from '../../ds-eds-assets-ac/options/carousel.js';
import {
  loadBundle, replaceContent, readTeaserItems, takeClassOptions, whenShown,
} from '../../scripts/ds-blocks.js';

/** @param {HTMLElement} block */
export default function decorate(block) {
  loadBundle('ac-carousel');
  loadBundle('ac-carousel-item');
  const options = takeClassOptions(block, {
    carouselItemType, carouselTheme, spacingMy, spacingMb,
  });
  const { items, editable } = readTeaserItems(block);
  const element = renderCarousel({
    content: { items },
    options,
    editable,
    loadBundle,
  });
  replaceContent(block, null, element);
  // The slide controls read the layout, so they start once the section is visible.
  whenShown(block, () => startCarousel(element));
}
