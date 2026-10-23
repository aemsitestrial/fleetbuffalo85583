// Shared glue for the ds-* blocks. They render through the wrappers of
// @ac-brandsframework/eds-assets, copied to /ds-eds-assets-ac (see its README).
import { loadBundle as loadDsBundle } from '../ds-eds-assets-ac/js/vendor/ds-bundles.js';
import { moveInstrumentation } from './scripts.js';

/** The folder the package is installed in, relative to the site root. */
export const DS_ASSETS = 'ds-eds-assets-ac';

/**
 * Loads a CSS bundle of the package. This is the one-argument form the wrappers take.
 * @param {string} file a bundle name, with or without .css
 */
export const loadBundle = (file) => loadDsBundle(file, DS_ASSETS);

const HEADINGS = 'h1,h2,h3,h4,h5,h6';

/**
 * The editor attributes (data-aue-*, data-richtext-*) of an authored element, as a plain object.
 * They sit on the first instrumented element inside it.
 * @param {Element | null | undefined} element
 * @returns {Record<string, string>}
 */
export function editorAttributes(element) {
  if (!element) return {};
  const holder = [element, ...element.querySelectorAll('*')]
    .find((node) => [...node.attributes].some((attr) => attr.name.startsWith('data-aue-')));
  return Object.fromEntries([...(holder?.attributes ?? [])]
    .filter((attr) => /^data-(aue|richtext)-/.test(attr.name))
    .map((attr) => [attr.name, attr.value]));
}

/** @param {Element | null | undefined} cell */
export const cellText = (cell) => cell?.textContent.trim() || undefined;

/** @param {Element | null | undefined} cell */
export const cellHtml = (cell) => cell?.innerHTML.trim() || undefined;

/** @param {Element | null | undefined} cell the tag of a heading in the cell (folded titleType) */
export const cellHeading = (cell) => cell?.querySelector(HEADINGS)?.localName;

/**
 * A link cell: the anchor's href and text, or the plain value when no anchor was delivered.
 * @param {Element | null | undefined} cell
 * @returns {{ url?: string, text?: string }}
 */
export function cellLink(cell) {
  const a = cell?.querySelector('a');
  if (a) return { url: a.getAttribute('href') || undefined, text: a.textContent.trim() || undefined };
  return { url: cellText(cell) };
}

/**
 * An image cell: the authored <picture> (folded with its alt field) or a plain path.
 * @param {Element | null | undefined} cell
 * @returns {{ src?: string, alt?: string, picture?: HTMLElement }}
 */
export function cellImage(cell) {
  const img = cell?.querySelector('img');
  if (img) {
    return {
      src: img.getAttribute('src') || undefined,
      alt: img.getAttribute('alt') || undefined,
      picture: cell.querySelector('picture') || undefined,
    };
  }
  const link = cellLink(cell);
  return { src: link.url };
}

/**
 * Reads a key-value block: every authored row is <div><div>field</div><div>value</div></div>
 * and an empty field has no row. In the Universal Editor the rows can sit one level down, in a
 * wrapper that carries the block's data-aue-* attributes.
 * @param {HTMLElement} block
 */
export function readFields(block) {
  const first = block.firstElementChild;
  const wrapper = first?.hasAttribute('data-aue-resource') ? first : null;
  const rows = [...(wrapper ?? block).children];
  const row = (name) => rows.find((r) => r.children[0]?.textContent.trim() === name);
  const cell = (name) => row(name)?.children[1];
  return {
    wrapper,
    row,
    cell,
    text: (name) => cellText(cell(name)),
    html: (name) => cellHtml(cell(name)),
    heading: (name) => cellHeading(cell(name)),
    link: (name) => cellLink(cell(name)),
    image: (name) => cellImage(cell(name)),
    bool: (name) => {
      const value = cellText(cell(name));
      return value === undefined ? undefined : value === 'true';
    },
    attrs: (name) => editorAttributes(row(name)),
    /** Option list name -> chosen value, for fields named after their option list. */
    options: (lists) => Object.fromEntries(lists.map((list) => [list, cellText(cell(list))])),
  };
}

/**
 * Reads the Teaser-family fields (ds-card, ds-banner, ds-text-content) into the wrapper's
 * `content` and `editable`. A link field folds with its <name>Text field into one anchor.
 * @param {ReturnType<typeof readFields>} f
 */
export function readTeaser(f) {
  const image = f.image('image');
  const { url } = f.link('link');
  const editable = {
    imagePath: f.attrs('image'),
    pretitle: f.attrs('pretitle'),
    title: f.attrs('title'),
    description: f.attrs('description'),
    date: f.attrs('date'),
  };
  const actions = [];
  ['action1', 'action2'].forEach((name) => {
    const action = f.link(name);
    if (!action.url) return;
    editable[`actions.${actions.length}.title`] = f.attrs(name);
    actions.push({ title: action.text || f.text(`${name}Text`), link: { url: action.url } });
  });
  return {
    content: {
      imagePath: image.src,
      picture: image.picture,
      pretitle: f.text('pretitle'),
      title: f.text('title'),
      titleTag: f.heading('title') || f.text('titleType'),
      description: f.html('description'),
      date: f.text('date'),
      link: url ? { url } : undefined,
      actions,
    },
    editable,
  };
}

