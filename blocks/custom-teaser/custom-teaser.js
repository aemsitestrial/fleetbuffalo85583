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
 *
 * IMPORTANT: Universal Editor omits the row/cell for an *empty* optional
 * field entirely instead of rendering an empty one — e.g. a Custom Teaser
 * Item with no "Teaser link" and no second action has fewer field divs than
 * the model defines. Fields are therefore never read positionally:
 *  - teaserStyle/teaserModifier/headlineClamp/descriptionClamp/titleType are
 *    matched by their exact (known, closed-vocabulary) value.
 *  - image is detected by shape (contains <picture>/<img>, or an <a> whose
 *    href looks like an asset/image link).
 *  - pretitle/title/description/linkURL/actionText/actionUrl/action2Text/
 *    action2Url are classified by shape (link vs. plain text) and text
 *    length, matching the order authors fill them in (see
 *    `classifyContentFields` below). This is a heuristic, not a guarantee,
 *    but it correctly resolves every field-omission pattern observed in
 *    real authored content.
 */

const STYLE_VALUES = ['style-primary', 'style-secondary', 'style-tertiary', 'style-quaternary'];
const MODIFIER_VALUES = [
  'modifier-content-center',
  'modifier-content-right',
  'modifier-pretitle-primary',
  'modifier-pretitle-secondary',
  'modifier-pretitle-tertiary',
  'modifier-transparent',
];
const HEADLINE_CLAMP_VALUES = ['teaser-headline-line-clamp-1', 'teaser-headline-line-clamp-2'];
const DESCRIPTION_CLAMP_VALUES = [
  'teaser-description-line-clamp-2',
  'teaser-description-line-clamp-4',
  'teaser-description-line-clamp-6',
  'teaser-description-line-clamp-8',
  'teaser-description-line-clamp-10',
  'teaser-description-line-clamp-12',
];
const MODIFIER_CLASS_VALUES = [
  ...STYLE_VALUES,
  ...MODIFIER_VALUES,
  ...HEADLINE_CLAMP_VALUES,
  ...DESCRIPTION_CLAMP_VALUES,
];
const TITLE_TYPES = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

// Text longer than this is treated as the description rather than a
// pretitle/title/action label when the front content group is ambiguous.
const LONG_TEXT_THRESHOLD = 60;

// teaserStyle, teaserModifier, headlineClamp and descriptionClamp are
// "class only" fields: authors pick them from a select, but the value must
// never be rendered as visible content — only ever added as a class on the
// teaser's root element. Matched by exact value, not by position (see note
// above), and removed from the DOM once consumed.
function extractModifierClasses(divs) {
  const modifierClasses = [];
  const rest = [];
  divs.forEach((div) => {
    const value = div.textContent.trim();
    if (MODIFIER_CLASS_VALUES.includes(value)) {
      modifierClasses.push(value);
      div.remove();
    } else {
      rest.push(div);
    }
  });
  return { modifierClasses, rest };
}

// Generic helper: finds the first div whose exact trimmed text matches one
// of `values` (a closed vocabulary), removes it from the DOM, and returns
// both the matched value and the remaining divs. Used for `titleType` so an
// omitted field never shifts other fields out of position.
function extractByExactValue(divs, values) {
  let match = null;
  const rest = [];
  divs.forEach((div) => {
    const value = div.textContent.trim();
    if (!match && values.includes(value)) {
      match = value;
      div.remove();
    } else {
      rest.push(div);
    }
  });
  return { match, rest };
}

function isLinkShaped(div) {
  return !!div.querySelector('a');
}

