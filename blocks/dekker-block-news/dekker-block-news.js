import { BlockNews } from '../../ds-eds-assets/js/dekker-block-news.js';
import {
  SplideCarouselController, responsiveSlidesThree,
} from '../../ds-eds-assets/js/vendor/splide-carousel-controller.js';
import {
  blockRows, readBlockFields, readItemFields, text, teaserProps, finishTeaser, TEASER_FIELDS,
  moveInstrumentation, loadDekkerCss, render, replaceContent,
} from '../../ds-eds-tools/dekker-block.js';

/**
 * dekker-block-news -- renders dekker-lib's BlockNews from the design system's compiled DOM build
 * (ds-eds-assets/js/dekker-block-news.js, package @ac-brandsframework/eds-assets-dekker) with its
 * CSS
 * (ds-eds-assets/css/bundles/dekker-block-news.css). Markup and look are the design system's; this
 * file only
 * reads the authored fields (_dekker-block-news.json) and maps them onto the component's props.
 * Block fields: heading, linkText, background (a class from ds-eds-assets/js/options/block-
 * news.js).
 * One item per news card; highlight: a class from options/news-card.js. The cards slide with
 * the aem-core-lib SplideCarouselController, set up as in the dekker-lib runControllers.
 * Note: the dekker-lib BlockNews shows the title "Latest News" whenever a heading is set, and its
 * link button has text only (no URL) -- that is the behaviour of the component itself.
 */

const HIGHLIGHT_PREFIX = 'ds-brand-news-card--highlight-';

export default function decorate(block) {
  loadDekkerCss('dekker-block-news');
  const { cells, rest } = readBlockFields(blockRows(block, { container: true }), ['heading', 'linkText', 'background']);
  const cards = rest.map((item) => {
    const itemCells = readItemFields(item, [...TEASER_FIELDS, 'highlight']);
    // BlockNews sets each card's className itself, so the highlight goes in as the card's prop.
    const highlight = text(itemCells.highlight)?.replace(HIGHLIGHT_PREFIX, '');
    return { item, cells: itemCells, props: { ...teaserProps(itemCells, 'dekker-news'), highlight } };
  });
  const { node, root } = render(BlockNews, {
    heading: text(cells.heading),
    link: text(cells.linkText),
    items: cards.map((c) => c.props),
    className: text(cells.background),
  });
  const cardEls = root.querySelectorAll('.ds-brand-news-card');
  cards.forEach((c, index) => {
    moveInstrumentation(c.item, cardEls[index]);
    finishTeaser(cardEls[index], c.cells);
  });
  replaceContent(block, node);
  new SplideCarouselController('ds-splide-carousel-news', {
    perPage: 3, type: 'slide', breakpoints: responsiveSlidesThree, arrows: false,
  }).init();
}