/**
 * Takes the choices of option lists off the block's classes. A container block keeps its own
 * options in `classes_*` fields, which the platform writes as classes on the block. The classes
 * are removed from the block, because the wrapper puts them on the rendered element.
 * @param {HTMLElement} block
 * @param {Record<string, Array<{ value: string }>>} lists option list name -> its choices
 * @returns {Record<string, string | undefined>}
 */
export function takeClassOptions(block, lists) {
  const used = new Set();
  const options = Object.fromEntries(Object.entries(lists).map(([name, choices]) => {
    const match = choices
      .map(({ value }) => ({ value, classes: value.split(/\s+/).filter(Boolean) }))
      .filter(({ classes }) => classes.length && classes.every((c) => block.classList.contains(c)))
      .sort((a, b) => b.classes.length - a.classes.length)[0];
    match?.classes.forEach((c) => used.add(c));
    return [name, match?.value];
  }));
  used.forEach((c) => block.classList.remove(c));
  return options;
}

/**
 * The item rows of a container block. An item has one cell per field in model order (a folded
 * pair such as image + imageAlt shares one cell), so `names` lists the cells, not the fields.
 * @param {HTMLElement} block
 * @param {string[]} names
 * @returns {Array<{ row: Element, cells: Record<string, Element | undefined> }>}
 */
export function readItems(block, names) {
  return [...block.children].map((row) => ({
    row,
    cells: Object.fromEntries(names.map((name, index) => [name, row.children[index]])),
  }));
}

/**
 * The teaser-shaped items of ds-list, ds-carousel and ds-slider, with their editor attributes
 * under the wrappers' `items.<n>.<prop>` keys.
 * @param {HTMLElement} block
 * @param {string[]} [extra] cells after the shared ones
 */
export function readTeaserItems(block, extra = []) {
  const editable = {};
  const items = readItems(block, ['image', 'pretitle', 'title', 'description', 'link', ...extra])
    .map(({ row, cells }, index) => {
      const image = cellImage(cells.image);
      const { url } = cellLink(cells.link);
      const key = `items.${index}`;
      editable[key] = editorAttributes(row);
      editable[`${key}.imagePath`] = editorAttributes(cells.image);
      editable[`${key}.pretitle`] = editorAttributes(cells.pretitle);
      editable[`${key}.title`] = editorAttributes(cells.title);
      editable[`${key}.description`] = editorAttributes(cells.description);
      const item = {
        imagePath: image.src,
        alt: image.alt,
        pretitle: cellText(cells.pretitle),
        title: cellText(cells.title),
        description: cellHtml(cells.description),
        link: url ? { url } : undefined,
      };
      extra.forEach((name) => { item[name] = cellText(cells[name]); });
      return item;
    });
  return { items, editable };
}

/**
 * The title + rich text panels of ds-accordion and ds-tabs.
 * @param {HTMLElement} block
 */
export function readPanelItems(block) {
  const editable = {};
  const items = readItems(block, ['title', 'content']).map(({ row, cells }, index) => {
    const key = `items.${index}`;
    editable[key] = editorAttributes(row);
    editable[`${key}.cq:panelTitle`] = editorAttributes(cells.title);
    editable[`${key}.content`] = editorAttributes(cells.content);
    return { 'cq:panelTitle': cellText(cells.title), content: cellHtml(cells.content) };
  });
  return { items, editable };
}

/**
 * Takes a marker class off the block and says whether it was there.
 * @param {HTMLElement} block
 * @param {string} name
 */
export function takeFlag(block, name) {
  const had = block.classList.contains(name);
  block.classList.remove(name);
  return had;
}

/** True inside the Universal Editor, where the page carries its instrumentation. */
const inEditor = () => !!document.querySelector('[data-aue-resource]');

/** @param {Element | undefined} element */
const isEmpty = (element) => !element
  || (!element.textContent.trim() && !element.querySelector('img,picture,iframe,video,hr,svg'));

/**
 * Puts the rendered element in the block, carrying the editor attributes of the wrapper. In the
 * editor, a block with nothing to show gets a placeholder, so the author can see and select it.
 * @param {HTMLElement} block
 * @param {Element | null} wrapper
 * @param {HTMLElement | undefined} element
 */
export function replaceContent(block, wrapper, element) {
  block.textContent = '';
  let target = element;
  if (inEditor() && isEmpty(element)) {
    const placeholder = document.createElement('p');
    placeholder.className = 'ds-placeholder';
    placeholder.textContent = `${block.dataset.blockName || block.classList[0]}: fill in the fields in the properties panel`;
    if (element) element.append(placeholder);
    else target = placeholder;
  }
  if (!target) return;
  if (wrapper) moveInstrumentation(wrapper, target);
  block.append(target);
}

/**
 * Runs `fn` once the block's section is shown. aem.js keeps a section hidden until all its blocks
 * have loaded, and controllers that measure the layout need it visible.
 * @param {HTMLElement} block
 * @param {() => void} fn
 */
export function whenShown(block, fn) {
  const section = block.closest('.section');
  const run = () => requestAnimationFrame(() => fn());
  if (!section || section.dataset.sectionStatus === 'loaded') {
    run();
    return;
  }
  const observer = new MutationObserver(() => {
    if (section.dataset.sectionStatus === 'loaded') {
      observer.disconnect();
      run();
    }
  });
  observer.observe(section, { attributes: true, attributeFilter: ['data-section-status'] });
}
