import { BlockProducts } from '../../ds-eds-assets/js/dekker-block-products.js';
import {
  SplideCarouselController, responsiveSlidesThree,
} from '../../ds-eds-assets/js/vendor/splide-carousel-controller.js';
import {
  blockRows, readBlockFields, readItemFields, text, html, teaserProps, finishTeaser, TEASER_FIELDS,
  moveInstrumentation, loadDekkerCss, render, replaceContent,
} from '../../ds-eds-tools/dekker-block.js';

/**
 * dekker-block-products -- renders dekker-lib's BlockProducts from the design system's compiled DOM
 * build
 * (ds-eds-assets/js/dekker-block-products.js, package @ac-brandsframework/eds-assets-dekker) with
 * its CSS
 * (ds-eds-assets/css/bundles/dekker-block-products.css). Markup and look are the design system's;
 * this file only
 * reads the authored fields (_dekker-block-products.json) and maps them onto the component's props.
 * Block fields: heading, text, background (a class from ds-eds-assets/js/options/block-
 * products.js).
 * One item per product card (always the extended card); shadow from options/product-card.js. The
 * cards slide with the aem-core-lib SplideCarouselController.
 */

export default function decorate(block) {
  loadDekkerCss('dekker-block-products');
  const { cells, rest } = readBlockFields(blockRows(block, { container: true }), ['heading', 'text', 'background']);
  const cards = rest.map((item) => {
    const itemCells = readItemFields(item, [...TEASER_FIELDS, 'shadow']);
    // BlockProducts sets each card's className itself, so the shadow goes in as the card's prop.
    return {
      item, cells: itemCells, props: { ...teaserProps(itemCells, 'dekker-product'), modifierShadow: !!text(itemCells.shadow) },
    };
  });
  const { node, root } = render(BlockProducts, {
    heading: text(cells.heading),
    text: html(cells.text),
    items: cards.map((c) => c.props),
    className: text(cells.background),
  });
  const cardEls = root.querySelectorAll('.ds-brand-product-card');
  cards.forEach((c, index) => {
    moveInstrumentation(c.item, cardEls[index]);
    finishTeaser(cardEls[index], c.cells);
  });
  replaceContent(block, node);
  new SplideCarouselController('ds-splide-carousel-products', {
    perPage: 3, type: 'slide', breakpoints: responsiveSlidesThree, arrows: false,
  }).init();
}
