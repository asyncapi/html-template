import { hljs } from '@asyncapi/react-component';
import { AsyncAPIDocument } from "@asyncapi/parser";

import { 
  includeFile,
  retrieveLanguages,
  loadLanguagesConfig,
  stringifySpec,
  stringifyConfiguration,
  renderSpec,
} from "../../filters/all";

describe('Filters', () => {
  describe('.includeFile', () => {
    it('should read content of file', async () => {
      const content = includeFile('node_modules/@asyncapi/react-component/browser/standalone/without-parser.js');

      expect(content instanceof Buffer).toEqual(true);
      expect(content.toString().length > 0).toEqual(true);
    });
  });

  describe('.retrieveLanguages', () => {
    it('should retrieve list of languages', async () => {
      const languages = retrieveLanguages('text\n```js\nfoo\n```\ntext abc\n```bash\nbar\n```\nxyz');

      expect(languages.length).toEqual(2);
      expect(languages).toEqual(['js', 'bash']);
    });

    it('should retrieve unique languages', async () => {
      const languages = retrieveLanguages('text\n```js\nfoo\n```\ntext text\n```js\nfoo\n```\ntext');

      expect(languages.length).toEqual(1);
      expect(languages).toEqual(['js']);
    });
  });

  describe('.loadLanguagesConfig', () => {
    it('should load languages', async () => {
      expect(hljs.getLanguage('csharp')).toEqual(undefined);
      expect(hljs.getLanguage('ruby')).toEqual(undefined);

      loadLanguagesConfig('text\n```csharp\nfoo\n```\ntext abc\n```ruby\nbar\n```\nxyz');

      expect(hljs.getLanguage('csharp') === undefined).toEqual(false);
      expect(hljs.getLanguage('ruby') === undefined).toEqual(false);
    });

    it('should load language using alias', async () => {
      // use alias
      expect(hljs.getLanguage('ts')).toEqual(undefined);

      loadLanguagesConfig('abc\n```ts\nbar\n```\nxyz');

      expect(hljs.getLanguage('ts') === undefined).toEqual(false);
      expect(hljs.getLanguage('typescript') === hljs.getLanguage('ts')).toEqual(true);
    });

    it('should warn if at least one language does not exist', async () => {
      const originalWarn = console.warn;
      let warning;
      console.warn = (...args) => { warning = args[0] };
      loadLanguagesConfig('text\n```bash\nfoo\n```\ntext abc\n```foo_bar\nbar\n```\nxyz');
      console.warn = originalWarn;

      expect(warning).toEqual('Cannot find highlight.js configuration for "foo_bar" language. Check if this is the correct language.');
    });
  });

  describe('.stringifySpec', () => {
    it('should work', async () => {
      const schema = {
        type: 'object',
        properties: {
          foo: { type: 'string' },
          bar: {  },
        },
        'x-parser-schema-id': 'parsedDoc',
        'x-parser-circular-props': ['bar'],
      }
      schema.properties.bar = schema;
      const doc = new AsyncAPIDocument({ asyncapi: '2.0.0', components: { schemas: { dummySchema: schema } }});
      
      const expected = `{"asyncapi":"2.0.0","components":{"schemas":{"dummySchema":{"type":"object","properties":{"foo":{"type":"string","x-parser-schema-id":"<anonymous-schema-1>"},"bar":{"x-parser-schema-id":"dummySchema","x-parser-circular-props":["bar"]}},"x-parser-schema-id":"dummySchema","x-parser-circular-props":["bar"]}}},"x-parser-spec-parsed":true}`;
      const expectedParsed = {
        asyncapi: '2.0.0',
        components: { 
          schemas: { 
            dummySchema: {
              type: 'object',
              properties: {
                foo: { type: 'string', 'x-parser-schema-id': '<anonymous-schema-1>' },
                bar: {
                  // x-parser-schema-id and x-parser-circular-props are inferred from dummySchema
                  // stringifySpec infers all `x-parser` extensions
                  'x-parser-schema-id': 'dummySchema',
                  'x-parser-circular-props': ['bar']
                }
              },
              'x-parser-schema-id': 'dummySchema',
              'x-parser-circular-props': ['bar'],
            },
          },
        },
        'x-parser-spec-parsed': true
      };

      const result = stringifySpec(doc);
      const parsedSchema = JSON.parse(result);

      expect(result).toEqual(expected);
      expect(parsedSchema).toEqual(expectedParsed);
    });
  });

  describe('.stringifyConfiguration', () => {
    it('should work without parameters', async () => {
      const expected = `{"show":{"sidebar":true},"sidebar":{"showOperations":"byDefault"}}`;

      const result = stringifyConfiguration();
      expect(result).toEqual(expected);
    });

    it('should work for byTags sidebarOrganization', async () => {
      const params = { sidebarOrganization: 'byTags' };
      const expected = `{"show":{"sidebar":true},"sidebar":{"showOperations":"bySpecTags"}}`;

      const result = stringifyConfiguration(params);
      expect(result).toEqual(expected);
    });

    it('should work for byTagsNoRoot sidebarOrganization', async () => {
      const params = { sidebarOrganization: 'byTagsNoRoot' };
      const expected = `{"show":{"sidebar":true},"sidebar":{"showOperations":"byOperationsTags"}}`;

      const result = stringifyConfiguration(params);
      expect(result).toEqual(expected);
    });
  });

  describe('.renderSpec', () => {
    it('should work', async () => {
      const doc = new AsyncAPIDocument({ asyncapi: '2.0.0', info: { title: 'dummy spec for testing', version: '2.1.37' } });

      const result = renderSpec(doc);
      // check if '2.1.37' version is rendered
      expect(result.includes('2.1.37')).toEqual(true);
      // check if 'dummy spec for testing' title is rendered
      expect(result.includes('dummy spec')).toEqual(true);
    });
  });
});
