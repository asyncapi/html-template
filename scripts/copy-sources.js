/**
 * Script that copies all given files from `node_modules` to the `template` folder. 
 * It is runned every time it package is published. 
 * This way we have an up to date sources to render the template.
 */

const util = require('util');
const fs = require('fs');
const path = require('path');
const copyFile = util.promisify(fs.copyFile);

// source (node_modules): destination (template)
const filesToCopy = {
  "react/umd/react.production.min.js": "js/react.production.min.js",
  "react-dom/umd/react-dom.production.min.js": "js/react-dom.production.min.js",
  "@asyncapi/react-component/browser/without-parser.js": "js/asyncapi-ui.min.js",
  "@asyncapi/react-component/styles/default.min.css": "css/styles.min.css",
};

async function copyFiles() {
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
