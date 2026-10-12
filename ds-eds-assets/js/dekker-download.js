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

function Download$1({
  id,
  url,
  title,
  description,
  filename,
  size,
  format,
  actionText,
  image,
  className,
  layoutAlignContent
}) {
  // An image object without a usable src is no image. The EDS field reader
  // always builds `image = { src: undefined }` when nothing is authored (nested
  // `prop:image.src`), which is truthy; without this guard an unauthored block
  // would gain `download--with-image` and an empty <img>.
  const img = image != null && image.src ? image : undefined;
  const iconAligned = cn({
    'download--icon-left': layoutAlignContent === 'left',
    'download--icon-right': layoutAlignContent === 'right'
  });
  return jsx("div", {
    className: cn('download', {
      'download--with-image': img
    }, iconAligned, className),
    children: jsxs("div", {
      id: id,
      className: "cmp-download",
      children: [img && jsxs("div", {
        id: `image-${img.id}`,
        "data-asset-id": img.uuid,
        className: "cmp-image",
        children: [jsx("img", {
          loading: "lazy",
          className: "cmp-image__image",
          itemProp: "contentUrl",
          src: img.src,
          alt: img.alt,
          srcSet: img.srcset,
          title: title
        }), jsx("meta", {
          itemProp: "caption",
          content: img.alt
        })]
      }), jsx("h3", {
        className: "cmp-download__title",
        children: jsx("a", {
          className: "cmp-download__title-link",
          href: url,
          download: true,
          children: title
        })
      }), description && jsx("div", {
        className: "cmp-download__description",
        dangerouslySetInnerHTML: {
          __html: description
        }
      }), filename && size && format && jsxs("dl", {
        className: "cmp-download__properties",
        children: [jsxs("div", {
          className: "cmp-download__property cmp-download__property--filename",
          children: [jsx("dt", {
            className: "cmp-download__property-label",
            children: "Filename"
          }), jsx("dd", {
            className: "cmp-download__property-content",
            children: filename
          })]
        }), jsxs("div", {
          className: "cmp-download__property cmp-download__property--size",
          children: [jsx("dt", {
            className: "cmp-download__property-label",
            children: "Size"
          }), jsx("dd", {
            className: "cmp-download__property-content",
            children: size
          })]
        }), jsxs("div", {
          className: "cmp-download__property cmp-download__property--format",
          children: [jsx("dt", {
            className: "cmp-download__property-label",
            children: "Format"
          }), jsx("dd", {
            className: "cmp-download__property-content",
            children: format
          })]
        })]
      }), actionText && jsx("a", {
        className: "cmp-download__action",
        href: url,
        download: true,
        children: jsx("span", {
          className: "cmp-download__action-text",
          children: actionText
        })
      })]
    })
  });
}

function StyleWrapper(props) { return props.children; }

const _excluded = ["useLocalStyles", "className"];
const LocalStyles = () => /*#__PURE__*/React.lazy(() => Promise.resolve().then(function () { return _dekkerDom_styleInject; }));
function Download(_ref) {
  let {
      useLocalStyles = true,
      className
    } = _ref,
    rest = _objectWithoutPropertiesLoose(_ref, _excluded);
  return jsx(StyleWrapper, {
    LocalStyles: LocalStyles,
    useLocalStyles: useLocalStyles,
    children: jsx(Download$1, _extends({}, rest, {
      className: className
    }))
  });
}

function LocalStyle() { return null; }

var _dekkerDom_styleInject = /*#__PURE__*/Object.freeze({
  __proto__: null,
  'default': LocalStyle
});

export { Download };
