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

export function Head({ title, cssLinks = [], styleContent = [], base = '' }) {
  const baseTag= `<base href=${base}>`;
  const cssLinksData = cssLinks.map(link => `<link href="${link}" rel="stylesheet">`).join('\n');
  const styleContentData = styleContent.length ? `<style type="text/css">${styleContent.join('\n')}</style>` : '';
  const content = `
<head>
  <meta charset="utf-8">
  ${base ? baseTag : ''}
  <title>${title}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ${styleContentData ? styleContentData: ''}
  ${cssLinksData ? cssLinksData : ''}
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