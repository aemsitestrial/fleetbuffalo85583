import { text } from '../../ds-eds-tools/dekker-block.js';
import decorateComposite from '../../ds-eds-tools/dekker-composite.js';

/**
 * dekker-block-teaser-news -- dekker-lib's BlockTeaserNews structure
 * (ds-eds-assets/js/dekker-block-teaser-news.layout.js): one grid column per News Teaser item,
 * the column's classes from the item's width field. See ds-eds-tools/dekker-composite.js.
 */
const FULL_WIDTH = 'aem-GridColumn aem-GridColumn--default--12';

export default async function decorate(block) {
  await decorateComposite(block, {
    name: 'dekker-block-teaser-news',
    component: 'BlockTeaserNews',
    slots: { TeaserNews: 'teaser-news' },
    layoutProps: (items) => ({
      items: (items['teaser-news'] || []).map((item, index) => ({
        id: `teaser-news-${index}`,
        columnClassname: text(item.cells.column) || FULL_WIDTH,
      })),
    }),
  });
}
