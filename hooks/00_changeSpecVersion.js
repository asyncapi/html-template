/**
 * Changes the version of the specification by the `version` parameter.
 */
module.exports = {
  'generate:before': ({ asyncapi, templateParams = {} }) => {
    const version = templateParams.version || asyncapi.info().version();
    asyncapi._json.info.version = version;
  }
};
