import { hljs } from '@asyncapi/react-component';
import { createAsyncAPIDocument } from "@asyncapi/parser";

import {
  includeFile,
  loadLanguagesConfig,
  stringifySpec,
  stringifyConfiguration,
  renderSpec,
} from "../../helpers/all";

describe('Helpers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe('.includeFile', () => {
    it('should read content of file', async () => {
      const content = includeFile('node_modules/@asyncapi/react-component/browser/standalone/without-parser.js');

      expect(content instanceof Buffer).toEqual(true);
      expect(content.toString().length > 0).toEqual(true);
    });
  });

  describe('.loadLanguagesConfig', () => {
    it('should load config for all languages', async () => {
      expect(hljs.getLanguage('csharp')).toEqual(undefined);
      expect(hljs.getLanguage('ruby')).toEqual(undefined);
      expect(hljs.getLanguage('typescript')).toEqual(undefined);
      // use alias
      expect(hljs.getLanguage('ts')).toEqual(undefined);

      loadLanguagesConfig();

      expect(hljs.getLanguage('csharp') === undefined).toEqual(false);
      expect(hljs.getLanguage('ruby') === undefined).toEqual(false);
      expect(hljs.getLanguage('ts') === undefined).toEqual(false);
      expect(hljs.getLanguage('typescript') === hljs.getLanguage('ts')).toEqual(true);
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
      const doc = createAsyncAPIDocument({
        semver: {
          major: 2,
          minor: 0,
          patch: 0,
        },
        parsed: { asyncapi: '2.0.0', components: { schemas: { dummySchema: schema } }},
      });

      const expected = `{\n  \"asyncapi\": \"2.0.0\",\n  \"components\": {\n    \"schemas\": {\n      \"dummySchema\": {\n        \"type\": \"object\",\n        \"properties\": {\n          \"foo\": {\n            \"type\": \"string\"\n          },\n          \"bar\": \"$ref:$.components.schemas.dummySchema\"\n        },\n        \"x-parser-schema-id\": \"parsedDoc\",\n        \"x-parser-circular-props\": [\n          \"bar\"\n        ]\n      }\n    }\n  },\n  \"x-parser-spec-stringified\": true\n}`;
      const expectedParsed = {
        asyncapi: "2.0.0",
        components: {
          schemas: {
            dummySchema: {
              type: "object",
              properties: {
                foo: {
                  type: "string",
                },
                bar: "$ref:$.components.schemas.dummySchema",
              },
              "x-parser-schema-id": "parsedDoc",
              "x-parser-circular-props": [
                "bar",
              ],
            },
          },
        },
        "x-parser-spec-stringified": true,
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

    it('should allow override of react component config', async () => {
      const params = { config: '{"show":{"sidebar":false}}' };
      const expected = '{"show":{"sidebar":false},"sidebar":{"showOperations":"byDefault"}}';

      const result = stringifyConfiguration(params);
      expect(result).toEqual(expected);
    });

    it('should allow override of nested react component config', async () => {
      const params = { config: '{"show":{"operations":false}}' };
      const expected = '{"show":{"sidebar":true,"operations":false},"sidebar":{"showOperations":"byDefault"}}';

      const result = stringifyConfiguration(params);
      expect(result).toEqual(expected);
    });
  });
});
