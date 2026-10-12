import { jsx, jsxs, Fragment } from './vendor/jsx-runtime.js';

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

function Teaser({
  id,
  title,
  titleTag = 'h2',
  alignContent,
  description,
  imagePath,
  pretitle,
  className,
  actions,
  link,
  styles,
  lineClamp,
  titleLinkHidden,
  actionsEnabled,
  date,
  video,
  lazyEnabled = true,
  imageFetchpriority = 'auto',
  imageSrcSet,
  imageDecoding = 'async',
  useJsModal = false
}) {
  const TitleTag = titleTag;
  const isLinked = titleLinkHidden === true && actionsEnabled === false && link && link.url;
  const teaserAlignedContent = cn({
    'content-center': alignContent === 'center',
    'content-right': alignContent === 'right'
  });
  const teaserLineClamp = cn({
    'teaser-line-clamp-1': lineClamp === '1',
    'teaser-line-clamp-2': lineClamp === '2',
    'teaser-line-clamp-3': lineClamp === '3',
    'teaser-line-clamp-4': lineClamp === '4',
    'teaser-line-clamp-5': lineClamp === '5'
  });
  const loading = lazyEnabled ? 'lazy' : undefined;
  const getTeaserBody = () => {
    return jsxs(Fragment, {
      children: [jsxs("div", {
        className: "cmp-teaser__content",
        children: [date && jsx("p", {
          className: "cmp-teaser__date",
          children: date
        }), pretitle && jsx("p", {
          className: "cmp-teaser__pretitle",
          children: pretitle
        }), title && jsx(TitleTag, {
          className: "cmp-teaser__title",
          children: !titleLinkHidden && link ? jsx("a", {
            href: "/",
            className: "cmp-teaser__title-link",
            children: title
          }) : title
        }), description && jsx("div", {
          className: "cmp-teaser__description",
          dangerouslySetInnerHTML: {
            __html: description
          }
        }), actionsEnabled && actions && actions.length ? jsx("div", {
          className: "cmp-teaser__action-container",
          children: actions.map(action => {
            var _action$link;
            return jsx("a", {
              className: cn({
                'js-modal': useJsModal
              }, 'cmp-teaser__action-link'),
              id: action.id,
              "data-cmp-data-layer": "",
              "data-cmp-clickable": "",
              href: (_action$link = action.link) == null ? void 0 : _action$link.url,
              target: action.target,
              children: action.title
            }, action.id);
          })
        }) : null]
      }), imagePath && jsx("div", {
        className: "cmp-teaser__image",
        children: jsxs("div", {
          id: id ? `${id}-image` : undefined,
          "data-cmp-data-layer": "",
          className: "cmp-image",
          children: [jsx("img", {
            src: imagePath,
            srcSet: imageSrcSet,
            loading: loading,
            fetchpriority: imageFetchpriority,
            decoding: imageDecoding,
            className: "cmp-image__image",
            itemProp: "contentUrl",
            alt: title,
            title: title
          }), jsx("meta", {
            itemProp: "caption",
            content: title
          })]
        })
      }), video && jsx("div", {
        className: "cmp-teaser__video",
        children: jsx("div", {
          id: id ? `${id}-video` : undefined,
          className: "cmp-video",
          children: jsx("video", _extends({}, video.autoPlay && {
            autoPlay: true
          }, video.controls && {
            controls: true
          }, video.loop && {
            loop: true
          }, video.muted && {
            muted: true
          }, video.playsInline && {
            playsInline: true
          }, {
            width: video.width,
            height: video.height,
            poster: video.poster,
            className: "cmp-video__video",
            children: video.source ? video.source.map(item => jsx("source", {
              src: item.url,
              type: item.type
            }, item.id)) : null
          }))
        })
      })]
    });
  };
  return jsx("div", {
    className: cn('teaser', [teaserAlignedContent, teaserLineClamp], className),
    style: styles,
    children: jsx("div", {
      id: id,
      className: "cmp-teaser",
      "data-cmp-data-layer": "",
      children: !!isLinked ? jsx("a", {
        className: cn({
          'cmp-teaser__link': !useJsModal,
          'js-modal cmp-teaser': useJsModal
        }),
        "data-cmp-clickable": "",
        href: link.url,
        children: getTeaserBody()
      }) : getTeaserBody()
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

const _excluded$1 = ["useLocalStyles", "variant", "className"];
const LocalStyles$1 = () => /*#__PURE__*/React.lazy(() => Promise.resolve().then(function () { return _dekkerDom_styleInject; }));
function Text(_ref) {
  let {
      useLocalStyles = true,
      variant,
      className
    } = _ref,
    rest = _objectWithoutPropertiesLoose(_ref, _excluded$1);
  return jsx(StyleWrapper, {
    LocalStyles: LocalStyles$1,
    useLocalStyles: useLocalStyles,
    children: jsx(Text$1, _extends({}, rest, {
      className: cn(variant && `ds-brand-${variant}`, className)
    }))
  });
}

const _excluded = ["useLocalStyles", "className", "typeCard", "modifierShadow"];
const LocalStyles = () => /*#__PURE__*/React.lazy(() => Promise.resolve().then(function () { return _dekkerDom_styleInject; }));
function ProductCard(_ref) {
  let {
      useLocalStyles = true,
      className,
      typeCard,
      modifierShadow
    } = _ref,
    rest = _objectWithoutPropertiesLoose(_ref, _excluded);
  const typeCardClass = cn({
    'ds-brand-product-card--extended': typeCard === 'extended',
    'ds-brand-product-card--shadow': modifierShadow
  });
  return jsx(StyleWrapper, {
    LocalStyles: LocalStyles,
    useLocalStyles: useLocalStyles,
    children: jsx(Teaser, _extends({}, rest, {
      className: cn('ds-brand-product-card', typeCardClass, className)
    }))
  });
}

function BlockProducts({
  className,
  heading,
  text,
  items,
  background
}) {
  return jsx("div", {
    className: cn('ds-block-products container responsivegrid aem-GridColumn aem-GridColumn--default--12', background && `ds-block-products--${background}`, className),
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
                className: "aem-Grid aem-Grid--12 aem-Grid--default--12",
                children: jsx(Title, {
                  id: "title-1'",
                  type: "h2",
                  text: heading
                })
              }) : null, text ? jsx("div", {
                className: "aem-Grid aem-Grid--12 aem-Grid--default--12",
                children: jsx(Text, {
                  id: "text-1",
                  text: text
                })
              }) : null]
            })
          })
        }), items.length ? jsx("div", {
          className: "ds-splide-carousel ds-splide-carousel-products ds-brand-splide-carousel container responsivegrid aem-GridColumn aem-GridColumn--default--12",
          children: jsx("div", {
            className: "cmp-container",
            children: jsx("div", {
              className: "aem-Grid aem-Grid--12 aem-Grid--default--12",
              children: items.map(item => jsx("div", {
                className: "aem-GridColumn--small-screen--12 aem-GridColumn--extra-small-screen--none aem-GridColumn--default--none aem-GridColumn--medium-screens--12 aem-GridColumn--small-screen--none aem-GridColumn--offset--small-screen--0 aem-GridColumn--offset--default--0 aem-GridColumn--extra-small-screen--12 aem-GridColumn aem-GridColumn--offset--medium-screens--0 aem-GridColumn--medium-screens--none aem-GridColumn--default--4 aem-GridColumn--offset--extra-small-screen--0 splide__slide",
                children: jsx(ProductCard, _extends({}, item, {
                  typeCard: "extended",
                  className: "ds-brand-product-card--shadow"
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

export { BlockProducts };
