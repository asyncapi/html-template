// eslint-disable-next-line no-unused-vars
import { AsyncAPIDocumentInterface } from "@asyncapi/parser";
import {
  includeFile,
  generateBase64Favicon,
  renderSpec,
  stringifySpec,
  stringifyConfiguration,
} from "../helpers/all";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function copyAsset(srcRel, destRel, outputDir) {
  const src = path.join(__dirname, srcRel);
  const dest = path.join(outputDir, destRel);
  const destDir = path.dirname(dest);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  fs.copyFileSync(src, dest);
}

/**
 * @param {{asyncapi: AsyncAPIDocumentInterface, params: any}} param0
 */
export function Index({ asyncapi, params = {} }) {
  const outputDir = params.outputDir || process.cwd();
  const favicon = generateBase64Favicon(params);
  const renderedSpec = renderSpec(asyncapi, params);
  let asyncapiScript = `<script src="js/asyncapi-ui.min.js" type="application/javascript"></script>`;
  // coerce singleFile param to bool, or "false" string will be true
  const singleFile =
    params?.singleFile === true || params?.singleFile == "true";
  if (singleFile) {
    asyncapiScript = `<script type="text/javascript">
    ${includeFile("template/js/asyncapi-ui.min.js")}
    </script>`;
  } else {
    copyAsset(
      "../template/js/asyncapi-ui.min.js",
      "js/asyncapi-ui.min.js",
      outputDir
    );
  }

  let styling = `<link href="css/global.min.css" rel="stylesheet">
      <link href="css/asyncapi.min.css" rel="stylesheet">`;
  if (singleFile) {
    styling = `<style type="text/css">
      ${includeFile("template/css/global.min.css")}
      ${includeFile("template/css/asyncapi.min.css")}
    </style>`;
  } else {
    copyAsset(
      "../template/css/global.min.css",
      "css/global.min.css",
      outputDir
    );
    copyAsset(
      "../template/css/asyncapi.min.css",
      "css/asyncapi.min.css",
      outputDir
    );
  }

  let basehref = "";
  if (params.baseHref) {
    basehref = `<base href="${params.baseHref}">`;
  }
  let appJs = `<script type="application/javascript" src="js/app.js"></script>`;
  if (singleFile) {
    appJs = `<script>${App({ asyncapi, params })}</script>`;
  } else {
    copyAsset("../template/js/app.js", "js/app.js", outputDir);
  }
  return `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8">
      ${basehref}
      <title>${asyncapi.info().title()} ${asyncapi
    .info()
    .version()} documentation</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="icon" type="image/x-icon" href="${favicon}" />
      ${styling}
    </head>
  
    <body>
      <div id="root">${renderedSpec}</div>
      ${asyncapiScript}
      ${appJs}
    </body>
  </html>`;
}

export function App({ asyncapi, params = {} }) {
  return `
    const schema = ${stringifySpec(asyncapi)};
    const config = ${stringifyConfiguration(params)};
    const appRoot = document.getElementById('root');
    AsyncApiStandalone.render(
        { schema, config, }, appRoot
    );
  `;
}
