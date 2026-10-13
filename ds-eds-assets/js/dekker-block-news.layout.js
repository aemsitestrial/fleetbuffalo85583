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

var Title = slotComponent("Title");

var Button = slotComponent("Button");

var NewsCard = slotComponent("NewsCard");

function BlockNews({
  className,
  heading,
  link,
  items,
  background
}) {
  return jsx("div", {
    className: cn('ds-block-news container responsivegrid aem-GridColumn aem-GridColumn--default--12', background && `ds-block-news--${background}`, className),
    children: jsx("div", {
      className: "cmp-container",
      children: jsxs("div", {
        className: "aem-Grid aem-Grid--12 aem-Grid--default--12",
        children: [jsx("div", {
          className: "container responsivegrid aem-GridColumn aem-GridColumn--default--12",
          children: jsx("div", {
            className: "cmp-container",
            children: jsxs("div", {
              className: "aem-Grid aem-Grid--12 aem-Grid--default--12",
              children: [heading ? jsx("div", {
                className: "aem-GridColumn--small-screen--12 aem-GridColumn--offset--large-screens--0 aem-GridColumn--extra-small-screen--none aem-GridColumn--default--none aem-GridColumn--small-screen--none aem-GridColumn--offset--small-screen--0 aem-GridColumn--offset--default--0 aem-GridColumn--extra-small-screen--12 aem-GridColumn--large-screens--none aem-GridColumn--medium-screens--6 aem-GridColumn aem-GridColumn--offset--medium-screens--0 aem-GridColumn--default--6 aem-GridColumn--medium-screens--none aem-GridColumn--large-screens--6 aem-GridColumn--offset--extra-small-screen--0",
                children: jsx(Title, {
                  id: "title-1'",
                  type: "h2",
                  text: "Latest News"
                })
              }) : null, link ? jsx("div", {
                className: "aem-GridColumn--small-screen--12 aem-GridColumn--offset--large-screens--0 aem-GridColumn--extra-small-screen--none aem-GridColumn--default--none aem-GridColumn--small-screen--none aem-GridColumn--offset--small-screen--0 aem-GridColumn--offset--default--0 aem-GridColumn--extra-small-screen--12 aem-GridColumn--large-screens--none aem-GridColumn--medium-screens--6 aem-GridColumn aem-GridColumn--offset--medium-screens--0 aem-GridColumn--default--6 aem-GridColumn--medium-screens--none aem-GridColumn--large-screens--6 aem-GridColumn--offset--extra-small-screen--0",
                children: jsx(Button, {
                  type: "primary",
                  id: "button-1",
                  text: link
                })
              }) : null]
            })
          })
        }), items.length ? jsx("div", {
          className: "ds-splide-carousel ds-splide-carousel-news ds-brand-splide-carousel container responsivegrid aem-GridColumn aem-GridColumn--default--12",
          children: jsx("div", {
            className: "cmp-container",
            children: jsx("div", {
              className: "aem-Grid aem-Grid--12 aem-Grid--default--12",
              children: items.map(item => jsx("div", {
                className: "aem-GridColumn--small-screen--12 aem-GridColumn--extra-small-screen--none aem-GridColumn--default--none aem-GridColumn--medium-screens--12 aem-GridColumn--small-screen--none aem-GridColumn--offset--small-screen--0 aem-GridColumn--offset--default--0 aem-GridColumn--extra-small-screen--12 aem-GridColumn aem-GridColumn--offset--medium-screens--0 aem-GridColumn--medium-screens--none aem-GridColumn--default--4 aem-GridColumn--offset--extra-small-screen--0 splide__slide",
                children: jsx(NewsCard, _extends({}, item, {
                  className: "ds-brand-news-card--highlight-gold"
                }))
              }, item.id))
            })
          })
        }) : null]
      })
    })
  });
}

export { BlockNews, collectSlots };
