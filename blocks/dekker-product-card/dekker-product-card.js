import { ProductCard } from '../../ds-eds-assets/js/dekker-product-card.js';
import {
  blockRows, readBlockFields, text, classes, teaserProps, finishTeaser, TEASER_FIELDS,
  loadDekkerCss, render, replaceContent,
} from '../../ds-eds-tools/dekker-block.js';

/**
 * dekker-product-card -- renders dekker-lib's ProductCard from the design system's compiled DOM
 * build
 * (ds-eds-assets/js/dekker-product-card.js, package @ac-brandsframework/eds-assets-dekker) with its
 * CSS
 * (ds-eds-assets/css/bundles/dekker-product-card.css). Markup and look are the design system's;
 * this file only
 * reads the authored fields (_dekker-product-card.json) and maps them onto the component's props.
 * cardType and shadow: classes from ds-eds-assets/js/options/product-card.js.
 */

const STYLE_FIELDS = ['cardType', 'shadow'];

export default function decorate(block) {
  loadDekkerCss('dekker-product-card');
  const { cells } = readBlockFields(blockRows(block), [...TEASER_FIELDS, ...STYLE_FIELDS]);
  const { node, root } = render(ProductCard, {
    ...teaserProps(cells, 'dekker-product-card'),
    className: classes(text(cells.cardType), text(cells.shadow)),
  });
  finishTeaser(root, cells);
  replaceContent(block, node);
}
