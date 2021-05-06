import { AsyncAPIDocument } from "@asyncapi/parser";
import { 
  stringifySpec,
  stringifyConfiguration,
  renderSpec,
} from "../../filters/all";

describe('Filters', () => {
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
      const doc = new AsyncAPIDocument({ asyncapi: '2.0.0', info: { title: 'dummy spec for testing', version: '1.5.73' } });

      const result = renderSpec(doc);
      // check if '1.5.73' version is rendered
      expect(result.includes('1.5.73')).toEqual(true);
      // check if 'dummy spec for testing' title is rendered
      expect(result.includes('dummy spec')).toEqual(true);
    });
  });
});
