export class BurgerController {
  constructor(options) {
    this.$toggler = document.querySelector(options.togglerSelector);
    this._isClickedToggler = options.isClickedToggler || false;
    this.initClassname = 'ds-toggler--initialize';
    this.activeClass = 'cmp-button--active';

    this.init();
  }

  get isClickedToggler() {
    return this._isClickedToggler;
  }

  set isClickedToggler(value) {
    if (value) {
      this.$toggler.classList.add(this.activeClass);
    } else {
      this.$toggler.classList.remove(this.activeClass);
    }
    this._isClickedToggler = value;
  }

  init() {
    this.$toggler.classList.add(this.initClassname);
  }

  togglerClick(callback) {
    this.$toggler.addEventListener('click', () => {
      this.isClickedToggler = !this.isClickedToggler;
      callback(this.isClickedToggler);
    });
  }
}
