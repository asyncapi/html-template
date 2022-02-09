import { File } from "@asyncapi/generator-react-sdk";
import filter from  '../filters/all';
import { HTML, Head, Body } from "../components/common";

export default function Index({ asyncapi, params }) {
  return (
    <File name="index.html">
      <HTML>
        <Head
          title={`${asyncapi.info().title()} ${asyncapi.info().version()} documentation`}
          cssLinks={!params.singleFile ? ["css/global.min.css","css/asyncapi.min.css"] : []}
          styleContent={params.singleFile ? [filter.includeFile("template/css/global.min.css"),filter.includeFile("template/css/asyncapi.min.css")] : []}
          base={params.baseHref || ""}
        />
        <Body>
          <div id="root">{filter.renderSpec(asyncapi,params)}</div>
          <Scripts params={params} />
        </Body>
      </HTML>
    </File>
  );
}
function Scripts({ params }) {
  if (params.singleFile) {
    return `
        <script type="text/javascript">
          ${filter.includeFile("template/js/asyncapi-ui.min.js")} 
        </script>
        <script>
            var schema = ${filter.stringifySpec(asyncapi)};
            var config = ${filter.stringifyConfiguration(params)};
            AsyncApiStandalone.hydrate({ schema, config }, document.getElementById("root"));
        </script>
    `;
  } else {
    return `
        <script src="js/asyncapi-ui.min.js" type="application/javascript"></script>
        <script>
          var schema = ${filter.stringifySpec(asyncapi)};
          var config = ${filter.stringifyConfiguration(params)};
          AsyncApiStandalone.hydrate({ schema, config }, document.getElementById("root"));
        </script>
    `;
  }
}
