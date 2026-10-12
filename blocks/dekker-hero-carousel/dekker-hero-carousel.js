import { Carousel } from '../../ds-eds-assets/js/dekker-hero-carousel.js';
import {
  Carousel as CarouselController,
} from '../../ds-eds-assets/js/vendor/carousel-controller.js';
import {
  blockRows, readBlockFields, readItemFields, text, teaserProps, finishTeaser, TEASER_FIELDS,
  moveInstrumentation, loadDekkerCss, render, replaceContent, uniqueId,
} from '../../ds-eds-tools/dekker-block.js';

// The controller of each rendered element, kept so it is not created twice for one element.
const controllers = new WeakMap();
/**
 * dekker-hero-carousel -- renders dekker-lib's Carousel from the design system's compiled DOM build
 * (ds-eds-assets/js/dekker-hero-carousel.js, package @ac-brandsframework/eds-assets-dekker) with
 * its CSS
 * (ds-eds-assets/css/bundles/dekker-hero-carousel.css). Markup and look are the design system's;
 * this file only
 * reads the authored fields (_dekker-hero-carousel.json) and maps them onto the component's props.
 * One item per slide (teaser fields). Slide behaviour is the aem-core-lib CarouselController
 * (ds-eds-assets/js/vendor/carousel-controller.js).
 */

export default function decorate(block) {
  loadDekkerCss('dekker-hero-carousel');
  const { cells, rest } = readBlockFields(blockRows(block, { container: true }), ['autoplay', 'delay']);
  const slides = rest.map((item) => {
    const itemCells = readItemFields(item, TEASER_FIELDS);
    return { item, cells: itemCells, props: teaserProps(itemCells, 'slide') };
  });
  const delay = parseInt(text(cells.delay), 10);
  const { node, root } = render(Carousel, {
    id: uniqueId('dekker-hero-carousel'),
    typeCarousel: 'hero-teaser',
    autoplay: text(cells.autoplay) === 'true',
    delay: Number.isNaN(delay) ? 5000 : delay,
    autopauseDisabled: false,
    controlsPrepended: false,
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
