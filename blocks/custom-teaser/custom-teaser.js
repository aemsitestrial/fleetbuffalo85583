import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

/* eslint-disable */
export function generateTeaserDOM(props) {
  // Extract properties, always same order as in model, empty string if not set
  const [
    imageContainer,
    pretitle,
    title,
    description,
    actionText,
    actionUrl,
    teaserStyle,
    teaserModifier,
    headlineClamp,
    descriptionClamp,
  ] = props;

  const picture = imageContainer.querySelector('picture');
  if (picture) {
    const img = picture.querySelector('img');
    const optimizedPicture = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPicture.querySelector('img'));
    imageContainer.textContent = '';
    imageContainer.appendChild(optimizedPicture);
  }

  const hasPretitle = pretitle.textContent.trim() !== '';
  const hasTitle = title.textContent.trim() !== '';
  const hasDescription = description.textContent.trim() !== '';

  const link = actionUrl.querySelector('a');
  const hasAction = !!link && actionText.textContent.trim() !== '';
  if (hasAction) {
    link.textContent = actionText.textContent.trim();
    link.className = 'cmp-teaser__action-link';
  }

  // Build DOM
  const teaserDOM = document.createRange().createContextualFragment(`
    ${picture ? `<div class='cmp-teaser__image'>${picture.outerHTML}</div>` : ``}
    <div class='cmp-teaser__content'>
      ${hasPretitle ? `<div class='cmp-teaser__pretitle'>${pretitle.innerHTML}</div>` : ``}
      ${hasTitle ? `<div class='cmp-teaser__title'>${title.innerHTML}</div>` : ``}
      ${hasDescription ? `<div class='cmp-teaser__description'>${description.innerHTML}</div>` : ``}
      ${hasAction ? `<div class='cmp-teaser__action-container'>${link.outerHTML}</div>` : ``}
    </div>
  `);

  // teaserStyle, teaserModifier, headlineClamp and descriptionClamp are
  // "class only" fields: authors pick them from a select, but the value must
  // never be rendered as visible content — only ever added as a class on the
  // teaser's root element.
  const modifierClasses = [teaserStyle, teaserModifier, headlineClamp, descriptionClamp]
    .map((el) => el.textContent.trim())
    .filter((cls) => cls !== '');

  return { teaserDOM, modifierClasses };
}

export default function decorate(block) {
  // get the first and only cell from each row
  const props = [...block.children].map((row) => row.firstElementChild);
  const { teaserDOM, modifierClasses } = generateTeaserDOM(props);

  const teaser = document.createElement('div');
  teaser.className = 'cmp-teaser ac-core-teaser';
  modifierClasses.forEach((cls) => teaser.classList.add(cls));
  teaser.append(teaserDOM);

  // the block-scoped modifier CSS lives under the `.ac-core` namespace
  block.classList.add('ac-core');
  block.textContent = '';
  block.append(teaser);
}
