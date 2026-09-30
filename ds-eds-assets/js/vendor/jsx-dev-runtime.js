import { jsx, jsxs, Fragment } from './dom-runtime.js';

// Babel's automatic runtime calls jsxDEV in development mode with extra
// debug args (source, self) that the hand-written build() doesn't need —
// forward straight to jsx since dom-runtime has no dev-only behaviour.
export { jsx, jsxs, Fragment };
export { createElement } from './dom-runtime.js';
export const jsxDEV = (type, props) => jsx(type, props);
