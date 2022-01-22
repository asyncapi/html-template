import { File } from "@asyncapi/generator-react-sdk";

// Import custom components from file
import { HTML, Head, Body } from "../components/common";

export default function Index({ asyncapi, params }) {
  const getCssLinks = () => {
    const cssLinks = [];
    if (params.singleFile) {
      cssLinks.push("template/css/asyncapi-ui.css");
      cssLinks.push("template/css/asyncapi-ui.css");
    } else {
      cssLinks.push("css/asyncapi-ui.css");
      cssLinks.push("css/asyncapi-ui.css");
    }
    return cssLinks;
  };
  return (
    <File name="index.html">
      <HTML>
        <Head
          title={
            asyncapi.info().title() +
            asyncapi.info().version() +
            "documentation"
          }
          cssLinks={getCssLinks()}
          base={params.baseHref ? params.baseHref : ""}
        />
        <Body>
          <div id="root">{asyncapi}</div>
          <Scripts params={params} />
        </Body>
      </HTML>
    </File>
  );
}
function Scripts({ params }) {
  if (params.singleFile) {
    return `
        <script src="template/js/asyncapi-ui.min.js" type="text/javascript" ></script>
        <script>
            var schema = ${asyncapi};
            var config = ${params};
            AsyncApiStandalone.hydrate({ schema, config }, document.getElementById("root"));
        </script>
    `;
  } else {
    return `
        <script src="js/asyncapi-ui.min.js" type="application/javascript"></script>
        <script>
            var schema = ${asyncapi};
            var config = ${params};
            AsyncApiStandalone.hydrate({ schema, config }, document.getElementById("root"));
        </script>
    `;
  }
}
