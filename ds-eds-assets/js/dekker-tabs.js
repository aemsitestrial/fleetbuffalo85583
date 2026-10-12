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

function EmbedVideo({
  id,
  className,
  videoImageFallback,
  source,
  playsInline = true,
  loop = true,
  muted = true,
  autoPlay = true,
  height,
  width,
  poster,
  controls = true
}) {
  return jsx("div", {
    className: cn('embed', className),
    children: jsx("div", {
      id: id,
      className: "cmp-embed",
      children: jsx("div", {
        children: jsx("video", _extends({}, autoPlay && {
          autoPlay: true
        }, controls && {
          controls: true
        }, loop && {
          loop: true
        }, muted && {
          muted: true
        }, playsInline && {
          playsInline: true
        }, {
          width: width,
          height: height,
          poster: poster,
          children: source && source.length ? jsx(Fragment, {
            children: source.map(item => jsx("source", {
              src: item.url,
              type: item.type
            }, item.id))
          }) : jsx("picture", {
            children: jsx("img", {
              id: id,
              src: videoImageFallback,
              className: "lazyload cq-dd-videoThumbnail",
              "data-sizes": "auto",
              "data-height": "auto"
            })
          })
        }))
      })
    })
  });
}

function Table({
  id,
  ':orderCol': orderCol,
  ':itemsRow': itemsRow,
  ':itemsCol': itemsCol,
  className,
  useRootClassName = true
}) {
  return jsx("div", {
    id: id,
    className: cn(useRootClassName ? 'text' : '', className),
    children: jsx("div", {
      className: "cmp-text",
      children: jsx("table", {
        children: jsxs("tbody", {
          children: [itemsCol && jsx("tr", {
            children: orderCol.map(col => jsx("th", {
              children: itemsCol[col].title
            }, itemsCol[col].id))
          }), itemsRow.map((row, rowIndex) => jsx("tr", {
            children: orderCol.map((col, colIndex) => jsx("td", {
              dangerouslySetInnerHTML: {
                __html: row[col]
              }
            }, `${col}-${colIndex}`))
          }, rowIndex))]
        })
      })
    })
  });
}

function TabToggler({
  id,
  isActive,
  ariaControl,
  text
}) {
  return jsx("li", {
    role: "tab",
    id: id,
    className: cn('cmp-tabs__tab', {
      'cmp-tabs__tab--active': isActive
    }),
    "aria-controls": ariaControl,
    tabIndex: isActive ? 0 : -1,
    "data-cmp-hook-tabs": "tab",
    "aria-selected": isActive,
    children: text
  });
}

function TabItem({
  id,
  ariaLabelledBy,
  tabIndex,
  isActive,
  children
}) {
  return jsx("div", {
    id: id,
    role: "tabpanel",
    "aria-labelledby": ariaLabelledBy,
    tabIndex: tabIndex,
    className: cn('cmp-tabs__tabpanel', {
      'cmp-tabs__tabpanel--active': isActive
    }),
    "data-cmp-hook-tabs": "tabpanel",
    "data-cmp-data-layer": "",
    "aria-hidden": isActive ? 'false' : 'true',
    children: jsx("div", {
      className: "responsivegrid",
      children: jsx("div", {
        className: "aem-Grid aem-Grid--12 aem-Grid--default--12",
        children: children
      })
    })
  });
}

