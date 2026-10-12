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

const _excluded$1 = ["uuid", "id", "srcset", "target", "alt", "ratio", "imageLink", "title", "lazyEnabled", "className", "useCaption", "dataLayer"];
function Image(_ref) {
  let {
      uuid,
      id,
      srcset,
      target,
      alt,
      ratio,
      imageLink,
      title,
      lazyEnabled,
      className,
      useCaption
    } = _ref,
    rest = _objectWithoutPropertiesLoose(_ref, _excluded$1);
  const imageRatioType = cn({
    'image--16-9': ratio === '16:9',
    'image--4-3': ratio === '4:3',
    'image--1-1': ratio === '1:1',
    'image--21-9': ratio === '21:9'
  });
  const loading = lazyEnabled ? 'lazy' : undefined;
  return jsx("div", {
    className: cn('image', imageRatioType, className),
    children: jsxs("div", {
      "data-asset-id": uuid,
      id: id,
      "data-cmp-data-layer": "",
      className: "cmp-image",
      children: [imageLink ? jsx("a", {
        className: "cmp-image__link",
        "data-cmp-clickable": "",
        href: imageLink.url,
        target: target,
        children: jsx("img", _extends({
          alt: alt,
          srcSet: srcset,
          loading: loading
        }, rest))
      }) : jsx("img", _extends({
        alt: alt,
        srcSet: srcset,
        loading: loading
      }, rest)), useCaption && jsx("span", {
        className: "cmp-image__title",
        itemProp: title,
        children: alt
      }), !useCaption && jsx("meta", {
        itemProp: "caption",
        content: title
      })]
    })
  });
}

function Text$1({
  id,
  text,
  icon,
  className
}) {
  const iconCn = cn({
    'ds-brand-text--icon-call': icon === 'call',
    'ds-brand-text--icon-contact-mail': icon === 'contact_mail',
    'ds-brand-text--icon-email': icon === 'email',
    'ds-brand-text--icon-account': icon === 'account',
    'ds-brand-text--icon-language': icon === 'language',
    'ds-brand-text--icon-arrow-left': icon === 'arrow-left',
    'ds-brand-text--icon-arrow-right': icon === 'arrow-right',
    'ds-brand-text--icon-pin-drop': icon === 'pin-drop',
    'ds-brand-text--icon-3d-rotation': icon === '3d-rotation',
    'ds-brand-text--icon-alarm': icon === 'alarm'
  });
  const withIconCn = icon && iconCn;
  return jsx("div", {
    className: cn('text', className, withIconCn),
    children: jsx("div", {
      id: id,
      className: "cmp-text",
      dangerouslySetInnerHTML: {
        __html: text
      }
    })
  });
}

function StyleWrapper(props) { return props.children; }

const lazy = () => function LazyLocalStyles() { return null; };
var React = { lazy };

const _excluded = ["useLocalStyles", "variant", "className"];
const LocalStyles = () => /*#__PURE__*/React.lazy(() => Promise.resolve().then(function () { return _dekkerDom_styleInject; }));
function Text(_ref) {
  let {
      useLocalStyles = true,
      variant,
      className
    } = _ref,
    rest = _objectWithoutPropertiesLoose(_ref, _excluded);
  return jsx(StyleWrapper, {
    LocalStyles: LocalStyles,
    useLocalStyles: useLocalStyles,
    children: jsx(Text$1, _extends({}, rest, {
      className: cn(variant && `ds-brand-${variant}`, className)
    }))
  });
}

function TopBar({
  image,
  image2,
  text
}) {
  return jsx("div", {
    className: "container responsivegrid ds-brand-top-bar",
    children: jsx("div", {
      className: "cmp-container",
      children: jsx("div", {
        className: "container responsivegrid ds-brand-top-bar__container",
        children: jsxs("div", {
          className: "cmp-container",
          children: [jsx("div", {
            className: "container responsivegrid ds-brand-top-bar__left",
            children: jsxs("div", {
              className: "cmp-container",
              children: [jsx("div", {
                className: "button ds-brand-top-bar__hamburger",
                children: jsx("button", {
                  type: "button",
                  id: "ds-brand-top-bar__hamburger",
                  className: "cmp-button",
                  "aria-label": "Main Menu Navigation Dropdown"
                })
              }), jsx(Image, _extends({}, image)), jsx(Image, _extends({}, image2))]
            })
          }), jsx("div", {
            className: "container responsivegrid ds-brand-top-bar__right",
            children: jsx("div", {
              className: "cmp-container",
              children: jsx(Text, _extends({}, text))
            })
          })]
        })
      })
    })
  });
}

function LocalStyle() { return null; }

var _dekkerDom_styleInject = /*#__PURE__*/Object.freeze({
  __proto__: null,
  'default': LocalStyle
});

export { TopBar };
