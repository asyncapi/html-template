/**
 * Script that copies all given files from `node_modules` to the `template` folder. 
 * It is run every time the package is published. 
 * This way we have an up to date sources to render the template.
 */

const util = require('util');
const fs = require('fs');
const path = require('path');
const copyFile = util.promisify(fs.copyFile);
const { main } = require('./transpile')

// source (node_modules): destination (template)
const filesToCopy = {
  "@asyncapi/react-component/browser/standalone/without-parser.js": "js/asyncapi-ui.min.js",
  "@asyncapi/react-component/styles/default.min.css": "css/asyncapi.min.css",
};

async function copyFiles() {
  await main()
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
