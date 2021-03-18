'use strict';

var jsxRuntime = require('react/jsx-runtime');
require('source-map-support/register');
var ReactDOMServer = require('react-dom/server');
var AsyncAPIComponent = require('@asyncapi/react-component');
var generatorReactSdk = require('@asyncapi/generator-react-sdk');
require('js-yaml');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var ReactDOMServer__default = /*#__PURE__*/_interopDefaultLegacy(ReactDOMServer);
var AsyncAPIComponent__default = /*#__PURE__*/_interopDefaultLegacy(AsyncAPIComponent);

async function index ({
  asyncapi,
  originalAsyncAPI
}) {
  return /*#__PURE__*/jsxRuntime.jsx(generatorReactSdk.File, {
    name: "asyncapi.html",
    children: /*#__PURE__*/jsxRuntime.jsx(Hydration, {
      asyncapi: asyncapi
    })
  });
}

function Hydration({
  asyncapi
}) {
  const component = /*#__PURE__*/jsxRuntime.jsx(AsyncAPIComponent__default['default'], {
    parsedSchema: asyncapi
  });

  const content = ReactDOMServer__default['default'].renderToString(component);
  const originalAsyncAPI = asyncapi.json(); // double JSON.stringify - trick for escaping \"

  const stringified = JSON.stringify(JSON.stringify(originalAsyncAPI));
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://unpkg.com/@asyncapi/react-component@0.20.1/lib/styles/fiori.css" rel="stylesheet">
  </head>
  <body>
    <div id="root">${content}</div>
  </body>
  <script src="https://unpkg.com/@asyncapi/parser@1.4.0/dist/bundle.js" crossorigin></script>
  <script src="https://unpkg.com/react@17.0.1/umd/react.development.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@17/umd/react-dom.development.js" crossorigin></script>
  <script src="js/component.min.js"></script>
  <script>
    AsyncAPIParser.parse(${stringified}).then(schema => {
      ReactDOM.hydrate(
        React.createElement(AsyncApiComponent, { schema }),
        document.getElementById("root")
      );
    });
    // ReactDOM.hydrate(
    //   React.createElement(AsyncApiComponent, { schema }),
    //   document.getElementById("root")
    // );
  </script>
</html>`;
}

module.exports = index;
//# sourceMappingURL=index.js.map
