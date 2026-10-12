import { TeaserLink } from '../../ds-eds-assets/js/dekker-teaser-link.js';
import {
  blockRows, readBlockFields, text, classes, teaserProps, finishTeaser, TEASER_FIELDS,
  loadDekkerCss, render, replaceContent,
} from '../../ds-eds-tools/dekker-block.js';

/**
 * dekker-teaser-link -- renders dekker-lib's TeaserLink from the design system's compiled DOM build
 * (ds-eds-assets/js/dekker-teaser-link.js, package @ac-brandsframework/eds-assets-dekker) with its
 * CSS
 * (ds-eds-assets/css/bundles/dekker-teaser-link.css). Markup and look are the design system's; this
 * file only
 * reads the authored fields (_dekker-teaser-link.json) and maps them onto the component's props.
 * highlight: a class from ds-eds-assets/js/options/teaser-link.js.
 */

const STYLE_FIELDS = ['highlight'];

export default function decorate(block) {
  loadDekkerCss('dekker-teaser-link');
  const { cells } = readBlockFields(blockRows(block), [...TEASER_FIELDS, ...STYLE_FIELDS]);
  const { node, root } = render(TeaserLink, {
    ...teaserProps(cells, 'dekker-teaser-link'),
    className: classes(text(cells.highlight)),
  });
  finishTeaser(root, cells);
  replaceContent(block, node);
}
