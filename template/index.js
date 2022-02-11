import { File } from "@asyncapi/generator-react-sdk";
import { includeFile, renderSpec, stringifySpec, stringifyConfiguration } from  '../filters/all';
import { HTML, Head, Body } from "../components/common";
export default function Index({ asyncapi, params }) {
  return (
    <File name="index.html">
      <HTML>
        <Head
          title={`${asyncapi.info().title()} ${asyncapi.info().version()} documentation`}
          cssLinks={!params.singleFile ? ['css/global.min.css', 'css/asyncapi.min.css'] : []}
          styleContent={params.singleFile ? [includeFile('template/css/global.min.css'), includeFile('template/css/asyncapi.min.css')] : []}
          base={params.baseHref || ""}
        />
        <Body>
          {`<div id="root">${renderSpec(asyncapi,params)}</div>`}
          <Scripts asyncapi={asyncapi} params={params} />
        </Body>
      </HTML>
    </File>
  );
}
function Scripts({ asyncapi, params }) {
  if (params.singleFile) {
    return `
        <script type="text/javascript">
          ${includeFile("template/js/asyncapi-ui.min.js")} 
        </script>
        <script>
            var schema = ${stringifySpec(asyncapi)};
            var config = ${stringifyConfiguration(params)};
            AsyncApiStandalone.hydrate({ schema, config }, document.getElementById("root"));
        </script>
    `;
  } else {
    return `
        <script src="js/asyncapi-ui.min.js" type="application/javascript"></script>
        <script>
          var schema = ${stringifySpec(asyncapi)};
          var config = ${stringifyConfiguration(params)};
          AsyncApiStandalone.hydrate({ schema, config }, document.getElementById("root"));
        </script>
    `;
  }
}