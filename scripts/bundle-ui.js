/**
 * Script that bundles `scripts/ui-entry.js` into `template/js/asyncapi-ui.min.js`.
 * It is run every time the package is published.
 * The bundle sets the global `AsyncApiStandalone`.
 */

const path = require('path');
const esbuild = require('esbuild');
const { polyfillNode } = require('esbuild-plugin-polyfill-node');

// The plugins import `PluginSlot` from the package root, which also loads the parser.
// The page gets a parsed document, so resolve the root to the types module only.
const reactComponentRoot = {
  name: 'react-component-root',
  setup(build) {
    build.onResolve({ filter: /^@asyncapi\/react-component$/ }, () => ({
      path: require.resolve('@asyncapi/react-component/lib/esm/types.js'),
    }));
  },
};

// `@stoplight/json` loads `jsonc-parser` with `require`, so esbuild selects its UMD build.
// The UMD build loads its modules with a dynamic `require`, which fails in the browser.
// So resolve it to the ES module build.
const jsoncParserEsm = {
  name: 'jsonc-parser-esm',
  setup(build) {
    build.onResolve({ filter: /^jsonc-parser$/ }, args => build.resolve('jsonc-parser/lib/esm/main.js', {
      kind: 'import-statement',
      resolveDir: args.resolveDir,
    }));
  },
};

esbuild.build({
  entryPoints: [path.join(__dirname, 'ui-entry.js')],
  outfile: path.join(__dirname, '../template/js/asyncapi-ui.min.js'),
  bundle: true,
  minify: true,
  format: 'iife',
  globalName: 'AsyncApiStandalone',
  platform: 'browser',
  target: 'es2018',
  legalComments: 'none',
  define: { 'process.env.NODE_ENV': '"production"' },
  // The parser uses Node.js modules, as in the standalone bundle of the component.
  plugins: [reactComponentRoot, jsoncParserEsm, polyfillNode({ polyfills: { fs: true } })],
}).then(() => {
  console.log('UI bundle built!');
}).catch(err => {
  console.log(err);
  process.exitCode = 1;
});
