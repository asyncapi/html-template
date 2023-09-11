// eslint-disable-next-line no-unused-vars
import { AsyncAPIDocumentInterface } from '@asyncapi/parser';
import { includeFile, generateBase64Favicon, renderSpec, stringifySpec, stringifyConfiguration } from '../helpers/all';

/**
 * @param {{asyncapi: AsyncAPIDocumentInterface, params: any}} param0 
 */
export function Index({ asyncapi, params }) {
  return (`<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8">
      ${params.baseHref && `<base href="${params.baseHref}">`}
      <title>${asyncapi.info().title()} ${asyncapi.info().version()} documentation</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="icon" type="image/x-icon" href="${generateBase64Favicon(params)}" />
      ${params.singleFile && `<style type="text/css">
        ${includeFile("template/css/global.min.css")}
        ${includeFile("template/css/asyncapi.min.css")}
      </style>`}
      ${!params.singleFile && `<link href="css/global.min.css" rel="stylesheet">
        <link href="css/asyncapi.min.css" rel="stylesheet">`}
    </head>
  
    <body>
      <div id="root">${renderSpec(asyncapi, params)}</div>
  
      ${params.singleFile && ` <script type="text/javascript">
        {{ "template/js/asyncapi-ui.min.js" | includeFile | safe }}
      </script>`}
      ${!params.singleFile && `<script src="js/asyncapi-ui.min.js" type="application/javascript"></script>`}
  
      <script>
        const schema = ${stringifySpec(asyncapi)};
        const config = ${stringifyConfiguration(params)};
        AsyncApiStandalone.hydrate({ schema, config }, document.getElementById("root"));
      </script>
    </body>
  </html>`
  );
}
  