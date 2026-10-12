import { Hero } from '../../ds-eds-assets/js/dekker-hero.js';
import {
  blockRows, readBlockFields, text, imageSrc, teaserProps, finishTeaser, TEASER_FIELDS,
  instrument, loadDekkerCss, render, replaceContent,
} from '../../ds-eds-tools/dekker-block.js';

/**
 * dekker-hero -- renders dekker-lib's Hero from the design system's compiled DOM build
 * (ds-eds-assets/js/dekker-hero.js, package @ac-brandsframework/eds-assets-dekker) with its CSS
 * (ds-eds-assets/css/bundles/dekker-hero.css). Markup and look are the design system's; this file
 * only
 * reads the authored fields (_dekker-hero.json) and maps them onto the component's props.
 * backgroundImage is the background of the hero; heroVariant: a class from
 * ds-eds-assets/js/options/hero.js.
 */

export default function decorate(block) {
  loadDekkerCss('dekker-hero');
  const { cells } = readBlockFields(blockRows(block), ['backgroundImage', ...TEASER_FIELDS, 'heroVariant']);
  const { node, root } = render(Hero, {
    ...teaserProps(cells, 'dekker-hero'),
    bgImageSrc: imageSrc(cells.backgroundImage),
    className: text(cells.heroVariant),
  });
  finishTeaser(root, cells);
  instrument(cells.backgroundImage, root);
  replaceContent(block, node);
}
