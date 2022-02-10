import {
  Indent,
  IndentationTypes,
  withIndendation,
} from "@asyncapi/generator-react-sdk";

export function HTML({ childrenContent }) {
  return `
<!DOCTYPE html>
<html lang="en">
${childrenContent}
</html>
`;
}

export function Head({ title, cssLinks = [], styleContent = [],base = "" }) {
  const baseTag= `<base href=${base}>`;
  const cssLinksData = `\n<link href=${cssLinks[0]}>\n<link href=${cssLinks[1]}>\n`;
  const styleContentData = `<style>\n${styleContent[0]}\n${styleContent[1]}</style>`;
  const content = `
<head>
  <meta charset="utf-8">
  ${base && baseTag}
  <title>${title}</title>
${withIndendation(links, 2, IndentationTypes.SPACES)}
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ${(styleContent.length > 0) ? styleContentData : ""}
  ${(cssLinks.length > 0) ? cssLinksData : ""}
</head>  
`;

  return (
    <Indent size={2} type={IndentationTypes.SPACES}>
      {content}
    </Indent>
  );
}

export function Body({ childrenContent }) {
  const content = `
<body>
${withIndendation(childrenContent, 2, IndentationTypes.SPACES)}
</body>
`;

  return (
    <Indent size={2} type={IndentationTypes.SPACES}>
      {content}
    </Indent>
  );
}