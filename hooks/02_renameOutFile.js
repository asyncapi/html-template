const fs = require('fs');

/**
 * Renames out file's name to passed as `outFilename` parameter.
 */
module.exports = {
  'generate:after': ({ templateParams = {}, targetDir }) => {
    const outFilename = templateParams.outFilename;
    if (outFilename && outFilename !== 'index.html') {
      fs.renameSync(
        `${targetDir}/index.html`,
        `${targetDir}/${outFilename}`
      );
    }
  }
}
