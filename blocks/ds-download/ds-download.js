import renderDownload from '../../ds-eds-assets-ac/js/vendor/render-download.js';
import { loadBundle, readFields, replaceContent } from '../../scripts/ds-blocks.js';

/** @param {HTMLElement} block */
export default function decorate(block) {
  loadBundle('ac-download');
  const f = readFields(block);
  const { url } = f.link('file');
  // File name and format default to the ones in the file's address.
  const fileName = url ? decodeURIComponent(url.split(/[?#]/)[0].split('/').pop() || '') : '';
  const extension = fileName.includes('.') ? fileName.split('.').pop().toUpperCase() : undefined;
  const element = renderDownload({
    content: {
      url,
      title: f.text('title'),
      description: f.text('description'),
      filename: f.text('filename') || fileName || undefined,
      format: f.text('format') || extension,
      size: f.text('size'),
      actionText: f.text('actionText'),
      image: { src: f.image('image').src },
    },
    options: f.options(['themeType', 'downloadDensity', 'spacingMy', 'spacingMb']),
    editable: {
      title: f.attrs('title'),
      description: f.attrs('description'),
      actionText: f.attrs('actionText'),
      'image.src': f.attrs('image'),
    },
    loadBundle,
  });
  replaceContent(block, f.wrapper, element);
}