// Detects the image field robustly: either already-decorated <picture>/<img>
// markup, or a raw AEM Assets/DAM delivery link (see decorateImage below).
function looksLikeImageAsset(div) {
  if (div.querySelector('picture, img')) return true;
  const link = div.querySelector('a');
  const href = link?.getAttribute('href') || '';
  return /\.(avif|jpe?g|png|gif|webp|svg)(\?|#|$)/i.test(href)
    || href.includes('/adobe/assets/')
    || href.includes('/content/dam/');
}

// Classifies the remaining "front content group" divs (after modifier
// classes, titleType and the image have been extracted) into their named
// fields by shape (link vs. plain text) and text length, rather than by
// position — so an omitted linkURL/action2 field never shifts the fields
// that follow it out of place.
function classifyContentFields(divs) {
  const result = {
    pretitle: null,
    title: null,
    description: null,
    linkURL: null,
    actionText: null,
    actionUrl: null,
    action2Text: null,
    action2Url: null,
  };
  const leadingQueue = [];
  let linkSectionStarted = false;
  let pendingActionText = null;
  let actionPairIndex = 0;

  divs.forEach((div) => {
    if (isLinkShaped(div)) {
      linkSectionStarted = true;
      if (pendingActionText) {
        if (actionPairIndex === 0) {
          result.actionText = pendingActionText;
          result.actionUrl = div;
        } else {
          result.action2Text = pendingActionText;
          result.action2Url = div;
        }
        actionPairIndex += 1;
        pendingActionText = null;
      } else if (!result.linkURL) {
        result.linkURL = div;
      }
      return;
    }

    const isLong = div.textContent.trim().length > LONG_TEXT_THRESHOLD;
    if (isLong && !result.description) {
      result.description = div;
      linkSectionStarted = true;
      return;
    }

    if (!linkSectionStarted) {
      leadingQueue.push(div);
    } else {
      pendingActionText = div;
    }
  });

  if (!result.description) {
    if (leadingQueue.length === 3) {
      [result.pretitle, result.title, result.description] = leadingQueue;
    } else if (leadingQueue.length === 2) {
      [result.pretitle, result.title] = leadingQueue;
    } else if (leadingQueue.length === 1) {
      [result.title] = leadingQueue;
    }
  } else if (leadingQueue.length === 2) {
    [result.pretitle, result.title] = leadingQueue;
  } else if (leadingQueue.length === 1) {
    [result.title] = leadingQueue;
  }

  return result;
}

// Authored images (a "reference" field pointing at an AEM Assets/DAM asset)
// are exported as a plain `<a href="https://.../adobe/assets/...">` link to
// the asset delivery URL, not as <picture>/<img> markup — fall back through
// <picture>, then a bare <img>, then that raw asset link.
function decorateImage(imageDiv) {
  if (!imageDiv) return null;

  const picture = imageDiv.querySelector('picture');
  const img = picture ? picture.querySelector('img') : imageDiv.querySelector('img');

  let src = img?.src;
  let alt = img?.alt || '';

  if (!src) {
    const link = imageDiv.querySelector('a');
    src = link?.href;
    alt = '';
  }

  if (!src) return null;

  const optimizedPicture = createOptimizedPicture(src, alt, false, [{ width: '750' }]);
  if (img) moveInstrumentation(img, optimizedPicture.querySelector('img'));

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
  const { modifierClasses, rest: withoutModifiers } = extractModifierClasses([...item.children]);
  const { match: titleType, rest: withoutTitleType } = extractByExactValue(
    withoutModifiers,
    TITLE_TYPES,
  );

  let imageDiv = null;
  let contentDivs = withoutTitleType;
  if (contentDivs.length && looksLikeImageAsset(contentDivs[0])) {
    [imageDiv, ...contentDivs] = contentDivs;
  }

  const {
    pretitle: pretitleDiv,
    title: titleDiv,
    description: descriptionDiv,
    linkURL: linkUrlDiv,
    actionText: actionTextDiv,
    actionUrl: actionUrlDiv,
    action2Text: action2TextDiv,
    action2Url: action2UrlDiv,
  } = classifyContentFields(contentDivs);

  const root = document.createElement('div');
  root.className = 'teaser ac-core';
  moveInstrumentation(item, root);
  modifierClasses.forEach((modifierClass) => root.classList.add(modifierClass));

  const teaser = document.createElement('div');
  teaser.className = 'cmp-teaser';

  const content = document.createElement('div');
  content.className = 'cmp-teaser__content';

  if (pretitleDiv?.textContent.trim()) {
    const pretitle = document.createElement('p');
    pretitle.className = 'cmp-teaser__pretitle';
    pretitle.textContent = pretitleDiv.textContent.trim();
    moveInstrumentation(pretitleDiv, pretitle);
    content.append(pretitle);
  }

  if (titleDiv?.textContent.trim()) {
    const title = document.createElement(titleType || 'h3');
    title.className = 'cmp-teaser__title';
    title.textContent = titleDiv.textContent.trim();
    moveInstrumentation(titleDiv, title);
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