function Tabs$1({
  id,
  className,
  ':itemsOrder': itemsOrder,
  ':items': items,
  activeItem,
  useResponsiveSelect,
  useWindowResizeType = true,
  useResponsiveType = 'window',
  children
}) {
  return jsx("div", {
    className: cn('tabs panelcontainer', className, {
      'ds-brand-responsive-select-run-js': useResponsiveSelect,
      'ds-window-resize-type': useWindowResizeType && useResponsiveSelect,
      'ds-container-query': useResponsiveType === 'container'
    }),
    children: jsxs("div", {
      id: id,
      className: "cmp-tabs",
      "data-cmp-data-layer": "",
      "data-placeholder-text": "false",
      children: [jsx("ol", {
        role: "tablist",
        className: "cmp-tabs__tablist",
        "aria-multiselectable": "false",
        children: itemsOrder.map((itemOrder, index) => jsx(TabToggler, {
          id: `${id}-item-${index}-tab`,
          isActive: activeItem === itemOrder,
          text: items[itemOrder]['cq:panelTitle'],
          ariaControl: `${id}-item-${index}-tabpanel`
        }, `${id}-item-${index}-tab`))
      }), itemsOrder.map((itemOrder, index) => jsx(TabItem, {
        id: `${id}-item-${index}-tabpanel`,
        ariaLabelledBy: `${id}-item-${index}-tab`,
        tabIndex: activeItem === itemOrder ? 1 : 0,
        isActive: activeItem === itemOrder,
        children: children ? children : jsx(Fragment, {
          children: items[itemOrder][':itemsOrder'].map((componentName, index) => {
            const props = items[itemOrder][':items'][componentName];
            const componentClassName = items[itemOrder].columnClassNames[componentName];
            if (componentName === 'image') {
              const componentProps = props;
              return jsx("div", {
                className: cn('image', componentClassName),
                children: jsxs("div", {
                  "data-asset-id": componentProps == null ? void 0 : componentProps.uuid,
                  id: componentProps == null ? void 0 : componentProps.id,
                  "data-cmp-data-layer": "",
                  className: "cmp-image",
                  itemScope: true,
                  itemType: "http://schema.org/ImageObject",
                  children: [jsx("img", {
                    srcSet: componentProps == null ? void 0 : componentProps.srcset,
                    loading: "lazy",
                    className: "cmp-image__image",
                    itemProp: "contentUrl",
                    width: "850",
                    height: "509",
                    alt: componentProps == null ? void 0 : componentProps.title,
                    title: componentProps == null ? void 0 : componentProps.title
                  }), jsx("meta", {
                    itemProp: "caption",
                    content: componentProps == null ? void 0 : componentProps.title
                  })]
                })
              }, index);
            }
            if (componentName === 'text') {
              const componentProps = props;
              return jsx("div", {
                className: cn('text', componentClassName),
                children: componentProps != null && componentProps.richText ? jsx("div", {
                  "data-cmp-data-layer": "",
                  id: componentProps == null ? void 0 : componentProps.id,
                  className: "cmp-text",
                  dangerouslySetInnerHTML: {
                    __html: (componentProps == null ? void 0 : componentProps.text) || ''
                  }
                }) : jsx("div", {
                  "data-cmp-data-layer": "",
                  id: componentProps == null ? void 0 : componentProps.id,
                  className: "cmp-text",
                  children: jsx("p", {
                    children: componentProps == null ? void 0 : componentProps.text
                  })
                })
              }, index);
            }
            if (componentName === 'teaser') {
              const componentProps = props;
              return jsx(Teaser, _extends({}, componentProps, {
                className: cn(componentProps.className, componentClassName)
              }), index);
            }
            if (componentName === 'table') {
              const componentProps = props;
              return jsx(Table, _extends({}, componentProps, {
                className: cn(componentProps.className, componentClassName)
              }), index);
            }
            if (componentName === 'embed-video') {
              const componentProps = props;
              return jsx(EmbedVideo, _extends({}, componentProps, {
                className: cn(componentProps.className, componentClassName)
              }), index);
            }
            if (componentName === 'custom-component') {
              return jsx(Fragment, {
                children: props
              });
            }
          })
        })
      }, index))]
    })
  });
}

function StyleWrapper(props) { return props.children; }

const _excluded = ["useLocalStyles"];
const LocalStyles = () => /*#__PURE__*/React.lazy(() => Promise.resolve().then(function () { return _dekkerDom_styleInject; }));
function Tabs(_ref) {
  let {
      useLocalStyles = true
    } = _ref,
    rest = _objectWithoutPropertiesLoose(_ref, _excluded);
  return jsx("div", {
    children: jsx(StyleWrapper, {
      LocalStyles: LocalStyles,
      useLocalStyles: useLocalStyles,
      children: jsx(Tabs$1, _extends({}, rest))
    })
  });
}

function LocalStyle() { return null; }

var _dekkerDom_styleInject = /*#__PURE__*/Object.freeze({
  __proto__: null,
  'default': LocalStyle
});

export { Tabs };
