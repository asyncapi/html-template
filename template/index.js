import ReactDOMServer from "react-dom/server";
import AsyncAPIComponent from "@asyncapi/react-component";
import { File } from "@asyncapi/generator-react-sdk";
import yaml from 'js-yaml';

export default async function({ asyncapi, originalAsyncAPI }) {
  return (
    <File name="asyncapi.html">
      {/* <WebComponent originalAsyncAPI={originalAsyncAPI} /> */}
      <Hydration asyncapi={asyncapi} />
    </File>
  );
}

function WebComponent({ originalAsyncAPI }) {
  const json = parseOriginalSpec(originalAsyncAPI)
  // double JSON.stringify - trick for escaping \"
  const stringified = JSON.stringify(JSON.stringify(json));
  
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="js/web-component-polyfill.js"></script>
    <script src="js/web-component.js"></script>
    <script>
      var schema = ${stringified}
      window.onload = function() {
        document.getElementById("asyncapi").schema=schema;
      };
    </script>
  </head>
  <body>
    <asyncapi-component
      id="asyncapi"
      cssImportPath="css/fiori.css">
    </asyncapi-component>
  </body>
</html>`;
}

function parseOriginalSpec(originalAsyncAPI) {
  try {
    return JSON.parse(originalAsyncAPI);
  } catch (e) {
    return yaml.load(originalAsyncAPI);
  }
}

function Hydration({ asyncapi }) {
  const component = (
    <AsyncAPIComponent 
      parsedSchema={asyncapi}
    />
  );
  const content = ReactDOMServer.renderToString(component);

  const originalAsyncAPI = asyncapi.json();
  // double JSON.stringify - trick for escaping \"
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
  </script>
</html>`;
}

{/* <script src="https://unpkg.com/react@17/umd/react.development.js" crossorigin></script>
<script src="https://unpkg.com/react-dom@17/umd/react-dom.development.js" crossorigin></script>
<script type="module" src="https://unpkg.com/@asyncapi/react-component@0.20.1/lib/index.js"></script> */}
