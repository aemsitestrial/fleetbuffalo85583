export class NavigationController {
  constructor(options) {
    this.$menu = document.querySelector(options.menu) || null;
    this.$parent = document.querySelector(options.parent) || this.$menu.parent;
    this.initClassname = 'ds-navigation--initialize';
    this._isOpen = options.isOpen || false;
    this.navActiveClassName = 'ds-brand-header--nav-active';
    this.menuItemSelector = 'cmp-navigation__item';
    this.menuItemLinkSelector = 'cmp-navigation__item-link';
    this.submenuSelector = '.cmp-navigation__group';
    this.submenuActiveSelector = 'cmp-navigation__group--active';
    this.hiddenClassname = 'hidden';
    this.hasChildredClassname = 'has-children';
    this.activeMenuItemClassname = 'cmp-navigation__item--active';

    this.commonMenuSelector = '.ds-brand-header__menu-navigation';

    this.init();
  }

  init() {
    if (!this.$menu) return;
    if (this.$menu.classList.contains(this.initClassname)) return;
    this.$menu.classList.add(this.initClassname);
    this.setHasChildredClassMenuItems();
    this.baseHideSubmenus();
    this.togglerEventsMenuItems();

    this.setHeadingCategoryLinkForSubmenu();

    if (this._isOpen) {
      this.isOpen = this._isOpen;
    }
  }

  get isOpen() {
    return this._isOpen;
  }

  set isOpen(value) {
    if (value) {
      this.$parent.classList.add(this.navActiveClassName);
      // this.setFocusOnFirstLinkInMegaMenu();
    } else {
      this.$parent.classList.remove(this.navActiveClassName);
    }
    this._isOpen = value;
  }

  setHasChildredClassMenuItems() {
    this.$menu.querySelectorAll(`.${this.menuItemSelector}`).forEach((item) => {
      const submenu = item.querySelector(this.submenuSelector);
      if (submenu) {
        item.classList.add(this.hasChildredClassname);
      }
    });
  }

  baseHideSubmenus() {
    this.$menu.querySelectorAll(`.${this.menuItemSelector}`).forEach((item) => {
      if (item.classList.contains(`${this.menuItemSelector}--level-0`)) {
        item.classList.remove(this.activeMenuItemClassname);
        const $submenu = item.querySelector(this.submenuSelector);
        if (!$submenu) return;
        $submenu.classList.add(this.hiddenClassname);
      }
    });
  }

  togglerEventsMenuItems() {
    this.$menu.querySelectorAll(`.${this.menuItemSelector}`).forEach((item) => {
      const $link = item.querySelector(`.${this.menuItemLinkSelector}`);
      if (!$link) return;

      const isZeroLevel = item.classList.contains(`${this.menuItemSelector}--level-0`);

      if (isZeroLevel) {
        this.togglerForZeroLevelMenuItems(item, $link);
      } else {
        this.togglerForOtherLevelMenuItems(item, $link);
      }
    });
  }

  togglerForZeroLevelMenuItems(itemLink, linkEl) {
    linkEl.addEventListener('click', (e) => {
      this.baseHideSubmenus();
      const submenu = itemLink.querySelector(this.submenuSelector);
      if (!submenu) return;
      e.preventDefault();
      itemLink.classList.toggle(this.activeMenuItemClassname);
      submenu.classList.toggle(this.hiddenClassname);
      submenu.classList.toggle(this.submenuActiveSelector);
    });
  }

  togglerForOtherLevelMenuItems(itemLink, linkEl) {
    linkEl.addEventListener('click', (e) => {
      const submenu = itemLink.querySelector(this.submenuSelector);
      if (!submenu) {
        return;
      }
      // e.preventDefault();

      itemLink.classList.toggle(this.activeMenuItemClassname);

      if (submenu.classList.contains(this.submenuActiveSelector)) {
        submenu.classList.remove(this.hiddenClassname);
        submenu.classList.remove(this.submenuActiveSelector);
      } else {
        submenu.classList.add(this.submenuActiveSelector);
      }
    });
  }

  setActiveMenu(indexMenu) {
    this.$menu.querySelectorAll(`.${this.menuItemSelector}--level-0`).forEach((item, index) => {
      if (indexMenu === index) {
        item.classList.add(this.activeMenuItemClassname);
        const link = item.querySelector(`.${this.menuItemLinkSelector}`);

        const $submenu = item.querySelector(this.submenuSelector);
        if (!$submenu) return;
        $submenu.classList.remove(this.hiddenClassname);
        $submenu.classList.add(this.submenuActiveSelector);
        setTimeout(() => {
          link.focus();
        }, 100);
      }
    });
  }

  setHeadingCategoryLinkForSubmenu() {
    const menuItemsZeroLevel = this.$parent.querySelectorAll(
      `${this.commonMenuSelector} .${this.menuItemSelector}--level-0`,
    );
    menuItemsZeroLevel.forEach((item) => {
      if (!item.classList.contains(this.hasChildredClassname)) return;
      const link = item.querySelector(`.${this.menuItemLinkSelector}`);
      const submenu = item.querySelector(this.submenuSelector);

      const linkHref = link.getAttribute('href');
      const linkText = link.textContent;

      submenu.prepend(this.createAndGetHeadngCategoryLink(linkHref, linkText));
    });
  }

  createAndGetHeadngCategoryLink(href, text) {
    const headingCategoryLi = document.createElement('li');
    headingCategoryLi.className = `${this.menuItemSelector} ${this.menuItemSelector}--level-1`;
    headingCategoryLi.setAttribute('data-cmp-data-layer', '');

    const headingCategoryLink = document.createElement('a');
    headingCategoryLink.className = this.menuItemLinkSelector;
    headingCategoryLink.setAttribute('data-cmp-clickable', '');
    headingCategoryLink.setAttribute('href', href);
    headingCategoryLink.innerText = text;

    headingCategoryLi.append(headingCategoryLink);

    return headingCategoryLi;
  }

  setFocusOnFirstLinkInMegaMenu() {
    setTimeout(() => {
      const btn = document.querySelector('.ds-brand-top-bar__hamburger > button');
      btn.blur();
      const link = this.$menu.querySelector(`.${this.menuItemSelector}--level-0 > .cmp-navigation__item-link`);
      // link.focus();
    }, 100);
  }
}
