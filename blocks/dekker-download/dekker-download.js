import { Download } from '../../ds-eds-assets/js/dekker-download.js';
import {
  blockRows, readBlockFields, text, html, href, imageSrc, imageProps, instrument, patchPicture,
  loadDekkerCss, render, replaceContent, uniqueId,
} from '../../ds-eds-tools/dekker-block.js';

/**
 * dekker-download -- renders dekker-lib's Download from the design system's compiled DOM build
 * (ds-eds-assets/js/dekker-download.js, package @ac-brandsframework/eds-assets-dekker) with its CSS
 * (ds-eds-assets/css/bundles/dekker-download.css). Markup and look are the design system's; this
 * file only
 * reads the authored fields (_dekker-download.json) and maps them onto the component's props.
 */

const FIELDS = ['title', 'description', 'actionText', 'file', 'filename', 'format', 'size', 'image', 'imageAlt'];

export default function decorate(block) {
  loadDekkerCss('dekker-download');
  const { cells } = readBlockFields(blockRows(block), FIELDS);
  const url = href(cells.file) || '';
  const format = text(cells.format) || '';
  const { node, root } = render(Download, {
    id: uniqueId('dekker-download'),
    url,
    title: text(cells.title),
    description: html(cells.description),
    actionText: text(cells.actionText) || '',
    filename: text(cells.filename) || url.split('/').pop() || '',
    format,
    size: text(cells.size) || '',
    extension: format.toLowerCase(),
    image: imageSrc(cells.image) ? imageProps(cells.image, cells.imageAlt, 'dekker-download-image') : undefined,
    dataLayer: {},
  });
  patchPicture(cells.image, root);
  instrument(cells.title, root.querySelector('.cmp-download__title'));
  instrument(cells.description, root.querySelector('.cmp-download__description'));
  replaceContent(block, node);
}
