const fs = require('fs');
const path = require('path');
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const { default: AsyncApiComponent, hljs } = require('@asyncapi/react-component');

const filter = module.exports;

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

function replaceObject(val) {
  return Object.entries(val).reduce((o, [propertyName, property]) => {
    if (propertyName.startsWith('x-parser-')) {
      o[propertyName] = property;
    }
    return o;
  }, {});
}

/**
 * Remove this function when it will be implemented https://github.com/asyncapi/parser-js/issues/266
 */
function replaceCircular(val, cache) {
  cache = cache || new WeakSet();

  if (val && typeof(val) == 'object') {
    if (cache.has(val)) {
      if (!Array.isArray(val)) {
        return replaceObject(val);
      }
      return {};
    }

    cache.add(val);

    const obj = (Array.isArray(val) ? [] : {});
    for(var idx in val) {
      obj[idx] = replaceCircular(val[idx], cache);
    }

    cache.delete(val);
    return obj;
  }
  return val;
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
    const lang = require(path.resolve(hljsLanguagesPath, langPath));
    hljs.registerLanguage(lang.name, lang);
  }

  initLanguages = true;
}
filter.loadLanguagesConfig = loadLanguagesConfig;

/**
 * More safe function to include content of given file than default Nunjuck's `include`.
 * Attaches raw file's content instead of executing it - problem with some attached files in template.
 */
function includeFile(pathFile) {
  const pathToFile = path.resolve(__dirname, '../', pathFile);
  return fs.readFileSync(pathToFile);
}
filter.includeFile = includeFile;

/**
 * Stringifies the specification with escaping circular refs 
 * and annotates that specification is parsed.
 */
function stringifySpec(asyncapi) {
  return JSON.stringify(replaceCircular(asyncapi.json()));
}
filter.stringifySpec = stringifySpec;

/**
 * Stringifies prepared configuration for component.
 */
function stringifyConfiguration(params) {
  return JSON.stringify(prepareConfiguration(params));
}
filter.stringifyConfiguration = stringifyConfiguration;

/**
 * Renders AsyncApi component by given AsyncAPI spec and with corresponding template configuration.
 */
function renderSpec(asyncapi, params) {
  loadLanguagesConfig();

  const component = React.createElement(AsyncApiComponent, { schema: asyncapi, config: prepareConfiguration(params) });
  return ReactDOMServer.renderToString(component);
}
filter.renderSpec = renderSpec;
