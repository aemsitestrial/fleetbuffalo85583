import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

/**
 * teaserStyle, teaserModifier, headlineClamp and descriptionClamp are
 * "class only" fields: authors pick them from a select, but the value must
 * never be rendered as visible text — it only ever becomes a class on the
 * teaser's root element.
 */
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
  root.className = 'ac-core-teaser';
  moveInstrumentation(item, root);

  // modifier fields only ever contribute a class to the root, they are
  // never part of the visible markup
  [teaserStyleDiv, teaserModifierDiv, headlineClampDiv, descriptionClampDiv]
    .map(consumeModifierClass)
    .filter(Boolean)
    .forEach((modifierClass) => root.classList.add(modifierClass));

  const teaser = document.createElement('div');
  teaser.className = 'cmp-teaser';

  const image = decorateImage(imageDiv);
  if (image) teaser.append(image);

  const content = document.createElement('div');
  content.className = 'cmp-teaser__content';

  if (pretitleDiv?.textContent.trim()) {
    pretitleDiv.className = 'cmp-teaser__pretitle';
    content.append(pretitleDiv);
  }

  if (titleDiv?.textContent.trim()) {
    titleDiv.className = 'cmp-teaser__title';
    content.append(titleDiv);
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

  teaser.append(content);
  root.append(teaser);

  return root;
}

export default function decorate(block) {
  // the block-scoped modifier CSS lives under the `.ac-core` namespace
  block.classList.add('ac-core');

  const items = [...block.children].map(decorateTeaserItem);

  block.replaceChildren(...items);
}
