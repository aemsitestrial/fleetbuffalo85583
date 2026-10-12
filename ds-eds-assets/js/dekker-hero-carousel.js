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

function Carousel$1({
  id,
  className,
  classNameSlide,
  ':itemsOrder': itemsOrder,
  ':items': items,
  typeCarousel,
  autopauseDisabled = false,
  autoplay = false,
  controlsPrepended,
  delay = 5000,
  useExpand = false
}) {
  const cnModifications = cn({
    'ds-brand-expand': useExpand
  });
  const typeClassCarousel = cn({
    'carousel--hero': typeCarousel === 'hero',
    'carousel--hero-teaser': typeCarousel === 'hero-teaser'
  });
  return jsx("div", {
    className: cn('carousel panelcontainer', typeClassCarousel, cnModifications, className),
    children: jsx("div", _extends({
      id: id,
      className: "cmp-carousel",
      role: "group",
      "aria-live": "polite",
      "aria-roledescription": "carousel",
      "data-cmp-delay": delay,
      "data-cmp-data-layer": ""
    }, autoplay && {
      'data-cmp-autoplay': ''
    }, {
      "data-placeholder-text": "false",
      children: jsxs("div", {
        className: "cmp-carousel__content",
        "aria-atomic": "false",
        "aria-live": "polite",
        children: [itemsOrder.length && itemsOrder.map((itemOrder, index) => {
          var _items$itemOrder$id, _items$itemOrder$id2;
          return jsxs("div", _extends({
            id: `${id}-item-${(_items$itemOrder$id = items[itemOrder].id) == null ? void 0 : _items$itemOrder$id.split('-')[1]}-tabpanel`,
            className: cn('cmp-carousel__item', {
              'cmp-carousel__item--active': index === 0
            }),
            role: "tabpanel",
            "aria-labelledby": `${id}-item-${(_items$itemOrder$id2 = items[itemOrder].id) == null ? void 0 : _items$itemOrder$id2.split('-')[1]}-tab`,
            "aria-roledescription": "slide",
            "aria-label": `Slide ${index + 1} of ${itemsOrder.length}`,
            "data-cmp-data-layer": "",
            "data-cmp-hook-carousel": "item"
          }, index !== 0 && {
            'aria-hidden': 'true'
          }, {
            children: [typeCarousel === 'image' || typeCarousel === 'hero' ? jsx(Image, _extends({}, items[itemOrder]), index) : null, typeCarousel === 'teaser' || typeCarousel === 'hero-teaser' ? jsx(Teaser, _extends({}, items[itemOrder], {
              className: cn(items[itemOrder].className, classNameSlide)
            }), index) : null]
          }), items[itemOrder].id);
        }), controlsPrepended ? jsxs("div", {
          className: "cmp-carousel__actions",
          children: [jsxs("button", {
            className: "cmp-carousel__action cmp-carousel__action--previous",
            type: "button",
            "aria-label": "Previous",
            "data-cmp-hook-carousel": "previous",
            children: [jsx("span", {
              className: "cmp-carousel__action-icon"
            }), jsx("span", {
              className: "cmp-carousel__action-text",
              children: "Previous"
            })]
          }), jsxs("button", {
            className: "cmp-carousel__action cmp-carousel__action--next",
            type: "button",
            "aria-label": "Next",
            "data-cmp-hook-carousel": "next",
            children: [jsx("span", {
              className: "cmp-carousel__action-icon"
            }), jsx("span", {
              className: "cmp-carousel__action-text",
              children: "Next"
            })]
          }), jsxs("button", _extends({
            className: cn('cmp-carousel__action cmp-carousel__action--pause', {
              'cmp-carousel__action--disabled': !autopauseDisabled
            }),
            type: "button",
            "aria-label": "Pause",
            "data-cmp-hook-carousel": "pause"
          }, !autopauseDisabled && {
            disabled: true
          }, {
            children: [jsx("span", {
              className: "cmp-carousel__action-icon"
            }), jsx("span", {
              className: "cmp-carousel__action-text",
              children: "Pause"
            })]
          })), jsxs("button", _extends({
            className: cn('cmp-carousel__action cmp-carousel__action--play', {
              'cmp-carousel__action--disabled': autopauseDisabled
            }),
            type: "button",
            "aria-label": "Play",
            "data-cmp-hook-carousel": "play"
          }, autopauseDisabled && {
            disabled: true
          }, {
            children: [jsx("span", {
              className: "cmp-carousel__action-icon"
            }), jsx("span", {
              className: "cmp-carousel__action-text",
              children: "Play"
            })]
          }))]
        }) : null, jsx("ol", {
          className: "cmp-carousel__indicators",
          role: "tablist",
          "aria-label": "Choose a slide to display",
          "data-cmp-hook-carousel": "indicators",
          children: itemsOrder.length && itemsOrder.map((itemOrder, index) => {
            var _items$itemOrder$id3;
            const itemId = (_items$itemOrder$id3 = items[itemOrder].id) == null ? void 0 : _items$itemOrder$id3.split('-')[1];
            const title = items[itemOrder].title;
            return jsx("li", {
              id: `${id}-item-${itemId}-tab`,
              className: cn('cmp-carousel__indicator', {
                'cmp-carousel__indicator--active': index === 0
              }),
              role: "tab",
              "aria-controls": `${id}-item-${itemId}-tabpanel`,
              "aria-label": "Slide 1",
              "data-cmp-hook-carousel": "indicator",
              "aria-selected": "true",
              tabIndex: index === 0 ? 0 : -1,
              children: title
            }, index);
          })
        })]
      })
    }))
  });
}

function StyleWrapper(props) { return props.children; }

const _excluded = ["useLocalStyles"];
const LocalStyles = () => /*#__PURE__*/React.lazy(() => Promise.resolve().then(function () { return _dekkerDom_styleInject; }));
function Carousel(_ref) {
  let {
      useLocalStyles = true
    } = _ref,
    rest = _objectWithoutPropertiesLoose(_ref, _excluded);
  return jsx(StyleWrapper, {
    LocalStyles: LocalStyles,
    useLocalStyles: useLocalStyles,
    children: jsx(Carousel$1, _extends({}, rest))
  });
}

function LocalStyle() { return null; }

var _dekkerDom_styleInject = /*#__PURE__*/Object.freeze({
  __proto__: null,
  'default': LocalStyle
});

export { Carousel };
