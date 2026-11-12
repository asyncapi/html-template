import { render } from '@asyncapi/generator-react-sdk';
import { Parser, fromFile } from '@asyncapi/parser';
import {App, Index} from '../../components/index';
import path from 'path';
const asyncapi_v3_path = path.resolve(__dirname, '../spec/asyncapi_v3.yml');
const asyncapi_v2_path = path.resolve(__dirname, '../spec/asyncapi_v2.yml');
const parser = new Parser();

describe('Index component', () => {
  it('should render AsyncAPI v3 document', async () => {
    const { document } = await fromFile(parser, asyncapi_v3_path).parse();
    expect(document).not.toBeUndefined();
    const result = render(<Index asyncapi={document} params={{}}/>);
    const actual = result.trim();
    expect(actual).toMatchSnapshot();
  });

  it('should render AsyncAPI v2 document', async () => {
    const { document } = await fromFile(parser, asyncapi_v2_path).parse();
    expect(document).not.toBeUndefined();
    const result = render(<Index asyncapi={document} params={{}} />);
    const actual = result.trim();
    expect(actual).toMatchSnapshot();
  });
});

describe('App component', () => {
  it('should render AsyncAPI v3 document', async () => {
    const { document } = await fromFile(parser, asyncapi_v3_path).parse();
    expect(document).not.toBeUndefined();
    const result = render(<App asyncapi={document} params={{}}/>);
    const actual = result.trim();
    expect(actual).toMatchSnapshot();
  });

  it('should render AsyncAPI v2 document', async () => {
    const { document } = await fromFile(parser, asyncapi_v2_path).parse();
    expect(document).not.toBeUndefined();
    const result = render(<App asyncapi={document} params={{}} />);
    const actual = result.trim();
    expect(actual).toMatchSnapshot();
  });

  it('should register the WebSocket plugin when wsPlugin is set', async () => {
    const { document } = await fromFile(parser, asyncapi_v3_path).parse();
    const result = render(<App asyncapi={document} params={{ wsPlugin: 'true' }} />);
    expect(result).toContain('const plugins = [AsyncApiStandalone.createWsPlugin({})];');
    expect(result).toContain('{ schema, config, plugins, }');
  });

  it('should not register plugins by default', async () => {
    const { document } = await fromFile(parser, asyncapi_v3_path).parse();
    const result = render(<App asyncapi={document} params={{}} />);
    expect(result).not.toContain('plugins');
  });
});
