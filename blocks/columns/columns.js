import { prepareNestedBlocks, loadNestedBlocks } from '../../scripts/nested-blocks.js';

export default async function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);

  // nested blocks first, so the image-column logic below doesn't touch their inner cells
  const nested = await prepareNestedBlocks(block);

  // setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      if (nested.some((el) => col.contains(el))) return;
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

  await loadNestedBlocks(nested);
}
