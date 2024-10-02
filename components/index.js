// eslint-disable-next-line no-unused-vars
import { AsyncAPIDocumentInterface } from '@asyncapi/parser';
import { includeFile, generateBase64Favicon, renderSpec, stringifySpec, stringifyConfiguration } from '../helpers/all';

/**
 * @param {{asyncapi: AsyncAPIDocumentInterface, params: any}} param0 
 */
export function Index({ asyncapi, params = {} }) {
  const favicon = generateBase64Favicon(params);
  const renderedSpec = renderSpec(asyncapi, params);
  let asyncapiScript = `<script src="js/asyncapi-ui.min.js" type="application/javascript"></script>`;
  if(params?.singleFile) {
    asyncapiScript = `<script type="text/javascript">
    ${includeFile('template/js/asyncapi-ui.min.js')}
    </script>`;
  }
  let styling = `<link href="css/global.min.css" rel="stylesheet">
      <link href="css/asyncapi.min.css" rel="stylesheet">`;
  if(params?.singleFile) {
    styling = `<style type="text/css">
      ${includeFile("template/css/global.min.css")}
      ${includeFile("template/css/asyncapi.min.css")}
    </style>`;
  }
  let basehref = '';
  if(params.baseHref) {
    basehref = `<base href="${params.baseHref}">`;
  }
  return (`<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8">
      ${basehref}
      <title>${asyncapi.info().title()} ${asyncapi.info().version()} documentation</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="icon" type="image/x-icon" href="${favicon}" />
      ${styling}
    </head>
  
    <body>
      <div id="root">${renderedSpec}</div>
  
      ${asyncapiScript}
  
      <script type="application/javascript" src="js/app.js"></script>
    </body>
  </html>`
  );
}

export function App({ asyncapi, params = {} }) {
  return (`
    const schema = ${stringifySpec(asyncapi)};
    const config = ${stringifyConfiguration(params)};
    const appRoot = document.getElementById('root');
    AsyncApiStandalone.render(
        { schema, config, }, appRoot
    );
  `
  );
}
