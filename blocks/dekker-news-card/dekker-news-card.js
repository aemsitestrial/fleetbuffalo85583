import { NewsCard } from '../../ds-eds-assets/js/dekker-news-card.js';
import {
  blockRows, readBlockFields, text, classes, teaserProps, finishTeaser, TEASER_FIELDS,
  loadDekkerCss, render, replaceContent,
} from '../../ds-eds-tools/dekker-block.js';

/**
 * dekker-news-card -- renders dekker-lib's NewsCard from the design system's compiled DOM build
 * (ds-eds-assets/js/dekker-news-card.js, package @ac-brandsframework/eds-assets-dekker) with its
 * CSS
 * (ds-eds-assets/css/bundles/dekker-news-card.css). Markup and look are the design system's; this
 * file only
 * reads the authored fields (_dekker-news-card.json) and maps them onto the component's props.
 * highlight: a class from ds-eds-assets/js/options/news-card.js.
 */

const STYLE_FIELDS = ['highlight'];

export default function decorate(block) {
  loadDekkerCss('dekker-news-card');
  const { cells } = readBlockFields(blockRows(block), [...TEASER_FIELDS, ...STYLE_FIELDS]);
  const { node, root } = render(NewsCard, {
    ...teaserProps(cells, 'dekker-news-card'),
    className: classes(text(cells.highlight)),
  });
  finishTeaser(root, cells);
  replaceContent(block, node);
}
