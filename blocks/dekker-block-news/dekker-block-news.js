import {
  SplideCarouselController, responsiveSlidesThree,
} from '../../ds-eds-assets/js/vendor/splide-carousel-controller.js';
import { text } from '../../ds-eds-tools/dekker-block.js';
import decorateComposite from '../../ds-eds-tools/dekker-composite.js';

/**
 * dekker-block-news -- dekker-lib's BlockNews structure (ds-eds-assets/js/dekker-block-
 * news.layout.js)
 * filled with the block's items: a Title (the heading), a Button (the link) and News Cards (the
 * carousel). Block field: background, a class from ds-eds-assets/js/options/block-news.js. The
 * cards
 * slide with the aem-core-lib SplideCarouselController, set up as in the dekker-lib runControllers.
 * See ds-eds-tools/dekker-composite.js.
 */
export default async function decorate(block) {
  await decorateComposite(block, {
    name: 'dekker-block-news',
    component: 'BlockNews',
    blockFields: ['background'],
    slots: { Title: 'title', Button: 'button', NewsCard: 'news-card' },
    layoutProps: (items, cells) => ({
      heading: items.title ? 'heading' : undefined,
      link: items.button ? 'link' : undefined,
      items: (items['news-card'] || []).map((item, index) => ({ id: `news-card-${index}` })),
      className: text(cells.background),
    }),
    after: () => new SplideCarouselController('ds-splide-carousel-news', {
      perPage: 3, type: 'slide', breakpoints: responsiveSlidesThree, arrows: false,
    }).init(),
  });
}
