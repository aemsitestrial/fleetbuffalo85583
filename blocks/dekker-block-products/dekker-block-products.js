import {
  SplideCarouselController, responsiveSlidesThree,
} from '../../ds-eds-assets/js/vendor/splide-carousel-controller.js';
import { text } from '../../ds-eds-tools/dekker-block.js';
import decorateComposite from '../../ds-eds-tools/dekker-composite.js';

/**
 * dekker-block-products -- dekker-lib's BlockProducts structure
 * (ds-eds-assets/js/dekker-block-products.layout.js) filled with the block's items: a Title (the
 * heading), a Text and Product Cards (the carousel; BlockProducts makes each one the extended card
 * with a shadow). Block field: background, a class from ds-eds-assets/js/options/block-products.js.
 * The cards slide with the aem-core-lib SplideCarouselController. See ds-eds-tools/dekker-
 * composite.js.
 */
export default async function decorate(block) {
  await decorateComposite(block, {
    name: 'dekker-block-products',
    component: 'BlockProducts',
    blockFields: ['background'],
    slots: { Title: 'title', Text: 'text', ProductCard: 'product-card' },
    layoutProps: (items, cells) => ({
      heading: items.title ? 'heading' : undefined,
      text: items.text ? 'text' : undefined,
      items: (items['product-card'] || []).map((item, index) => ({ id: `product-card-${index}` })),
      className: text(cells.background),
    }),
    after: () => new SplideCarouselController('ds-splide-carousel-products', {
      perPage: 3, type: 'slide', breakpoints: responsiveSlidesThree, arrows: false,
    }).init(),
  });
}
