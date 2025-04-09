const path = require('path');
const rimraf = require('rimraf');
const fs = require('fs');

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

      // Attempt to delete jsDir if it exists
      if (fs.existsSync(jsDir)) {
        rimraf.sync(jsDir, opts, callback);
      }

      // Attempt to delete cssDir if it exists
      if (fs.existsSync(cssDir)) {
        rimraf.sync(cssDir, opts, callback);
      }
    }
  }
};