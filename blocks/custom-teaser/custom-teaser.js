import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

/**
 * Inner DOM shape mirrors AEM Core Components' Teaser v2:
 * https://www.aemcomponents.dev/content/core-components-examples/library/core-content/teaser.html
 *
 * With one or more actions (up to 2), the whole-teaser link is never used —
 * only the action link(s) are clickable:
 *
 *   <div class="teaser ac-core style-primary ...modifiers">   <-- root
 *     <div class="cmp-teaser">
 *       <div class="cmp-teaser__content">
 *         <p class="cmp-teaser__pretitle">...</p>
 *         <h3 class="cmp-teaser__title">...</h3>
 *         <div class="cmp-teaser__description">...</div>
 *         <div class="cmp-teaser__action-container">
 *           <a class="cmp-teaser__action-link">...</a>
 *           <a class="cmp-teaser__action-link">...</a>
 *         </div>
 *       </div>
 *       <div class="cmp-teaser__image">...</div>
 *     </div>
 *   </div>
 *
 * With no actions but a "Teaser link" set, the whole teaser becomes
 * clickable instead — content and image move inside a `cmp-teaser__link`:
 *
 *   <div class="teaser ac-core ...modifiers">
 *     <div class="cmp-teaser">
 *       <a class="cmp-teaser__link">
 *         <div class="cmp-teaser__content">...(no action-container)...</div>
 *         <div class="cmp-teaser__image">...</div>
 *       </a>
 *     </div>
 *   </div>
 *
 * The root element (`.teaser`) carries the `ac-core` namespace class plus
 * every modifier class (`.style-*`, `.modifier-*`, `.teaser-*-line-clamp-*`)
 * — the CSS in custom-teaser.css targets `.ac-core.teaser...` (all on the
 * same element), not a separate `.ac-core-teaser` node.
 *
 * The block can hold one or many "Custom Teaser Item" entries — dropping a
 * single item authors a standalone teaser, dropping several authors a list
 * of teasers, exactly like `cards`/`card`.
 */

// teaserStyle, teaserModifier, headlineClamp and descriptionClamp are
// "class only" fields: authors pick them from a select, but the value must
// never be rendered as visible content — only ever added as a class on the
// teaser's root element.
function consumeModifierClass(fieldDiv) {
  const value = fieldDiv?.textContent.trim();
  fieldDiv?.remove();
  return value || null;
}

function decorateImage(imageDiv) {
  // authored images are normally wrapped in a <picture>, but fall back to a
  // bare <img> so a differently-shaped authoring output still renders
  const picture = imageDiv?.querySelector('picture');
  const img = picture ? picture.querySelector('img') : imageDiv?.querySelector('img');
  if (!img) return null;

  const optimizedPicture = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
  moveInstrumentation(img, optimizedPicture.querySelector('img'));

  const wrapper = document.createElement('div');
  wrapper.className = 'cmp-teaser__image';
  moveInstrumentation(imageDiv, wrapper);
  wrapper.append(optimizedPicture);

  return wrapper;
}

function decorateActionLink(textDiv, urlDiv) {
  const link = urlDiv?.querySelector('a');
  const text = textDiv?.textContent.trim();
  if (!link || !text) return null;

  link.textContent = text;
  link.className = 'cmp-teaser__action-link';
  moveInstrumentation(urlDiv, link);

  return link;
}

function decorateTeaserItem(item) {
  const [
    imageDiv,
    pretitleDiv,
    titleDiv,
    descriptionDiv,
    linkUrlDiv,
    actionTextDiv,
    actionUrlDiv,
    action2TextDiv,
    action2UrlDiv,
    teaserStyleDiv,
    teaserModifierDiv,
    headlineClampDiv,
    descriptionClampDiv,
  ] = [...item.children];

  const root = document.createElement('div');
  root.className = 'teaser ac-core';
  moveInstrumentation(item, root);

  // modifier fields only ever contribute a class to the root, they are
  // never part of the visible markup
  [teaserStyleDiv, teaserModifierDiv, headlineClampDiv, descriptionClampDiv]
    .map(consumeModifierClass)
    .filter(Boolean)
    .forEach((modifierClass) => root.classList.add(modifierClass));

  const teaser = document.createElement('div');
  teaser.className = 'cmp-teaser';

  const content = document.createElement('div');
  content.className = 'cmp-teaser__content';

  if (pretitleDiv?.textContent.trim()) {
    const pretitle = document.createElement('p');
    pretitle.className = 'cmp-teaser__pretitle';
    pretitle.innerHTML = pretitleDiv.innerHTML;
    content.append(pretitle);
  }

  if (titleDiv?.textContent.trim()) {
    const title = document.createElement('h3');
    title.className = 'cmp-teaser__title';
    title.innerHTML = titleDiv.innerHTML;
    content.append(title);
  }

  if (descriptionDiv?.textContent.trim()) {
    descriptionDiv.className = 'cmp-teaser__description';
    content.append(descriptionDiv);
  }

  // up to 2 action links
  const actionLinks = [
    decorateActionLink(actionTextDiv, actionUrlDiv),
    decorateActionLink(action2TextDiv, action2UrlDiv),
  ].filter(Boolean);

  if (actionLinks.length) {
    const actions = document.createElement('div');
    actions.className = 'cmp-teaser__action-container';
    actions.append(...actionLinks);
    content.append(actions);
  }

  // AEM Core Components render the content before the image in the DOM
  const image = decorateImage(imageDiv);

  // whole-teaser link is only used when there are no action links — actions
  // always win, matching AEM Core Components' Teaser behavior
  const teaserLink = !actionLinks.length ? linkUrlDiv?.querySelector('a') : null;

  if (teaserLink) {
    teaserLink.className = 'cmp-teaser__link';
    teaserLink.textContent = '';
    moveInstrumentation(linkUrlDiv, teaserLink);
    teaserLink.append(content);
    if (image) teaserLink.append(image);
    teaser.append(teaserLink);
  } else {
    teaser.append(content);
    if (image) teaser.append(image);
  }

  root.append(teaser);

  return root;
}

export default function decorate(block) {
  const items = [...block.children].map(decorateTeaserItem);

  block.replaceChildren(...items);
}
