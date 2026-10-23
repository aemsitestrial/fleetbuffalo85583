import renderSplideCarousel, { startSplideCarousel } from '../../ds-eds-assets-ac/js/vendor/render-splide-carousel.js';
import { spacingMy, spacingMb } from '../../ds-eds-assets-ac/options/common.js';
import { splideCarouselItemType } from '../../ds-eds-assets-ac/options/splide-carousel.js';
import {
  loadBundle, readTeaserItems, takeClassOptions, whenShown,
} from '../../scripts/ds-blocks.js';

// Named ds-slider, not ds-splide-carousel: the package's CSS already styles .ds-splide-carousel.
/** @param {HTMLElement} block */
export default function decorate(block) {
  loadBundle('ac-splide-carousel');
  loadBundle('ac-splide-carousel-item');
  const options = takeClassOptions(block, { splideCarouselItemType, spacingMy, spacingMb });
  const { items, editable } = readTeaserItems(block);
  const element = renderSplideCarousel({
    content: { items },
    options,
    editable,
    loadBundle,
  });
  block.replaceChildren(element);
  // Splide measures the slides, so it starts once the section is visible.
  whenShown(block, () => startSplideCarousel(element));
}
