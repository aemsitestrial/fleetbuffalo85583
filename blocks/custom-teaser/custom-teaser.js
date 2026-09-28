import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

/**
 * DOM shape below mirrors AEM Core Components' Teaser v2:
 * https://www.aemcomponents.dev/content/core-components-examples/library/core-content/teaser.html
 *
 *   <div class="cmp-teaser">
 *     <div class="cmp-teaser__content">
 *       <p class="cmp-teaser__pretitle">...</p>
 *       <h3 class="cmp-teaser__title">...</h3>
 *       <div class="cmp-teaser__description">...</div>
 *       <div class="cmp-teaser__action-container">
 *         <a class="cmp-teaser__action-link">...</a>
 *       </div>
 *     </div>
 *     <div class="cmp-teaser__image">...</div>
 *   </div>
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
  const picture = imageDiv?.querySelector('picture');
  if (!picture) return null;

  const img = picture.querySelector('img');
  const optimizedPicture = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
  moveInstrumentation(img, optimizedPicture.querySelector('img'));

  const wrapper = document.createElement('div');
  wrapper.className = 'cmp-teaser__image';
  moveInstrumentation(imageDiv, wrapper);
  wrapper.append(optimizedPicture);

  return wrapper;
}

function decorateTeaserItem(item) {
  const [
    imageDiv,
    pretitleDiv,
    titleDiv,
    descriptionDiv,
    actionTextDiv,
    actionUrlDiv,
    teaserStyleDiv,
    teaserModifierDiv,
    headlineClampDiv,
    descriptionClampDiv,
  ] = [...item.children];

  const root = document.createElement('div');
  root.className = 'cmp-teaser ac-core-teaser';
  moveInstrumentation(item, root);

  // modifier fields only ever contribute a class to the root, they are
  // never part of the visible markup
  [teaserStyleDiv, teaserModifierDiv, headlineClampDiv, descriptionClampDiv]
    .map(consumeModifierClass)
    .filter(Boolean)
    .forEach((modifierClass) => root.classList.add(modifierClass));

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

  const actionLink = actionUrlDiv?.querySelector('a');
  const actionText = actionTextDiv?.textContent.trim();
  if (actionLink && actionText) {
    actionLink.textContent = actionText;
    actionLink.className = 'cmp-teaser__action-link';
    moveInstrumentation(actionUrlDiv, actionLink);

    const actions = document.createElement('div');
    actions.className = 'cmp-teaser__action-container';
    actions.append(actionLink);
    content.append(actions);
  }

  // AEM Core Components render the content before the image in the DOM
  root.append(content);

  const image = decorateImage(imageDiv);
  if (image) root.append(image);

  return root;
}

export default function decorate(block) {
  // the modifier CSS (.style-*, .modifier-*, .teaser-*-line-clamp-*) lives
  // under the `.ac-core` namespace
  block.classList.add('ac-core');

  const items = [...block.children].map(decorateTeaserItem);

  block.replaceChildren(...items);
}
