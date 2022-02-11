import fs from 'fs';
import path from 'path';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import AsyncApiComponent, { hljs } from '@asyncapi/react-component';
import { AsyncAPIDocument } from '@asyncapi/parser';

/**
 * Prepares configuration for component.
 */
function prepareConfiguration(params = {}) {
  const config = { show: { sidebar: true }, sidebar: { showOperations: 'byDefault' } };
  if (params.sidebarOrganization === 'byTags') {
    config.sidebar.showOperations = 'bySpecTags';
  }
  if (params.sidebarOrganization === 'byTagsNoRoot') {
    config.sidebar.showOperations = 'byOperationsTags';
  }
  return config;
}

let initLanguages = false;
/**
 * Load all language configurations from highlight.js
 */
function loadLanguagesConfig() {
  if (initLanguages === true) {
    return;
  }

  /**
   * Retrieve the location of highlight.js.
   * It's needed because someone can have installed `highlight.js` as global dependency
   * or depper than local `node_modules` of this template.
   */
  const hljsPackageDir = path.dirname(require.resolve("highlight.js/package.json"))
  const hljsLanguagesPath = path.resolve(hljsPackageDir, 'lib/languages');
  const languages = fs.readdirSync(hljsLanguagesPath);

  for (let langPath of languages) {
    const lang = require(path.resolve(hljsLanguagesPath, langPath.replace('.js', '')));
    hljs.registerLanguage(lang.name, lang);
  }

  initLanguages = true;
}

/**
 * More safe function to include content of given file than default Nunjuck's `include`.
 * Attaches raw file's content instead of executing it - problem with some attached files in template.
 */
export function includeFile(pathFile) {
  const pathToFile = path.resolve(__dirname, '../', pathFile);
  return fs.readFileSync(pathToFile);
}

/**
 * Stringifies the specification with escaping circular refs 
 * and annotates that specification is parsed.
 */
export function stringifySpec(asyncapi) {
  return AsyncAPIDocument.stringify(asyncapi);
}

/**
 * Stringifies prepared configuration for component.
 */
export function stringifyConfiguration(params) {
  return JSON.stringify(prepareConfiguration(params));
}

/**
 * Renders AsyncApi component by given AsyncAPI spec and with corresponding template configuration.
 */
export function renderSpec(asyncapi, params) {
  loadLanguagesConfig();

  const component = React.createElement(AsyncApiComponent, { schema: asyncapi, config: prepareConfiguration(params) });
  return ReactDOMServer.renderToString(component);
}