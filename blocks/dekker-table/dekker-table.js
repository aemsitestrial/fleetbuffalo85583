import { Table } from '../../ds-eds-assets/js/dekker-table.js';
import {
  blockRows, readBlockFields, instrument, loadDekkerCss, render, replaceContent, uniqueId,
} from '../../ds-eds-tools/dekker-block.js';

/**
 * dekker-table -- renders dekker-lib's Table from the design system's compiled DOM build
 * (ds-eds-assets/js/dekker-table.js, package @ac-brandsframework/eds-assets-dekker) with its CSS
 * (ds-eds-assets/css/bundles/dekker-table.css). Markup and look are the design system's; this file
 * only
 * reads the authored fields (_dekker-table.json) and maps them onto the component's props.
 * The table is authored as a rich text table; its first row is the header row.
 */

function tableProps(cell) {
  const rows = [...(cell?.querySelector('table')?.rows || [])];
  const [head, ...body] = rows;
  const columns = [...(head?.cells || [])].map((c, index) => ({ key: `col${index}`, title: c.textContent.trim() }));
  return {
    ':orderCol': columns.map((c) => c.key),
    ':itemsCol': Object.fromEntries(columns.map((c) => [c.key, {
      id: uniqueId('dekker-table-col'), title: c.title, ':type': 'column', dataLayer: {},
    }])),
    ':itemsRow': body.map((row) => Object.fromEntries(columns.map((c, index) => [
      c.key, row.cells[index]?.textContent.trim() || '',
    ]))),
  };
}

export default function decorate(block) {
  loadDekkerCss('dekker-table');
  const { cells } = readBlockFields(blockRows(block), ['table']);
  const { node, root } = render(Table, {
    id: uniqueId('dekker-table'),
    ...tableProps(cells.table),
    ':type': 'table',
    dataLayer: {},
  });
  instrument(cells.table, root);
  replaceContent(block, node);
}
