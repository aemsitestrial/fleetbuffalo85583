import { BlockTeaserNews } from '../../ds-eds-assets/js/dekker-block-teaser-news.js';
import {
  blockRows, readItemFields, text, classes, teaserProps, finishTeaser, TEASER_FIELDS,
  moveInstrumentation, loadDekkerCss, render, replaceContent,
} from '../../ds-eds-tools/dekker-block.js';

/**
 * dekker-block-teaser-news -- renders dekker-lib's BlockTeaserNews from the design system's
 * compiled DOM build
 * (ds-eds-assets/js/dekker-block-teaser-news.js, package @ac-brandsframework/eds-assets-dekker)
 * with its CSS
 * (ds-eds-assets/css/bundles/dekker-block-teaser-news.css). Markup and look are the design
 * system's; this file only
 * reads the authored fields (_dekker-block-teaser-news.json) and maps them onto the component's
 * props.
 * One item per news teaser: teaser fields, its column width (grid classes) and themeColor /
 * contentAlignment (classes from ds-eds-assets/js/options/teaser-news.js).
 */

const ITEM_FIELDS = [...TEASER_FIELDS, 'column', 'themeColor', 'contentAlignment'];

export default function decorate(block) {
  loadDekkerCss('dekker-block-teaser-news');
  const teasers = blockRows(block, { container: true }).map((item) => {
    const cells = readItemFields(item, ITEM_FIELDS);
    return {
      item,
      cells,
      props: {
        ...teaserProps(cells, 'dekker-teaser-news'),
        columnClassname: text(cells.column) || 'aem-GridColumn aem-GridColumn--default--12',
        className: classes(text(cells.themeColor), text(cells.contentAlignment)),
      },
    };
  });
  const { node, root } = render(BlockTeaserNews, { items: teasers.map((t) => t.props) });
  const teaserEls = root.querySelectorAll('.ds-brand-teaser-news');
  teasers.forEach((t, index) => {
    moveInstrumentation(t.item, teaserEls[index]);
    finishTeaser(teaserEls[index], t.cells);
  });
  replaceContent(block, node);
}
