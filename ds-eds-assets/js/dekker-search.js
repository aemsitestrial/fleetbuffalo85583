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

function Search({
  id,
  action,
  placeholder = 'Search',
  className
}) {
  return jsx("div", {
    className: cn('searchbar', className),
    children: jsx("div", {
      className: "searchBar__root",
      id: id,
      role: "search",
      children: jsx("div", {
        className: "searchBar__searchInner",
        children: jsxs("form", {
          className: "searchBar__form",
          autoComplete: "off",
          action: action,
          children: [jsxs("span", {
            className: "fieldIcons__root",
            children: [jsx("span", {
              className: "fieldIcons__input",
              children: jsx("input", {
                className: "textInput__input field__input",
                name: "search_query",
                role: "searchbox",
                placeholder: placeholder
              })
            }), jsx("span", {
              className: "fieldIcons__before",
              children: jsx("span", {
                className: "icon__root",
                children: jsxs("svg", {
                  xmlns: "http://www.w3.org/2000/svg",
                  width: "18",
                  height: "18",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: "2",
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  children: [jsx("circle", {
                    cx: "11",
                    cy: "11",
                    r: "8"
                  }), jsx("line", {
                    x1: "21",
                    y1: "21",
                    x2: "16.65",
                    y2: "16.65"
                  })]
                })
              })
            }), jsx("span", {
              className: "fieldIcons__after"
            })]
          }), jsx("p", {
            className: "message__root"
          }), jsx("div", {
            className: "searchBar__SearchAutocompleteWrapper"
          })]
        })
      })
    })
  });
}

export { Search };
