import { File } from '@asyncapi/generator-react-sdk';
import { Index } from '../components';

export default function({ asyncapi, params = {} }) {
  return (
    <File name={params.outFilename || 'index.html'}>
        <Index params={params} asyncapi={asyncapi} />
    </File>
  );
}
