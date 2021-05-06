const fs = require('fs');
const path = require('path');
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const AsyncApiUI = require('@asyncapi/react-component').default;

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
 * More safe function to include content of given file than default Nunjuck's `include`.
 * Attaches raw file's content instead of executing it - problem with some attached files in template.
 */
function includeFile(pathFile) {
  const pathToFile = path.resolve(__dirname, '../', pathFile);
  return fs.readFileSync(pathToFile);
}
filter.includeFile = includeFile;

/**
 * Stringifies prepared configuration for component.
 */
function stringifyConfiguration(params) {
  return JSON.stringify(prepareConfiguration(params));
}
filter.stringifyConfiguration = stringifyConfiguration;

/**
 * Renders AsyncApiUI component by given AsyncAPI spec and with corresponding template configuration.
 */
function renderSpec(asyncapi, params) {
  const component = React.createElement(AsyncApiUI, { schema: asyncapi, config: prepareConfiguration(params) });
  return ReactDOMServer.renderToString(component);
}
filter.renderSpec = renderSpec;
