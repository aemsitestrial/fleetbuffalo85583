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

function NavigationItem({
  active,
  children,
  current,
  level,
  link,
  title
}) {
  return jsxs("li", {
    className: cn(`cmp-navigation__item cmp-navigation__item--level-${level}`, {
      'cmp-navigation__item--active': active
    }),
    "data-cmp-data-layer": "",
    children: [link.valid ? jsx("a", _extends({}, current && {
      'aria-current': 'page'
    }, {
      "data-cmp-clickable": "",
      className: "cmp-navigation__item-link",
      href: link.url,
      children: title
    })) : jsx("span", {
      "data-cmp-clickable": "",
      className: "cmp-navigation__item-link",
      children: title
    }), children.length ? jsxs("ul", {
      className: "cmp-navigation__group",
      children: [' ', children.map(item => jsx(NavigationItem, _extends({}, item), item.id)), ' ']
    }) : null]
  });
}
function Navigation$1({
  id,
  className,
  items
}) {
  return jsx("div", {
    className: cn('navigation', className),
    children: jsx("nav", {
      id: id,
      className: "cmp-navigation",
      itemType: "http://schema.org/SiteNavigationElement",
      "data-cmp-data-layer": "",
      children: jsx("ul", {
        className: "cmp-navigation__group",
        children: items.length && items.map(item => jsx(NavigationItem, _extends({}, item), item.id))
      })
    })
  });
}

function StyleWrapper(props) { return props.children; }

const _excluded = ["useLocalStyles", "className"];
const LocalStyles = () => /*#__PURE__*/React.lazy(() => Promise.resolve().then(function () { return _dekkerDom_styleInject; }));
function Navigation(_ref) {
  let {
      useLocalStyles = true
    } = _ref,
    rest = _objectWithoutPropertiesLoose(_ref, _excluded);
  return jsx(StyleWrapper, {
    LocalStyles: LocalStyles,
    useLocalStyles: useLocalStyles,
    children: jsx(Navigation$1, _extends({}, rest))
  });
}

function LocalStyle() { return null; }

var _dekkerDom_styleInject = /*#__PURE__*/Object.freeze({
  __proto__: null,
  'default': LocalStyle
});

export { Navigation };
