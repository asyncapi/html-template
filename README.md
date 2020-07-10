# HTML template for the AsyncAPI Generator
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-4-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

## Usage

```
ag asyncapi.yaml @asyncapi/html-template -o output
```

If you don't have the AsyncAPI Generator installed, you can install it like this:

```
npm install -g @asyncapi/generator
```

## Supported parameters

|Name|Description|Required|Allowed values|Example|
|---|---|---|---|---|
|sidebarOrganization|Defines how the sidebar should be organized. Set its value to 'byTags' to categorize operations by tags.|No|`byTags`|`byTags`|
|baseHref|Sets the base URL for links and forms.|No|*Any*|`/docs`|

## Development

1. Make sure you have the latest generator installed `npm install -g @asyncapi/generator`.
1. Modify the template or it's helper functions. Adjust `test/spec/asyncapi.yml` to have more features if needed.
1. Generate output with watcher enables `npm run develop`.
1. Open HTML in your browser `open ./test/output/index.html`.

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://www.jamescrowley.net"><img src="https://avatars1.githubusercontent.com/u/509533?v=4" width="100px;" alt=""/><br /><sub><b>James Crowley</b></sub></a><br /><a href="https://github.com/asyncapi/html-template/commits?author=jamescrowley" title="Code">💻</a> <a href="https://github.com/asyncapi/html-template/issues?q=author%3Ajamescrowley" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://waleedashraf.me/"><img src="https://avatars0.githubusercontent.com/u/8335457?v=4" width="100px;" alt=""/><br /><sub><b>Waleed Ashraf</b></sub></a><br /><a href="https://github.com/asyncapi/html-template/commits?author=WaleedAshraf" title="Code">💻</a> <a href="https://github.com/asyncapi/html-template/issues?q=author%3AWaleedAshraf" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://deltaeight.de"><img src="https://avatars1.githubusercontent.com/u/19175262?v=4" width="100px;" alt=""/><br /><sub><b>Julian Rabe</b></sub></a><br /><a href="https://github.com/asyncapi/html-template/commits?author=schw4rzlicht" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/sebastian-palma"><img src="https://avatars2.githubusercontent.com/u/11888191?v=4" width="100px;" alt=""/><br /><sub><b>Sebastián</b></sub></a><br /><a href="https://github.com/asyncapi/html-template/commits?author=sebastian-palma" title="Tests">⚠️</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!