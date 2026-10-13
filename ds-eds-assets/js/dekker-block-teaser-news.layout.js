import { jsx } from './vendor/jsx-runtime.js';

function _extends() {
  return _extends = Object.assign ? Object.assign.bind() : function (n) {
    for (var e = 1; e < arguments.length; e++) {
      var t = arguments[e];
      for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
    }
    return n;
  }, _extends.apply(null, arguments);
}

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

let current = null;

// A component that renders an empty placeholder and records the props it was called with.
function slotComponent(name) {
  function Slot(props) {
    const element = document.createElement('div');
    element.setAttribute('data-eds-slot', name);
    if (current) current.push({ name, props: props || {}, element });
    return element;
  }
  return Slot;
}

// Runs render() and returns what it rendered and the slots it filled, in render order.
function collectSlots(render) {
  const previous = current;
  current = [];
  try {
    const node = render();
    return { node, slots: current };
  } finally {
    current = previous;
  }
}

var TeaserNews = slotComponent("TeaserNews");

function BlockTeaserNews({
  className,
  items
}) {
  return jsx("div", {
    className: cn('ds-block-teaser-news container responsivegrid aem-GridColumn aem-GridColumn--default--12', className),
    children: jsx("div", {
      className: "cmp-container",
      children: items.length ? jsx("div", {
        className: "aem-Grid aem-Grid--12 aem-Grid--default--12",
        children: items.map(item => jsx("div", {
          className: cn(item.columnClassname),
          children: jsx(TeaserNews, _extends({}, item))
        }, item.id))
      }) : null
    })
  });
}

export { BlockTeaserNews, collectSlots };
