import { decorateBlock, loadBlock } from '../../scripts/aem.js';

/**
 * Blocks authored inside a column cell (e.g. ac-* components) sit below the
 * `div.section > div > div` level that decorateBlocks() handles, so they are
 * decorated and loaded here.
 */
async function loadNestedBlocks(block) {
  const nested = [...block.querySelectorAll(':scope > div > div > div[class]')]
    .filter((el) => !el.dataset.blockStatus);
  nested.forEach(decorateBlock);
  await Promise.all(nested.map((el) => loadBlock(el)));
}

export default async function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);

  // setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          // picture is only content in column
          picWrapper.classList.add('columns-img-col');
        }
      }
    });
  });

  await loadNestedBlocks(block);
}
