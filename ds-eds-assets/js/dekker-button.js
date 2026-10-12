import { jsx, jsxs } from './vendor/jsx-runtime.js';

function _extends() {
  return _extends = Object.assign ? Object.assign.bind() : function (n) {
    for (var e = 1; e < arguments.length; e++) {
      var t = arguments[e];
      for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
    }
    return n;
  }, _extends.apply(null, arguments);
}
function _objectWithoutPropertiesLoose(r, e) {
  if (null == r) return {};
  var t = {};
  for (var n in r) if ({}.hasOwnProperty.call(r, n)) {
    if (-1 !== e.indexOf(n)) continue;
    t[n] = r[n];
  }
  return t;
}

const lazy = () => function LazyLocalStyles() { return null; };
var React = { lazy };

var classnames = {exports: {}};

/*!
	Copyright (c) 2018 Jed Watson.
	Licensed under the MIT License (MIT), see
	http://jedwatson.github.io/classnames
*/

(function (module) {
/* global define */

(function () {

	var hasOwn = {}.hasOwnProperty;

	function classNames () {
		var classes = '';

		for (var i = 0; i < arguments.length; i++) {
			var arg = arguments[i];
			if (arg) {
				classes = appendClass(classes, parseValue(arg));
			}
		}

		return classes;
	}

	function parseValue (arg) {
		if (typeof arg === 'string' || typeof arg === 'number') {
			return arg;
		}

		if (typeof arg !== 'object') {
			return '';
		}

		if (Array.isArray(arg)) {
			return classNames.apply(null, arg);
		}

		if (arg.toString !== Object.prototype.toString && !arg.toString.toString().includes('[native code]')) {
			return arg.toString();
		}

		var classes = '';

		for (var key in arg) {
			if (hasOwn.call(arg, key) && arg[key]) {
				classes = appendClass(classes, key);
			}
		}

		return classes;
	}

	function appendClass (value, newClass) {
		if (!newClass) {
			return value;
		}
	
		if (value) {
			return value + ' ' + newClass;
		}
	
		return value + newClass;
	}

	if (module.exports) {
		classNames.default = classNames;
		module.exports = classNames;
	} else {
		window.classNames = classNames;
	}
}());
}(classnames));

var cn = classnames.exports;

const _excluded$1 = ["id", "text", "buttonLink", "target", "className", "typeTransform", "type", "icon", "colorType", "disabled", "dataLayer", "AEMclassNameSlot1", "AEMclassNameSlot2", "AEMclassNameSlot3", "useRootClassName"];
const Button$1 = _ref => {
  let {
      id,
      text,
      buttonLink,
      target = '_parent',
      className,
      typeTransform,
      type,
      icon,
      colorType,
      disabled,
      AEMclassNameSlot1,
      AEMclassNameSlot2,
      AEMclassNameSlot3,
      useRootClassName = true
    } = _ref,
    props = _objectWithoutPropertiesLoose(_ref, _excluded$1);
  const typeTextTransform = cn({
    'text-lowercase': typeTransform === 'lowercase',
    'text-uppercase': typeTransform === 'uppercase',
    'text-capitalize': typeTransform === 'capitalize'
  });
  const extraClasses = cn({
    AEMclassNameSlot1,
    AEMclassNameSlot2,
    AEMclassNameSlot3
  });
  const buttonType = cn({
    'cmp-button--primary': type === 'primary',
    'cmp-button--secondary': type === 'secondary',
    'cmp-button--tetriary': type === 'tetriary'
  });
  const buttonColorType = cn({
    'cmp-button--color-primary': colorType === 'primary',
    'cmp-button--color-secondary': colorType === 'secondary'
  });
  const getButtonStructure = () => jsxs("button", _extends({}, props, {
    id: id,
    type: "button",
    className: cn('cmp-button'),
    "data-cmp-clickable": "",
    "data-cmp-data-layer": "",
    disabled: disabled,
    children: [icon && jsx("span", {
      className: cn(`cmp-button__icon cmp-button__icon--${icon}`),
      "aria-hidden": "true"
    }), jsx("span", {
      className: "cmp-button__text",
      children: text
    })]
  }));
  const getLinkStructure = () => jsxs("a", _extends({}, props, {
    id: id,
    href: buttonLink == null ? void 0 : buttonLink.url,
    target: target,
    className: "cmp-button",
    "data-cmp-clickable": "",
    "data-cmp-data-layer": "",
    children: [icon && jsx("span", {
      className: cn(`cmp-button__icon cmp-button__icon--${icon}`),
      "aria-hidden": "true"
    }), jsx("span", {
      className: "cmp-button__text",
      children: text
    })]
  }));
  return jsx("div", {
    className: cn(useRootClassName ? 'button' : '', className, typeTextTransform, buttonType, buttonColorType, extraClasses),
    children: buttonLink && buttonLink.url ? getLinkStructure() : getButtonStructure()
  });
};

function StyleWrapper(props) { return props.children; }

const _excluded = ["useLocalStyles", "size", "fontWeight", "className"];
const LocalStyles = () => /*#__PURE__*/React.lazy(() => Promise.resolve().then(function () { return _dekkerDom_styleInject; }));
function Button(_ref) {
  let {
      useLocalStyles = true,
      size,
      fontWeight,
      className
    } = _ref,
    rest = _objectWithoutPropertiesLoose(_ref, _excluded);
  const buttonSize = cn({
    'cmp-button--md': size === 'md',
    'cmp-button--lg': size === 'lg'
  });
  const buttonFontWeight = cn({
    'cmp-button--medium': fontWeight === 'medium',
    'cmp-button--semibold': fontWeight === 'semibold',
    'cmp-button--bold': fontWeight === 'bold'
  });
  const updateClassname = cn(className, buttonSize, buttonFontWeight);
  return jsx(StyleWrapper, {
    LocalStyles: LocalStyles,
    useLocalStyles: useLocalStyles,
    children: jsx(Button$1, _extends({}, rest, {
      className: updateClassname
    }))
  });
}

function LocalStyle() { return null; }

var _dekkerDom_styleInject = /*#__PURE__*/Object.freeze({
  __proto__: null,
  'default': LocalStyle
});

export { Button };
