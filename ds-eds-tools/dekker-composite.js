import {
  blockRows, readContainerFields, readItemFields, text, html, href, classes, teaserProps,
  finishTeaser, instrument, moveInstrumentation, loadDekkerCss, render, replaceContent, uniqueId,
  TEASER_FIELDS,
} from './dekker-block.js';

/**
 * Composite dekker blocks: blocks whose design-system component renders a fixed structure
 * (containers, grid columns, a carousel) around other UI components -- BlockNews, BlockProducts,
 * BlockTeaserNews.
 *
 * The structure comes from the component's layout build, ds-eds-assets/js/<block>.layout.js
 * (tools/eds-emitter/layouts/slot-plugin.js in the design system): the same component compiled
 * with its child components (its @edsSlots) as placeholders. collectSlots() renders it and lists
 * each slot with the props the component gave it (the classes, heading level, card type it
 * imposes). The children are the block's items in Universal Editor, one item type per child
 * component (Title, Text, Button, News Card, ...); each is rendered with its own component, with
 * the slot's props merged in, and put in place of its slot. So the markup is the design
 * system's structure filled with what the author added.
 *
 * Every item model starts with `itemType` (set by the item definition's template), so the item's
 * component is known on a published page too, where items carry no model name.
 */

const CHILDREN = {
  title: {
    fields: ['itemType', 'text', 'type', 'highlight'],
    load: () => import('../ds-eds-assets/js/dekker-title.js').then((m) => m.Title),
    props: (cells, slot) => ({
      ...slot,
      id: uniqueId('dekker-title'),
      type: /^h[1-6]$/.test(text(cells.type) || '') ? text(cells.type) : (slot.type || 'h2'),
      text: text(cells.text) || '',
      className: classes(slot.className, text(cells.highlight)),
    }),
    finish: (root, cells) => instrument(cells.text, root.querySelector('.cmp-title__text')),
  },
  text: {
    fields: ['itemType', 'text', 'variant'],
    load: () => import('../ds-eds-assets/js/dekker-text.js').then((m) => m.Text),
    props: (cells, slot) => ({
      ...slot,
      id: uniqueId('dekker-text'),
      text: html(cells.text) || '',
      className: classes(slot.className, text(cells.variant)),
    }),
    finish: (root, cells) => instrument(cells.text, root.querySelector('.cmp-text')),
  },
  button: {
    fields: ['itemType', 'text', 'linkUrl', 'target', 'type', 'size', 'fontWeight'],
    load: () => import('../ds-eds-assets/js/dekker-button.js').then((m) => m.Button),
    props: (cells, slot) => {
      const url = href(cells.linkUrl);
      return {
        ...slot,
        id: uniqueId('dekker-button'),
        text: text(cells.text) || slot.text || '',
        type: text(cells.type) || slot.type || 'primary',
        target: text(cells.target) || '_self',
        buttonLink: url ? { url, valid: true } : slot.buttonLink,
        className: classes(slot.className, text(cells.size), text(cells.fontWeight)),
      };
    },
    finish: (root, cells) => instrument(cells.text, root.querySelector('.cmp-button__text')),
  },
  'news-card': {
    fields: ['itemType', ...TEASER_FIELDS, 'highlight'],
    load: () => import('../ds-eds-assets/js/dekker-news-card.js').then((m) => m.NewsCard),
    props: (cells, slot) => ({
      ...slot,
      ...teaserProps(cells, 'dekker-news-card'),
      className: classes(slot.className, text(cells.highlight)),
    }),
    finish: finishTeaser,
  },
  'product-card': {
    fields: ['itemType', ...TEASER_FIELDS, 'shadow'],
    load: () => import('../ds-eds-assets/js/dekker-product-card.js').then((m) => m.ProductCard),
    props: (cells, slot) => ({
      ...slot,
      ...teaserProps(cells, 'dekker-product-card'),
      className: classes(slot.className, text(cells.shadow)),
    }),
    finish: finishTeaser,
  },
  'teaser-news': {
    fields: ['itemType', ...TEASER_FIELDS, 'column', 'themeColor', 'contentAlignment'],
    load: () => import('../ds-eds-assets/js/dekker-teaser-news.js').then((m) => m.TeaserNews),
    props: (cells, slot) => ({
      ...slot,
      ...teaserProps(cells, 'dekker-teaser-news'),
      className: classes(slot.className, text(cells.themeColor), text(cells.contentAlignment)),
    }),
    finish: finishTeaser,
  },
};

// The item's component: the model Universal Editor marks it with, else its itemType cell.
function itemTypeOf(item, blockName) {
  const model = item.getAttribute('data-aue-model');
  if (model && model.startsWith(`${blockName}-`)) return model.slice(blockName.length + 1);
  return text(item.children[0]);
}

/**
 * Renders a composite block.
 *   name        the block name (dekker-block-news); its CSS bundle and layout file are named by it
 *   component   the export of the layout file to render (BlockNews)
 *   blockFields the block's own fields, in model order
 *   slots       slot name -> item type that fills it ({ Title: 'title', NewsCard: 'news-card' })
 *   layoutProps (itemsByType, cells) -> the props that shape the structure (which parts render,
 *               how many items, their column classes); not the content
 *   after       optional, runs once the block holds the rendered markup (start a carousel, ...)
 */
export default async function decorateComposite(block, {
  name, component, blockFields = [], slots, layoutProps, after,
}) {
  loadDekkerCss(name);
  const { cells, rest } = readContainerFields(blockRows(block, { container: true }), blockFields);
  const types = new Set(Object.values(slots));
  const items = rest.map((el) => {
    const type = itemTypeOf(el, name);
    if (!types.has(type)) return null;
    return { el, type, cells: readItemFields(el, CHILDREN[type].fields) };
  }).filter(Boolean);
  const itemsByType = {};
  items.forEach((item) => { (itemsByType[item.type] ||= []).push(item); });

  const layout = await import(`../ds-eds-assets/js/${name}.layout.js`);
  const { node, slots: rendered } = layout.collectSlots(
    () => layout[component](layoutProps(itemsByType, cells)),
  );

  const queues = Object.fromEntries(Object.entries(itemsByType).map(([t, list]) => [t, [...list]]));
  await Promise.all(rendered.map(async (slot) => {
    const type = slots[slot.name];
    const item = queues[type]?.shift();
    if (!item) {
      slot.element.remove();
      return;
    }
    const child = CHILDREN[type];
    const Component = await child.load();
    const { node: childNode, root } = render(Component, child.props(item.cells, slot.props));
    child.finish(root, item.cells);
    moveInstrumentation(item.el, root);
    slot.element.replaceWith(childNode);
  }));

  replaceContent(block, node);
  after?.(block);
}
