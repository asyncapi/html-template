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

export function Head({ title, cssLinks = [],base }) {
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
