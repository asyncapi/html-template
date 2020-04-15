# HTML template for the AsyncAPI Generator

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
