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

function NewsCard$1({
  id,
  imagePath,
  title,
  description,
  className,
  pretitle,
  actions
}) {
  return jsx("div", {
    className: cn('teaser news-card', className),
    children: jsxs("div", {
      id: id,
      className: "cmp-teaser",
      "data-cmp-data-layer": "",
      children: [jsxs("div", {
        className: "cmp-teaser__content",
        children: [pretitle && jsx("p", {
          className: "cmp-teaser__pretitle",
          children: pretitle
        }), title && jsx("h2", {
          className: "cmp-teaser__title",
          children: title
        }), description && jsx("div", {
          className: "cmp-teaser__description",
          dangerouslySetInnerHTML: {
            __html: description
          }
        }), actions && actions.length ? jsx("div", {
          className: "cmp-teaser__action-container",
          children: jsx("a", {
            className: "cmp-teaser__action-link",
            id: actions[0].id,
            "data-cmp-data-layer": "",
            "data-cmp-clickable": "",
            href: actions[0].link.url,
            children: actions[0].title
          })
        }) : null]
      }), imagePath ? jsx("div", {
        className: "cmp-teaser__image",
        children: jsxs("div", {
          "data-asset-id": "c0a39183-23f4-48f0-8db7-bb41ba2b0122",
          id: `${id}-image`,
          "data-cmp-data-layer": "",
          className: "cmp-image",
          itemScope: true,
          itemType: "http://schema.org/ImageObject",
          children: [jsx("img", {
            srcSet: imagePath,
            loading: "lazy",
            className: "cmp-image__image",
            itemProp: "contentUrl",
            alt: title,
            title: title
          }), jsx("meta", {
            itemProp: "caption",
            content: title
          })]
        })
      }) : null]
    })
  });
}

function StyleWrapper(props) { return props.children; }

const _excluded = ["useLocalStyles", "highlight"];
const LocalStyles = () => /*#__PURE__*/React.lazy(() => Promise.resolve().then(function () { return _dekkerDom_styleInject; }));
function NewsCard(_ref) {
  let {
      useLocalStyles = true,
      highlight
    } = _ref,
    rest = _objectWithoutPropertiesLoose(_ref, _excluded);
  return jsx(StyleWrapper, {
    LocalStyles: LocalStyles,
    useLocalStyles: useLocalStyles,
    children: jsx(NewsCard$1, _extends({}, rest, {
      className: cn({
        'ds-brand-news-card': useLocalStyles
      }, highlight && `ds-brand-news-card--highlight-${highlight}`, rest.className)
    }))
  });
}

function LocalStyle() { return null; }

var _dekkerDom_styleInject = /*#__PURE__*/Object.freeze({
  __proto__: null,
  'default': LocalStyle
});

export { NewsCard };
