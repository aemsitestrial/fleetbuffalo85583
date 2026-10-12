import { Header } from '../../ds-eds-assets/js/dekker-header.js';
import { HeaderController } from '../../ds-eds-assets/js/vendor/header.controller.js';
import {
  blockRows, readBlockFields, text, html, imageProps, navigationItems, patchPicture,
  loadDekkerCss, render, replaceContent, uniqueId,
} from '../../ds-eds-tools/dekker-block.js';

/**
 * dekker-header -- renders dekker-lib's Header from the design system's compiled DOM build
 * (ds-eds-assets/js/dekker-header.js, package @ac-brandsframework/eds-assets-dekker) with its CSS
 * (ds-eds-assets/css/bundles/dekker-header.css). Markup and look are the design system's; this file
 * only
 * reads the authored fields (_dekker-header.json) and maps them onto the component's props.
 * The top bar takes two logos and a text; both navigations are authored as (nested) lists.
 * themeColor: a class from ds-eds-assets/js/options/header.js. Burger and mega menu behaviour is
 * the dekker-lib HeaderController (ds-eds-assets/js/vendor/header.controller.js).
 */

const FIELDS = ['logo', 'logoAlt', 'logo2', 'logo2Alt', 'topText', 'mainNavigation', 'menuNavigation', 'themeColor'];

export default function decorate(block) {
  loadDekkerCss('dekker-header');
  const { cells } = readBlockFields(blockRows(block), FIELDS);
  const navigation = (cell) => ({
    id: uniqueId('dekker-header-navigation'), items: navigationItems(cell), dataLayer: {}, ':type': 'navigation',
  });
  const { node, root } = render(Header, {
    id: uniqueId('dekker-header'),
    top_bar: {
      image: imageProps(cells.logo, cells.logoAlt, 'dekker-header-logo'),
      image2: imageProps(cells.logo2, cells.logo2Alt, 'dekker-header-logo'),
      text: { id: uniqueId('dekker-header-text'), text: html(cells.topText) || '' },
    },
    main_navigation: navigation(cells.mainNavigation),
    menu_navigation: navigation(cells.menuNavigation),
    className: text(cells.themeColor),
  });
  const images = root.querySelectorAll('.ds-brand-top-bar .image');
  patchPicture(cells.logo, images[0]);
  patchPicture(cells.logo2, images[1]);
  replaceContent(block, node);
  new HeaderController().init();
}
