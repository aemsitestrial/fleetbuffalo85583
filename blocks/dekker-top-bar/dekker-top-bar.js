import { TopBar } from '../../ds-eds-assets/js/dekker-top-bar.js';
import {
  blockRows, readBlockFields, html, imageProps, instrument, patchPicture,
  loadDekkerCss, render, replaceContent, uniqueId,
} from '../../ds-eds-tools/dekker-block.js';

/**
 * dekker-top-bar -- renders dekker-lib's TopBar from the design system's compiled DOM build
 * (ds-eds-assets/js/dekker-top-bar.js, package @ac-brandsframework/eds-assets-dekker) with its CSS
 * (ds-eds-assets/css/bundles/dekker-top-bar.css). Markup and look are the design system's; this
 * file only
 * reads the authored fields (_dekker-top-bar.json) and maps them onto the component's props.
 */

export default function decorate(block) {
  loadDekkerCss('dekker-top-bar');
  const { cells } = readBlockFields(blockRows(block), ['logo', 'logoAlt', 'logo2', 'logo2Alt', 'text']);
  const { node, root } = render(TopBar, {
    image: imageProps(cells.logo, cells.logoAlt, 'dekker-top-bar-logo'),
    image2: imageProps(cells.logo2, cells.logo2Alt, 'dekker-top-bar-logo'),
    text: { id: uniqueId('dekker-top-bar-text'), text: html(cells.text) || '' },
  });
  const images = root.querySelectorAll('.image');
  patchPicture(cells.logo, images[0]);
  patchPicture(cells.logo2, images[1]);
  instrument(cells.text, root.querySelector('.cmp-text'));
  replaceContent(block, node);
}
