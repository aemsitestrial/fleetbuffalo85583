// and run: new BurgerController().init();
import { BurgerController } from './burger.controller.js';
import { NavigationController } from './navigation.controller.js';

export class HeaderController {
  constructor() {
    this.$el = document.querySelector('.ds-brand-header');
    this.initClassname = 'ds-brand-header--initialize';
    this.$mainNavigation = this.$el.querySelector('.ds-brand-header__main-navigation .navigation');
    this.mainNavigationItemSelector = 'cmp-navigation__item';
    this.mainNavigationItemLinkSelector = 'cmp-navigation__item-link';
    this.headerNavActiveClassname = 'ds-nav-active';
    this.$body = document.querySelector('.ds-dekker');

    this.megaMenuEl = document.querySelector('.ds-brand-menu-navigation');

    this.togglerInstance = new BurgerController({
      togglerSelector: '.ds-brand-top-bar__hamburger .cmp-button',
    });

    this.menuInstance = new NavigationController({
      parent: '.ds-brand-header',
      menu: '.ds-brand-header__menu-navigation',
      isOpen: false,
    });
  }

  // Initialize methods here.
  init() {
    if (!this.$el) return;
    if (this.$el.classList.contains(this.initClassname)) return;
    this.$el.classList.add(this.initClassname);
    this.togglerInstance.togglerClick((value) => {
      if (value) {
        this.openMenu();
      } else {
        this.closeMenu();
      }
    });
    this.togglerMenuItems();
    this.escHandleCloseMenu();
    this.closeMenuClickOutside();
  }

  escHandleCloseMenu() {
    document.addEventListener('keydown', (e) => {
      if (!this.menuInstance.isOpen) return;
      e = e || window.event;
      if (e.keyCode == 27) {
        this.closeMenu();
      }
    });
  }

  closeMenuClickOutside() {
    window.addEventListener('click', (e) => {
      if (this.menuInstance.isOpen && !this.$el.contains(e.target)) {
        this.closeMenu();
      }
    });
  }

  openMenu() {
    this.menuInstance.isOpen = true;
    this.togglerInstance.isClickedToggler = true;
    this.$body.classList.add(this.headerNavActiveClassname);
    setTimeout(() => {
      const link = this.megaMenuEl.querySelectorAll(`.${this.mainNavigationItemSelector} > a`)[0];
      link.focus();
    }, 100);
  }

  closeMenu() {
    this.menuInstance.isOpen = false;
    this.togglerInstance.isClickedToggler = false;
    this.$body.classList.remove(this.headerNavActiveClassname);
  }

  togglerMenuItems() {
    const $items = this.$mainNavigation.querySelectorAll(`.${this.mainNavigationItemSelector}`);
    const $megaLevelZeroItems = this.megaMenuEl.querySelectorAll(`.${this.mainNavigationItemSelector}--level-0`);
  
    $items.forEach((item, index) => {
      const $linkEl = item.querySelector(`.${this.mainNavigationItemLinkSelector}`);
      if (!$linkEl) return;
  
      $linkEl.addEventListener('click', (e) => {
        const correspondingMegaItem = $megaLevelZeroItems[index];
  
        if (!correspondingMegaItem || 
            !correspondingMegaItem.querySelector('.cmp-navigation__group')) {
          this.closeMenu(); 
          return; 
        }

        e.preventDefault();
  
        this.$body.classList.add(this.headerNavActiveClassname);
        this.menuInstance.baseHideSubmenus();
        this.menuInstance.setActiveMenu(index);
        this.togglerInstance.isClickedToggler = true;
        this.menuInstance.isOpen = true;
      });
    });
  }
}
