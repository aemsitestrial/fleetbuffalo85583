import { jsx, jsxs } from './vendor/jsx-runtime.js';

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

function _extends() {
  return _extends = Object.assign ? Object.assign.bind() : function (n) {
    for (var e = 1; e < arguments.length; e++) {
      var t = arguments[e];
      for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
    }
    return n;
  }, _extends.apply(null, arguments);
}

function Text({
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

function Title({
  id,
  className,
  link,
  text,
  type
}) {
  const Component = type;
  return jsx("div", {
    className: cn('title', className),
    children: jsx("div", {
      "data-cmp-data-layer": "",
      id: id,
      className: "cmp-title",
      children: jsx(Component, {
        className: "cmp-title__text",
        children: link && link != null && link.valid ? jsx("a", _extends({
          className: "cmp-title__link",
          "data-cmp-clickable": "",
          href: link.url
        }, link.attributes, {
          children: text
        })) : text
      })
    })
  });
}

function KeySpecs({
  id,
  text,
  title,
  className
}) {
  return jsxs("div", {
    className: cn('ds-brand-key-specs', className),
    children: [jsx(Title, {
      id: id,
      type: "h3",
      text: title
    }), jsx(Text, {
      id: id,
      text: text
    })]
  });
}

export { KeySpecs };
