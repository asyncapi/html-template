/**
 * Script that copies all given files from `node_modules` to the `template` folder. 
 * It is run every time the package is published. 
 * This way we have an up to date sources to render the template.
 */

const util = require('util');
const fs = require('fs-extra');
const path = require('path');
const copyFile = util.promisify(fs.copyFile);
const { exec } = require('child_process');

// source (node_modules): destination (template)
const filesToCopy = {
  "node_modules/@asyncapi/react-component/browser/standalone/without-parser.js": "js/asyncapi-ui.min.js",
  "node_modules/@asyncapi/react-component/styles/default.min.css": "css/asyncapi.min.css",
};

async function copyFiles() {
  await new Promise((resolve) => {
    exec('npm run transpile', (err, stdout, stderr) => {
      if (err) {
        console.error(`Error during template transpilation: ${err}`);
        return;
      }
      if (stdout) console.log(stdout);
      if (stderr) console.log('Template transpilation error:', stderr);
      resolve();
    });
  });
  const operations = Object.entries(filesToCopy).map(([source, destination]) => {
    return copyFile(path.join(__dirname, '../node_modules', source), path.join(__dirname, '../template', destination));
  });
  await Promise.all(operations);
}

copyFiles().then(() => {
  console.log("Files copied!");
}).catch(err => {
  console.log(err);
});
