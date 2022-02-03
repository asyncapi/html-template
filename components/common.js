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

export function Head({ title, cssLinks = [], styleContent = [],base }) {
  const links = cssLinks
    .map((link) => `<link rel="stylesheet" href="${link}">\n`)
    .join("");

  const content = `
<head>
  <meta charset="utf-8">
  <base href=${base}>
  <title>${title}</title>
${withIndendation(links, 2, IndentationTypes.SPACES)}
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style type="text/css">
    ${styleContent[0]}
    ${styleContent[1]}
  </style>
  <link href=${cssLinks[0]}>
  <link href=${cssLinks[1]}>
  <link>
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