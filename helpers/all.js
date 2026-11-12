import path from 'path';
import fs from 'fs';
import ReactDOMServer from 'react-dom/server';
import fetch from 'sync-fetch';
import AsyncApiComponent, { hljs } from '@asyncapi/react-component';
import { AsyncAPIDocumentInterface, stringify } from '@asyncapi/parser';

function isJsonObject(o) {
  return o && typeof o === 'object' && !Array.isArray(o);
}

/**
 * Performs a recursive deep merge while assuming only simple JSON types are used.
 */
function mergeInto(from, to) {
  for (const key in from) {
    if (!Object.hasOwn(from, key)) {
      continue;
    }
    if (isJsonObject(from[key])) {
      if (!isJsonObject(to[key])) {
        to[key] = {};
      }
      mergeInto(from[key], to[key]);
    } else {
      // Override with non-object JSON value
      to[key] = from[key];
    }
  }
}

/**
 * Parses a parameter that is stringified JSON or a path to a JSON file.
 */
function parseJsonParam(value, name) {
  if (!value) {
    return undefined;
  }
  try {
    // Attempt to parse inline stringified JSON
    return JSON.parse(value);
  } catch (jsonErr) {
    // Failed to parse JSON string...
    try {
      // Attempt to read as JSON file and parse contents
      return JSON.parse(fs.readFileSync(value, "utf8"));
    } catch (err) {
      console.error(`Failed to parse ${name} JSON`, jsonErr, err);
      throw err;
    }
  }
}

/**
 * Prepares configuration for component.
 */
export function prepareConfiguration(params = {}) {
  const config = { show: { sidebar: true }, sidebar: { showOperations: 'byDefault' } };
  // Apply config override
  const configOverride = parseJsonParam(params.config, 'config override');
  if (isJsonObject(configOverride)) {
    mergeInto(configOverride, config);
  }
  // Apply explicit config properties
  if (params.sidebarOrganization === 'byTags') {
    config.sidebar.showOperations = 'bySpecTags';
  } else if (params.sidebarOrganization === 'byTagsNoRoot') {
    config.sidebar.showOperations = 'byOperationsTags';
  }
  return config;
}

let initLanguages = false;
/**
 * Load all language configurations from highlight.js
 */
export function loadLanguagesConfig() {
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
 * Generate Base64 value from favicon
 */
export function generateBase64Favicon(params) {
  const favicon = params.favicon;

  // generate Base64 of AsyncAPI logo
  if (!favicon) {
    return "data:image/x-icon;base64," + fs.readFileSync(path.resolve(__dirname, '../assets/asyncapi-favicon.ico'), "base64");
  }

  try {
    // Attempt to fetch favicon
    const response = fetch(favicon);
    if (response.status == 200) {
      const buffer = response.buffer()
      return "data:image/x-icon;base64," + buffer.toString('base64');
    }
  } catch (fetchErr) {
    // Failed to fetch favicon...
    try {
      // Attempt to read favicon as file
      return "data:image/x-icon;base64," + fs.readFileSync(favicon, "base64");
    } catch (err) {
      console.error("Failed to fetch/read favicon", fetchErr, err);
      throw err;
    }
  }
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
  const stringifiedDoc = stringify(asyncapi);
  if(stringifiedDoc === undefined) throw new Error("Unable to stringify parsed AsyncAPI document passed by the generator. Please report an issue in https://github.com/asyncapi/html-template repository.")
  return stringifiedDoc
}

/**
 * Stringifies prepared configuration for component.
 */
export function stringifyConfiguration(params) {
  return JSON.stringify(prepareConfiguration(params));
}

/**
 * Prepares the options of the WebSocket plugin, or `null` when the plugin is off.
 * The `wsPlugin` parameter is `true`, or the options as stringified JSON or a path to a JSON file.
 */
export function prepareWsPluginOptions(params = {}) {
  const value = params.wsPlugin;
  if (value === undefined || value === false || value === '' || value === 'false') {
    return null;
  }
  if (value === true || value === 'true') {
    return {};
  }
  const options = parseJsonParam(value, 'wsPlugin options');
  if (!isJsonObject(options)) {
    throw new Error('The wsPlugin parameter must be true, or a JSON object of plugin options.');
  }
  return options;
}

/**
 * Stringifies the plugins of the component as a script expression.
 * It returns `undefined` when no plugin is on.
 */
export function stringifyPlugins(params) {
  const wsPluginOptions = prepareWsPluginOptions(params);
  if (wsPluginOptions === null) {
    return undefined;
  }
  return `[AsyncApiStandalone.createWsPlugin(${JSON.stringify(wsPluginOptions)})]`;
}

/**
 * Renders AsyncApi component by given AsyncAPI spec and with corresponding template configuration.
 */


/**
 * @param {AsyncAPIDocumentInterface} asyncapi 
 * @param {*} params 
 */
export function renderSpec(asyncapi, params) {
  loadLanguagesConfig();
  const config = prepareConfiguration(params);
  const stringified = stringifySpec(asyncapi);
  const component = <AsyncApiComponent schema={stringified} config={config}/>;
  if (typeof global.window === 'undefined' || !global.window.document) {
    const { JSDOM } = require('jsdom');
    const jsdomInstance = new JSDOM('<!doctype html><html><body></body></html>');
    global.window = jsdomInstance.window;
    global.document = jsdomInstance.window.document;
  }
  
  return ReactDOMServer.renderToString(component);
}
