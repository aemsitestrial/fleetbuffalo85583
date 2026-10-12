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

function StyleWrapper(props) { return props.children; }

const _excluded = ["useLocalStyles", "highlight", "layout", "modifierShadow"];
const LocalStyles = () => /*#__PURE__*/React.lazy(() => Promise.resolve().then(function () { return _dekkerDom_styleInject; }));
function TeaserCard(_ref) {
  let {
      useLocalStyles = true,
      highlight,
      layout,
      modifierShadow
    } = _ref,
    rest = _objectWithoutPropertiesLoose(_ref, _excluded);
  const modifiers = cn({
    [`ds-brand-teaser-card--highlight-${highlight}`]: !!highlight,
    [`ds-brand-teaser-card--${layout}`]: !!layout,
    'ds-brand-teaser-card--shadow': modifierShadow
  });
  return jsx(StyleWrapper, {
    LocalStyles: LocalStyles,
    useLocalStyles: useLocalStyles,
    children: jsx(Teaser, _extends({}, rest, {
      className: cn('ds-brand-teaser-card', modifiers, rest.className)
    }))
  });
}

function LocalStyle() { return null; }

var _dekkerDom_styleInject = /*#__PURE__*/Object.freeze({
  __proto__: null,
  'default': LocalStyle
});

export { TeaserCard };
