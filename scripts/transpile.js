const { transpileFiles } = require("@asyncapi/generator-react-sdk");
const path = require("path");

async function transpileTemplate() {
  try {
    const templateContentDir = path.join(__dirname, "../template");
    console.log("Template content directory:", templateContentDir);
    const outputDir = path.join(__dirname, "../__transpiled");
    console.log("Output directory for transpiled files:", outputDir);
    await transpileFiles(templateContentDir, outputDir, { recursive: true });
  } catch (error) {
    console.log("Error during template transpilation:", err)
  }
}

transpileTemplate();
