import {
  decorateBlock,
  decorateBlocks,
  decorateButtons,
  decorateIcons,
  decorateSections,
  loadBlock,
  loadScript,
  loadSections,
} from './aem.js';
import { decorateRichtext } from './editor-support-rte.js';
import { decorateMain, buildSectionBlocks } from './scripts.js';

async function applyChanges(event) {
  // redecorate default content and blocks on patches (in the properties rail)
  const { detail } = event;

  const resource = detail?.request?.target?.resource // update, patch components
    || detail?.request?.target?.container?.resource // update, patch, add to sections
    || detail?.request?.to?.container?.resource; // move in sections
  if (!resource) return false;
  const updates = detail?.response?.updates;
  if (!updates.length) return false;
  const { content } = updates[0];
  if (!content) return false;

  // load dompurify
  await loadScript(`${window.hlx.codeBasePath}/scripts/dompurify.min.js`);

  const sanitizedContent = window.DOMPurify.sanitize(content, { USE_PROFILES: { html: true } });
  const parsedUpdate = new DOMParser().parseFromString(sanitizedContent, 'text/html');
  const element = document.querySelector(`[data-aue-resource="${resource}"]`);

  if (element) {
    if (element.matches('main')) {
      const newMain = parsedUpdate.querySelector(`[data-aue-resource="${resource}"]`);
      newMain.style.display = 'none';
      element.insertAdjacentElement('afterend', newMain);
      decorateMain(newMain);
      decorateRichtext(newMain);
      await loadSections(newMain);
      element.remove();
      newMain.style.display = null;
      // eslint-disable-next-line no-use-before-define
      attachEventListners(newMain);
      return true;
    }

    // a composite section block (AC Container, AC Teasers with filter...) carries its section's
    // instrumentation on its root (data-section-root): a change to it re-renders the whole section
    if (element.hasAttribute('data-section-root')) {
      const section = element.closest('.section');
      const newSection = parsedUpdate.querySelector(`[data-aue-resource="${resource}"]`);
      if (section && newSection) {
        const { parentElement } = section;
        newSection.style.display = 'none';
        section.insertAdjacentElement('afterend', newSection);
        decorateButtons(newSection);
        decorateIcons(newSection);
        decorateRichtext(newSection);
        buildSectionBlocks(parentElement);
        decorateSections(parentElement);
        decorateBlocks(parentElement);
        await loadSections(parentElement);
        section.remove();
        newSection.style.display = null;
        return true;
      }
    }

    // blocks are found by data-block-name: ac-* blocks drop the `block` class once decorated
    // (it clashes with the Tailwind utility); a block inside a composite section is re-rendered
    // on its own, not as part of the section root
    const blockSelector = '[data-block-name][data-aue-resource]:not([data-section-root])';
    const block = element.parentElement?.closest(blockSelector) || element?.closest(blockSelector);
    if (block) {
      const blockResource = block.getAttribute('data-aue-resource');
      const newBlock = parsedUpdate.querySelector(`[data-aue-resource="${blockResource}"]`);
      if (block.dataset.aueModel === 'form') {
        return true;
      } if (newBlock) {
        newBlock.style.display = 'none';
        const name = block.dataset.blockName;
        if (!block.parentElement?.classList.contains(`${name}-wrapper`)) {
          // ac-* blocks replace their wrapper once decorated, so the block sits in a section, a
          // grid or a column: give the new block a wrapper of its own, so decorateBlock marks that
          // one (not the parent) and the block takes its place
          const wrapper = document.createElement('div');
          block.insertAdjacentElement('afterend', wrapper);
          wrapper.append(newBlock);
        } else {
          block.insertAdjacentElement('afterend', newBlock);
        }
        decorateButtons(newBlock);
        decorateIcons(newBlock);
        decorateBlock(newBlock);
        decorateRichtext(newBlock);
        await loadBlock(newBlock);
        // a grid item of a container (aem-GridColumn...) stays one
        [...block.classList]
          .filter((cls) => cls.startsWith('aem-GridColumn'))
          .forEach((cls) => newBlock.classList.add(cls));
        block.remove();
        newBlock.style.display = null;
        return true;
      }
    } else {
      // sections and default content, may be multiple in the case of richtext
      const newElements = parsedUpdate.querySelectorAll(`[data-aue-resource="${resource}"],[data-richtext-resource="${resource}"]`);
      if (newElements.length) {
        const { parentElement } = element;
        if (element.matches('.section')) {
          const [newSection] = newElements;
          newSection.style.display = 'none';
          element.insertAdjacentElement('afterend', newSection);
          decorateButtons(newSection);
          decorateIcons(newSection);
          decorateRichtext(newSection);
          buildSectionBlocks(parentElement);
          decorateSections(parentElement);
          decorateBlocks(parentElement);
          await loadSections(parentElement);
          element.remove();
          newSection.style.display = null;
        } else {
          element.replaceWith(...newElements);
          decorateButtons(parentElement);
          decorateIcons(parentElement);
          decorateRichtext(parentElement);
        }
        return true;
      }
    }
  }

  return false;
}

async function attachEventListners(main) {
  [
    'aue:content-patch',
    'aue:content-update',
    'aue:content-add',
    'aue:content-move',
    'aue:content-remove',
    'aue:content-copy',
  ].forEach((eventType) => main?.addEventListener(eventType, async (event) => {
    event.stopPropagation();
    const applied = await applyChanges(event);
    if (!applied) window.location.reload();
  }));
  const module = await import('./form-editor-support.js');
  module.attachEventListners(main);
}

attachEventListners(document.querySelector('main'));
