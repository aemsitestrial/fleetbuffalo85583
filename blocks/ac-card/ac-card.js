import { moveInstrumentation } from '../../scripts/scripts.js';
import { loadCSS } from '../../scripts/aem.js';
import renderCard from './render-card.js';

/**
 * AC Card — one card, authored flat (its own fields directly on the block,
 * no item wrapper). Dropped directly into a Section (component-filters.json:
 * listed in section's own filter, same slot as Text/Image/etc.) — the
 * standalone counterpart to a Cards-grid item (see ac-container.js,
 * which uses the native block/v1/block/item pattern instead of this file for
 * its own repeatable children; this file is section-level only).
 *
 * A genuinely flat (no-filter) xwalk component gets an extra wrapper layer
 * between the `.block` element decorate() receives and its own
 * data-aue-resource — the resource ends up on an inner child div, not on
 * `.block` itself, so editor-support.js's `.block[data-aue-resource]`
 * lookup never matches, and Universal Editor falls through to a raw,
 * undecorated replaceWith on every edit instead of re-running decorate().
 * Fixed below by copying (not moving — moveAttributes deletes the source)
 * the resource identity onto `block` itself whenever it's missing.
 *
 * This is unrelated to and unaffected by the separate nested-block question
 * ac-container.js answers differently (native item pattern, no
 * independent block-decoration per card) — this file is only ever the
 * section-level, flat, standalone shape.
 */
export default function decorate(block) {
  // Shared with ac-container.js (same card markup). Loads straight
  // from ds-eds-assets/css/bundles/ (what the eds-assets npm package
  // ships), not a hand-copied blocks/ac-card/ac-card-component.css that
  // nothing would keep in sync with the DS repo. loadCSS is idempotent
  // (checks for an existing <link> with this href first), so this is a
  // no-op if the grid block on the same page already triggered it.
  loadCSS(`${window.hlx.codeBasePath}/ds-eds-assets/css/bundles/ac-card.css`);

  const [firstChild] = [...block.children];
  const hasInnerResource = firstChild?.hasAttribute('data-aue-resource');
  const cells = hasInnerResource ? [...firstChild.children] : [...block.children];

  if (hasInnerResource && !block.hasAttribute('data-aue-resource')) {
    ['data-aue-resource', 'data-aue-type', 'data-aue-behavior', 'data-aue-model', 'data-aue-label', 'data-aue-component']
      .forEach((attr) => {
        const value = firstChild.getAttribute(attr);
        if (value) block.setAttribute(attr, value);
      });
  }

  const card = renderCard(cells);
  if (hasInnerResource) moveInstrumentation(firstChild, card);

  block.textContent = '';
  block.classList.add('ac-core');
  block.append(card);
}
