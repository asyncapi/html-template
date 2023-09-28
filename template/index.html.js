import { File } from '@asyncapi/generator-react-sdk';
import { Index } from '../components/index';
import { AsyncAPIDocumentInterface } from '@asyncapi/parser';

/**
 * 
 * @param {object} param0 
 * @param {AsyncAPIDocumentInterface} param0.asyncapi 
 * @returns 
 */
export default function({ asyncapi, params = {} }) {
  return (
    <File name={params.outFilename || 'index.html'}>
        <Index params={params} asyncapi={asyncapi} />
    </File>
  );
}
