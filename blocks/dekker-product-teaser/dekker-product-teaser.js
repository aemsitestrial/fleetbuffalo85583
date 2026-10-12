import { ProductTeaser } from '../../ds-eds-assets/js/dekker-product-teaser.js';
import {
  blockRows, readBlockFields, text, classes, teaserProps, finishTeaser, TEASER_FIELDS,
  loadDekkerCss, render, replaceContent,
} from '../../ds-eds-tools/dekker-block.js';

/**
 * dekker-product-teaser -- renders dekker-lib's ProductTeaser from the design system's compiled DOM
 * build
 * (ds-eds-assets/js/dekker-product-teaser.js, package @ac-brandsframework/eds-assets-dekker) with
 * its CSS
 * (ds-eds-assets/css/bundles/dekker-product-teaser.css). Markup and look are the design system's;
 * this file only
 * reads the authored fields (_dekker-product-teaser.json) and maps them onto the component's props.
 * highlight and circular: classes from ds-eds-assets/js/options/product-teaser.js.
 */

const STYLE_FIELDS = ['highlight', 'circular'];

export default function decorate(block) {
  loadDekkerCss('dekker-product-teaser');
  const { cells } = readBlockFields(blockRows(block), [...TEASER_FIELDS, ...STYLE_FIELDS]);
  const { node, root } = render(ProductTeaser, {
    ...teaserProps(cells, 'dekker-product-teaser'),
    className: classes(text(cells.highlight), text(cells.circular)),
  });
  finishTeaser(root, cells);
  replaceContent(block, node);
}
