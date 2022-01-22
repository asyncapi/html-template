/*
 * Below you can see how to create reusable chunks/components/helpers.
 * Check the files in the `template` folder to see how to import and use them within a template.
 */

import {
  Indent,
  IndentationTypes,
  withIndendation,
} from "@asyncapi/generator-react-sdk";

/*
 * Each component has a `childrenContent` property.
 * It is the processed children content of a component into a pure string. You can use it for compositions in your component.
 *
 * Example:
 * function CustomComponent({ childrenContent }) {
 *   return `some text at the beginning: ${childrenContent}`
 * }
 *
 * function RootComponent() {
 *   return (
 *     <CustomComponent>
 *       some text at the end.
 *     </CustomComponent>
 *   );
 * }
 *
 * then output from RootComponent will be `some text at the beginning: some text at the end.`.
 */
export function HTML({ childrenContent }) {
  return `
<!DOCTYPE html>
<html lang="en">
${childrenContent}
</html>
`;
}

/*
 * If you need indent content inside template you can use `withIndendation` function or wrap content between `Indent` component.
 * The mentioned helper and component can be imported from `@asyncapi/generator-react-sdk` package.
 *
 * `withIndendation` function performs action on pure string, but `Indent` can wraps part of template.
 * You can see usage both cases below.
 *
 * Also you can see how to create components using composition.
 * You can use another component with the given parameters for the given use-case.
 */
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
