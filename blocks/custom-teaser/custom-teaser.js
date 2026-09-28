import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const root = document.createElement('div');

  root.className = 'teaser';

  const teaser = document.createElement('div');
  teaser.className = 'cmp-teaser';

  moveInstrumentation(block, teaser);

  const content = document.createElement('div');
  content.className = 'cmp-teaser__content';

  [...block.children].forEach((row) => {
    const cells = [...row.children];

    if (!cells.length) return;

    // Pretitle
    if (cells.length === 1) {
      const pretitle = cells[0];
      pretitle.className = 'cmp-teaser__pretitle';

      content.append(pretitle);
      return;
    }

    // Title
    if (cells.length === 2) {
      const title = cells[0];
      title.className = 'cmp-teaser__title';

      const description = cells[1];
      description.className = 'cmp-teaser__description';

      content.append(title, description);
      return;
    }

    // Actions
    const actions = document.createElement('div');
    actions.className = 'cmp-teaser__action-container';

    cells.forEach((cell) => {
      const link = cell.querySelector('a');

      if (link) {
        link.className = 'cmp-teaser__action-link';
        link.dataset.cmpClickable = '';

        moveInstrumentation(cell, link);

        actions.append(link);
      }
    });

    if (actions.children.length) {
      content.append(actions);
    }
  });

  teaser.append(content);

  root.append(teaser);

  block.replaceChildren(root);
}
