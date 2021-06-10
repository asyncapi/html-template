const fs = require('fs');
const path = require('path');
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const { default: AsyncApiComponent, hljs } = require('@asyncapi/react-component');

const filter = module.exports;

const langAliases = {};
/**
 * Get language alias from highlight.js
 */
function getLangAlias(language) {
  if (Object.keys(langAliases).length) {
    return langAliases[language];
  }

  const hljsPath = path.resolve(__dirname, '../node_modules/highlight.js/lib/languages');
  const languages = fs.readdirSync(hljsPath);
  
  for (let langPath of languages) {
    const lang = require(path.resolve(hljsPath, langPath));
    const aliases = lang(hljs).aliases;

    for (let alias of (aliases || [])) {
      langAliases[alias] = lang.name;
    }
    langAliases[lang.name] = lang.name;
  }

  return langAliases[language];
}

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
 * Retrieves all languages included in code blocks in the specification.
 */
function retrieveLanguages(originalAsyncAPI) {
  const regex = /^(([ \t]*`{3,4})([^\n]*)([\s\S]+?)(^[ \t]*\2))/gm,
    langauges = [];

  let match = null;
  while ((match = regex.exec(originalAsyncAPI))) {
    langauges.push(match[3]);
  }
  return [...new Set(langauges)];
}
filter.retrieveLanguages = retrieveLanguages;

/**
 * Include content of given language to template in `<script>` tag.
 */
function includeLanguage(language) {
  try {
    const lang = getLangAlias(language);
    return includeFile(`node_modules/@highlightjs/cdn-assets/languages/${lang}.min.js`);
  } catch (e) {
    return '';
  }
}
filter.includeLanguage = includeLanguage;

/**
 * Load config for all languages included in code blocks in the specification.
 */
function loadLanguagesConfig(originalAsyncAPI) {
  const languages = retrieveLanguages(originalAsyncAPI);
  for (let language of languages) {
    try {
      const lang = getLangAlias(language);
      // highlight.js is included in `@asyncapi/react-component` as dependency
      const config = require(`highlight.js/lib/languages/${lang}.js`);
      hljs.registerLanguage(lang, config);
    } catch (e) {
      console.warn(`Cannot find highlight.js configuration for "${language}" language. Check if this is the correct language.`)
    }
  }
}
filter.loadLanguagesConfig = loadLanguagesConfig;

/**
 * Stringifies the specification with escaping circular refs 
 * and annotates that specification is parsed.
 */
function stringifySpec(asyncapi) {
  asyncapi._json['x-parser-spec-parsed'] = true;
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
function renderSpec(asyncapi, originalAsyncAPI, params) {
  loadLanguagesConfig(originalAsyncAPI);

  const component = React.createElement(AsyncApiComponent, { schema: asyncapi, config: prepareConfiguration(params) });
  return ReactDOMServer.renderToString(component);
}
filter.renderSpec = renderSpec;
