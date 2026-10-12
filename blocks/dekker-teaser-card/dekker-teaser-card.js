import { TeaserCard } from '../../ds-eds-assets/js/dekker-teaser-card.js';
import {
  blockRows, readBlockFields, text, classes, teaserProps, finishTeaser, TEASER_FIELDS,
  loadDekkerCss, render, replaceContent,
} from '../../ds-eds-tools/dekker-block.js';

/**
 * dekker-teaser-card -- renders dekker-lib's TeaserCard from the design system's compiled DOM build
 * (ds-eds-assets/js/dekker-teaser-card.js, package @ac-brandsframework/eds-assets-dekker) with its
 * CSS
 * (ds-eds-assets/css/bundles/dekker-teaser-card.css). Markup and look are the design system's; this
 * file only
 * reads the authored fields (_dekker-teaser-card.json) and maps them onto the component's props.
 * highlight, layout and shadow: classes from ds-eds-assets/js/options/teaser-card.js.
 */

const STYLE_FIELDS = ['highlight', 'layout', 'shadow'];

export default function decorate(block) {
  loadDekkerCss('dekker-teaser-card');
  const { cells } = readBlockFields(blockRows(block), [...TEASER_FIELDS, ...STYLE_FIELDS]);
  const { node, root } = render(TeaserCard, {
    ...teaserProps(cells, 'dekker-teaser-card'),
    className: classes(text(cells.highlight), text(cells.layout), text(cells.shadow)),
  });
  finishTeaser(root, cells);
  replaceContent(block, node);
}
