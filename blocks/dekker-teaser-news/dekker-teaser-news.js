import { TeaserNews } from '../../ds-eds-assets/js/dekker-teaser-news.js';
import {
  blockRows, readBlockFields, text, classes, teaserProps, finishTeaser, TEASER_FIELDS,
  loadDekkerCss, render, replaceContent,
} from '../../ds-eds-tools/dekker-block.js';

/**
 * dekker-teaser-news -- renders dekker-lib's TeaserNews from the design system's compiled DOM build
 * (ds-eds-assets/js/dekker-teaser-news.js, package @ac-brandsframework/eds-assets-dekker) with its
 * CSS
 * (ds-eds-assets/css/bundles/dekker-teaser-news.css). Markup and look are the design system's; this
 * file only
 * reads the authored fields (_dekker-teaser-news.json) and maps them onto the component's props.
 * themeColor and contentAlignment: classes from ds-eds-assets/js/options/teaser-news.js.
 */

const STYLE_FIELDS = ['themeColor', 'contentAlignment'];

export default function decorate(block) {
  loadDekkerCss('dekker-teaser-news');
  const { cells } = readBlockFields(blockRows(block), [...TEASER_FIELDS, ...STYLE_FIELDS]);
  const { node, root } = render(TeaserNews, {
    ...teaserProps(cells, 'dekker-teaser-news'),
    className: classes(text(cells.themeColor), text(cells.contentAlignment)),
  });
  finishTeaser(root, cells);
  replaceContent(block, node);
}
