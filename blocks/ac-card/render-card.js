import { Teaser } from '../../ds-eds-assets/js/teaser.js';
import { loadCSS } from '../../scripts/aem.js';
import FIELDS from './fields.js';
import {
  readCells, buildProps, instrumentFields, applyClassFields,
} from '../../ds-eds-tools/field-reader.js';
import uniqueId from '../../ds-eds-tools/unique-id.js';

const CARD_TYPE_FIELD = FIELDS.find((f) => f.name === 'cardType');
// "card-content" already ships via ac-card.js's own loadCSS call for
// ds-eds-assets/css/bundles/ac-card.css (teaser + ac-teaser + card-content)
// -- only the other 4 types need an extra lazy load here, each reusing its
// own already-built per-type CSS bundle instead of a new one.
const CARD_TYPE_CSS_SKIP = 'card-content';

/**
 * Teaser() always renders a plain <img>, so an authored <picture>
 * (responsive sources) needs to be swapped back in after the fact,
 * carrying over the <img>'s own class.
 *
 * The class has to go on the picture's own <img> (the one actually kept),
 * not on Teaser's placeholder <img> that replaceChild() below discards --
 * adding it to the placeholder leaves the real image with no matching
 * object-fit rule.
 */
function patchPicture(imageCell, card) {
  const picture = imageCell?.querySelector('picture');
  if (!picture) return;
  const el = card.querySelector('.cmp-image');
  if (!el) return;
  const img = el.querySelector('img');
  el.replaceChild(picture, img);
  picture.querySelector('img')?.classList.add('cmp-image__image');
}

/**
 * Shared per-card rendering, used by both ac-card.js (standalone, flat on
 * the block) and ac-container.js (one call per row/item, native
 * Cards-block pattern). Takes the field cells only - callers own deciding
 * where those cells come from and what to do with the block's own
 * instrumentation; this function only ever touches the cells and the card
 * it builds, never a block or item element directly.
 *
 * Field-by-field logic (which cell reads which way, which prop or class it
 * becomes, which selector gets its instrumentation moved back) is driven
 * entirely by FIELDS (see blocks/ac-card/fields.js, generated from
 * component-models.json + the DS repo's @eds* annotations) via
 * ds-eds-tools/field-reader.js's shared engine — this file only keeps the
 * two things that aren't field-driven: the <picture> patch above, and the
 * two base classes below.
 *
 * `cardType` (5 names — CardContent/CardAem/CardFeature/CardIcon/
 * CardProduct) is a field-driven `class` value like styleVariant/
 * cardModifier: every ac-card is one of the 5, chosen by that field, so
 * there is one ac-card block rather than a separate block per card type.
 */
export default function renderCard(cells) {
  const { values, cellsByName } = readCells(cells, FIELDS);

  const card = Teaser({
    id: uniqueId('card'),
    imageLinkHidden: true,
    titleLinkHidden: true,
    ...buildProps(values, FIELDS),
  });

  const cardTypeClass = values.cardType || CARD_TYPE_FIELD.default;
  const cardSlug = cardTypeClass.replace(/^ac-core-/, '');
  if (cardSlug !== CARD_TYPE_CSS_SKIP) {
    // Loads straight from ds-eds-assets/, not a hand-copied
    // blocks/ac-${cardSlug}/ac-${cardSlug}.css.
    loadCSS(`${window.hlx.codeBasePath}/ds-eds-assets/css/bundles/ac-${cardSlug}.css`);
  }

  // Not field-driven — every ac-card is one of these, regardless of what's
  // authored.
  card.classList.add('teaserv2', 'ac-core-teaser');
  applyClassFields(card, values, FIELDS);

  instrumentFields(cellsByName, values, card, FIELDS);
  patchPicture(cellsByName.image, card);

  return card;
}
