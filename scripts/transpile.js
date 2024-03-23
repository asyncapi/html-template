const { transpileFiles } = require('@asyncapi/generator-react-sdk');
const path = require('path')

async function main(){
  async function transpileTemplate() {
    const templateContentDir = path.join(__dirname, '../template');
    console.log("templateContentDir",templateContentDir)
    const outputDir = path.join(__dirname, '../__transpiled');
    console.log("outputDir",outputDir)
  
    await transpileFiles(templateContentDir, outputDir, { recursive: true });
  }
  
  transpileTemplate().catch((err) => console.log('Error during template transpilation:', err));
}

main()

module.exports = { main }