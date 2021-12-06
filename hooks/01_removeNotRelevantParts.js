const path = require('path');
const rimraf = require('rimraf');

const callback = (error) => {
  if (error) {
    throw error;
  }
};

/**
 * Removes unnecessary files (css, js) if user pass `singleFile` parameter. 
 */
module.exports = {
  'generate:after': ({ templateParams = {}, targetDir }) => {        
    if (templateParams.singleFile === 'true') {
      const jsDir = path.resolve(targetDir, 'js');
      const cssDir = path.resolve(targetDir, 'css');

      const opts = {
        disableGlob: true,
        maxBusyTries: 3
      };

      rimraf(jsDir, opts, callback);
      rimraf(cssDir, opts, callback);
    }
  }
};
