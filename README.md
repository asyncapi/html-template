[![AsyncAPI HTML Template](assets/github-repobanner-htmltemp.png)](https://www.asyncapi.com)

HTML template for the [AsyncAPI Generator](https://github.com/asyncapi/generator) using an [AsyncAPI React Component](https://github.com/asyncapi/asyncapi-react) under the hood.

---

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-16-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->
![npm](https://img.shields.io/npm/dm/@asyncapi/html-template?style=flat-square)

---

<!-- toc is generated with GitHub Actions do not remove toc markers -->

<!-- toc -->

- [Usage](#usage)
- [Supported parameters](#supported-parameters)
- [Development](#development)
- [Contributors ✨](#contributors-)

<!-- tocstop -->

## Usage

Install AsyncAPI CLI

```bash
npm install -g @asyncapi/cli
```

Generate using CLI

```bash
asyncapi generate fromTemplate <asyncapi.yaml> @asyncapi/html-template@0.28.0
```

You can replace <asyncapi.yaml> with local path or URL pointing to [any AsyncAPI document](https://raw.githubusercontent.com/asyncapi/spec/master/examples/streetlights-kafka.yml).
To use a specific version, look into [Releases](https://github.com/asyncapi/html-template/releases).

## Supported parameters

| Name | Description | Required | Default | Allowed values | Example |
|---|---|---|---|---|---|
| sidebarOrganization | Defines how the sidebar should be organized. Set its value to `byTagsNoRoot` to categorize operations by operations tags. Set its value to `byTags` when you have tags on a root level. These tags are used to model tags navigation and need to have the same tags in operations. | No | undefined | `byTags`, `byTagsNoRoot` | `byTagsNoRoot` |
| baseHref | Sets the base URL for links and forms. | No | `/` | *Any* | `/docs` |
| version | Override the version of your application provided under `info.version` location in the specification file. | No | Version is taken from the spec file. | *Any* ([See Semver versioning](https://semver.org/)) | `1.0.0` |
| singleFile | Set output into one html-file with styles and scripts inside. | No | `false` | `true`,`false` | `true` |
| outFilename | The filename of the output file. | No | `index.html` | *Any* | `asyncapi.html` |
| pdf | Generates output HTML as PDF. | No | `false` | `true`, `false` | `true` |
| pdfTimeout | Timeout (in ms) used to generate the PDF. | No | 30000 | >=0 | 1000 |
| favicon | Defines the URL/Path used for the favicon. | No | `assets/asyncapi-favicon.ico` | Any valid favicon URL/Path. | `"https://studio.asyncapi.com/favicon.ico"` |
| config | Inline stringified JSON or a path to a JSON file to override default React component config. The config override is merged with the default config using the [JSON Merge Patch](https://tools.ietf.org/html/rfc7386) algorithm. | No | `{ "show": { "sidebar": true }, "sidebar": { "showOperations": "byDefault" } }` | [JSON config for the React component](https://github.com/asyncapi/asyncapi-react/blob/next/docs/configuration/config-modification.md#definition) | `{"show":{"sidebar":false}}` |

> **NOTE**: If you only generate an HTML website, set the environment variable `PUPPETEER_SKIP_CHROMIUM_DOWNLOAD` to `true` and the generator will skip downloading chromium.

## Development

The HTML-Template is built with an [AsyncAPI React Component](https://github.com/asyncapi/asyncapi-react). For any changes regarding the styling of the page, rendering of the missing/existing elements, please contribute to the [AsyncAPI React Component](https://github.com/asyncapi/asyncapi-react) repository.

If you want make changes in template itself, please follow:

1. Make sure you have the latest generator installed: `npm install -g @asyncapi/generator`.
1. Modify the template or its helper functions. 

    >**NOTE:** If you have to modify the [`dummy.yml`](https://github.com/asyncapi/generator/blob/master/test/docs/dummy.yml) file to develop your features, open a PR with the changes in the [asyncapi/generator](https://github.com/asyncapi/generator) repository.

1. Generate output with watcher enabled: `npm run develop`.
   
   >**NOTE:** If your changes are not visible, this is maybe because the `ag` use the already installed `html-template` so you should use the `--install` option
   > * run `npm run develop:install`
   > * if command failed, delete the cached `html-template` module in your system and re-rerun the command
   
1. Open HTML in your browser: `open ./test/output/index.html`.

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://www.jamescrowley.net"><img src="https://avatars1.githubusercontent.com/u/509533?v=4?s=100" width="100px;" alt=""/><br /><sub><b>James Crowley</b></sub></a><br /><a href="https://github.com/asyncapi/html-template/commits?author=jamescrowley" title="Code">💻</a> <a href="https://github.com/asyncapi/html-template/issues?q=author%3Ajamescrowley" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://waleedashraf.me/"><img src="https://avatars0.githubusercontent.com/u/8335457?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Waleed Ashraf</b></sub></a><br /><a href="https://github.com/asyncapi/html-template/commits?author=WaleedAshraf" title="Code">💻</a> <a href="https://github.com/asyncapi/html-template/issues?q=author%3AWaleedAshraf" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://deltaeight.de"><img src="https://avatars1.githubusercontent.com/u/19175262?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Julian Rabe</b></sub></a><br /><a href="https://github.com/asyncapi/html-template/commits?author=schw4rzlicht" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/sebastian-palma"><img src="https://avatars2.githubusercontent.com/u/11888191?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Sebastián</b></sub></a><br /><a href="https://github.com/asyncapi/html-template/commits?author=sebastian-palma" title="Tests">⚠️</a> <a href="https://github.com/asyncapi/html-template/commits?author=sebastian-palma" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/GordeevArt"><img src="https://avatars2.githubusercontent.com/u/2003488?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Gordeev Artem</b></sub></a><br /><a href="https://github.com/asyncapi/html-template/commits?author=GordeevArt" title="Code">💻</a></td>
    <td align="center"><a href="https://sa.watz.ky"><img src="https://avatars2.githubusercontent.com/u/7246741?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Mitchell Sawatzky</b></sub></a><br /><a href="https://github.com/asyncapi/html-template/commits?author=bufutda" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/HashTalmiz"><img src="https://avatars0.githubusercontent.com/u/55018280?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Talmiz Ahmed</b></sub></a><br /><a href="https://github.com/asyncapi/html-template/commits?author=HashTalmiz" title="Code">💻</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://www.linkedin.com/in/jbreitenbaumer/"><img src="https://avatars3.githubusercontent.com/u/683438?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Jürgen B.</b></sub></a><br /><a href="#infra-juergenbr" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a></td>
    <td align="center"><a href="https://codepen.io/gabrielclaudino/"><img src="https://avatars2.githubusercontent.com/u/26636890?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Gabriel Claudino</b></sub></a><br /><a href="https://github.com/asyncapi/html-template/commits?author=gabrielclaudino" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/bszwarc"><img src="https://avatars1.githubusercontent.com/u/17266942?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Barbara Szwarc</b></sub></a><br /><a href="https://github.com/asyncapi/html-template/commits?author=bszwarc" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/Theiaz"><img src="https://avatars.githubusercontent.com/u/9378662?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Julian S.</b></sub></a><br /><a href="https://github.com/asyncapi/html-template/commits?author=Theiaz" title="Code">💻</a></td>
    <td align="center"><a href="http://blog.ineat-conseil.fr/"><img src="https://avatars.githubusercontent.com/u/5501911?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Ludovic Dussart</b></sub></a><br /><a href="https://github.com/asyncapi/html-template/commits?author=M3lkior" title="Code">💻</a></td>
    <td align="center"><a href="https://w3tec.ch"><img src="https://avatars.githubusercontent.com/u/1021324?v=4?s=100" width="100px;" alt=""/><br /><sub><b>David Weber</b></sub></a><br /><a href="https://github.com/asyncapi/html-template/commits?author=dweber019" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/magicmatatjahu"><img src="https://avatars.githubusercontent.com/u/20404945?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Maciej Urbańczyk</b></sub></a><br /><a href="https://github.com/asyncapi/html-template/commits?author=magicmatatjahu" title="Code">💻</a> <a href="https://github.com/asyncapi/html-template/commits?author=magicmatatjahu" title="Tests">⚠️</a> <a href="https://github.com/asyncapi/html-template/issues?q=author%3Amagicmatatjahu" title="Bug reports">🐛</a> <a href="#maintenance-magicmatatjahu" title="Maintenance">🚧</a> <a href="https://github.com/asyncapi/html-template/pulls?q=is%3Apr+reviewed-by%3Amagicmatatjahu" title="Reviewed Pull Requests">👀</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://www.brainfart.dev/"><img src="https://avatars.githubusercontent.com/u/6995927?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Lukasz Gornicki</b></sub></a><br /><a href="#maintenance-derberg" title="Maintenance">🚧</a> <a href="https://github.com/asyncapi/html-template/commits?author=derberg" title="Code">💻</a> <a href="https://github.com/asyncapi/html-template/issues?q=author%3Aderberg" title="Bug reports">🐛</a> <a href="https://github.com/asyncapi/html-template/pulls?q=is%3Apr+reviewed-by%3Aderberg" title="Reviewed Pull Requests">👀</a> <a href="https://github.com/asyncapi/html-template/commits?author=derberg" title="Tests">⚠️</a></td>
    <td align="center"><a href="http://www.fmvilas.com/"><img src="https://avatars.githubusercontent.com/u/242119?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Fran Méndez</b></sub></a><br /><a href="#maintenance-fmvilas" title="Maintenance">🚧</a> <a href="https://github.com/asyncapi/html-template/commits?author=fmvilas" title="Code">💻</a> <a href="https://github.com/asyncapi/html-template/issues?q=author%3Afmvilas" title="Bug reports">🐛</a> <a href="https://github.com/asyncapi/html-template/pulls?q=is%3Apr+reviewed-by%3Afmvilas" title="Reviewed Pull Requests">👀</a> <a href="https://github.com/asyncapi/html-template/commits?author=fmvilas" title="Tests">⚠️</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
