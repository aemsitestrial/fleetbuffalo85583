import { ProductTeaserCarousel } from '../../ds-eds-assets/js/dekker-product-teaser-carousel.js';
import {
  Carousel as CarouselController,
} from '../../ds-eds-assets/js/vendor/carousel-controller.js';
import {
  blockRows, readContainerFields, readItemFields, text, classes, teaserProps, finishTeaser,
  TEASER_FIELDS,
  moveInstrumentation, loadDekkerCss, render, replaceContent, uniqueId,
} from '../../ds-eds-tools/dekker-block.js';

// The controller of each rendered element, kept so it is not created twice for one element.
const controllers = new WeakMap();
/**
 * dekker-product-teaser-carousel -- renders dekker-lib's ProductTeaserCarousel from the design
 * system's compiled DOM build
 * (ds-eds-assets/js/dekker-product-teaser-carousel.js, package @ac-brandsframework/eds-assets-
 * dekker) with its CSS
 * (ds-eds-assets/css/bundles/dekker-product-teaser-carousel.css). Markup and look are the design
 * system's; this file only
 * reads the authored fields (_dekker-product-teaser-carousel.json) and maps them onto the
 * component's props.
 * One item per slide (teaser fields); highlight: a class from ds-eds-assets/js/options/product-
 * teaser.js
 * for every slide. Slide behaviour is the aem-core-lib CarouselController.
 */

export default function decorate(block) {
  loadDekkerCss('dekker-product-teaser-carousel');
  const { cells, rest } = readContainerFields(blockRows(block, { container: true }), ['autoplay', 'delay', 'highlight']);
  const slides = rest.map((item) => {
    const itemCells = readItemFields(item, TEASER_FIELDS);
    return { item, cells: itemCells, props: teaserProps(itemCells, 'slide') };
  });
  const delay = parseInt(text(cells.delay), 10);
  const { node, root } = render(ProductTeaserCarousel, {
    id: uniqueId('dekker-product-teaser-carousel'),
    typeCarousel: 'teaser',
    autoplay: text(cells.autoplay) === 'true',
    delay: Number.isNaN(delay) ? 5000 : delay,
    autopauseDisabled: false,
    controlsPrepended: false,
    className: 'ds-brand-product-teaser-carousel',
    classNameSlide: classes('ds-brand-product-teaser', text(cells.highlight)),
    ':itemsOrder': slides.map((s) => s.props.id),
    ':items': Object.fromEntries(slides.map((s) => [s.props.id, { ...s.props, 'cq:panelTitle': s.props.title || '' }])),
    ':type': 'carousel',
  });
  const slideEls = root.querySelectorAll('.cmp-carousel__item');
  slides.forEach((s, index) => {
    moveInstrumentation(s.item, slideEls[index]);
    finishTeaser(slideEls[index], s.cells);
  });
  replaceContent(block, node);
  const carouselEl = block.querySelector('.cmp-carousel');
  if (carouselEl && !controllers.has(carouselEl)) {
    const controller = new CarouselController({ el: carouselEl, bullets: true, controls: true });
    controllers.set(carouselEl, controller);
  }
}
