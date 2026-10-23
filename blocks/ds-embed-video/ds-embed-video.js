import renderEmbedVideo from '../../ds-eds-assets-ac/js/vendor/render-embed-video.js';
import { loadBundle, readFields, replaceContent } from '../../scripts/ds-blocks.js';

/** @param {HTMLElement} block */
export default function decorate(block) {
  loadBundle('ac-embed-video');
  const f = readFields(block);
  const { url } = f.link('video');
  const element = renderEmbedVideo({
    content: {
      source: url ? [{ url, type: f.text('videoType') || 'video/mp4' }] : [],
      poster: f.image('poster').src,
      autoPlay: f.bool('autoPlay'),
      loop: f.bool('loop'),
      muted: f.bool('muted'),
      controls: f.bool('controls'),
    },
    options: f.options(['spacingMy', 'spacingMb']),
    loadBundle,
  });
  replaceContent(block, f.wrapper, element);
}
