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

const lazy = () => function LazyLocalStyles() { return null; };
var React = { lazy };

const _excluded$3 = ["id", "text", "buttonLink", "target", "className", "typeTransform", "type", "icon", "colorType", "disabled", "dataLayer", "AEMclassNameSlot1", "AEMclassNameSlot2", "AEMclassNameSlot3", "useRootClassName"];
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
    props = _objectWithoutPropertiesLoose(_ref, _excluded$3);
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

function Title$1({
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

function StyleWrapper(props) { return props.children; }

const _excluded$2 = ["useLocalStyles", "highlight", "className"];
const LocalStyles$2 = () => /*#__PURE__*/React.lazy(() => Promise.resolve().then(function () { return _dekkerDom_styleInject; }));
function Title(_ref) {
  let {
      useLocalStyles = true,
      highlight,
      className
    } = _ref,
    rest = _objectWithoutPropertiesLoose(_ref, _excluded$2);
  return jsx(StyleWrapper, {
    LocalStyles: LocalStyles$2,
    useLocalStyles: useLocalStyles,
    children: jsx(Title$1, _extends({}, rest, {
      className: cn(highlight && `title--${highlight}`, className)
    }))
  });
}

const _excluded$1 = ["useLocalStyles", "size", "fontWeight", "className"];
const LocalStyles$1 = () => /*#__PURE__*/React.lazy(() => Promise.resolve().then(function () { return _dekkerDom_styleInject; }));
function Button(_ref) {
  let {
      useLocalStyles = true,
      size,
      fontWeight,
      className
    } = _ref,
    rest = _objectWithoutPropertiesLoose(_ref, _excluded$1);
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
    LocalStyles: LocalStyles$1,
    useLocalStyles: useLocalStyles,
    children: jsx(Button$1, _extends({}, rest, {
      className: updateClassname
    }))
  });
}

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

function LocalStyle() { return null; }

var _dekkerDom_styleInject = /*#__PURE__*/Object.freeze({
  __proto__: null,
  'default': LocalStyle
});

export { BlockNews };
