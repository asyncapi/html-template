import { File } from '@asyncapi/generator-react-sdk';
import { App } from '../../components/index';
import { AsyncAPIDocumentInterface } from '@asyncapi/parser';

/**
 * 
 * @param {object} param0 
 * @param {AsyncAPIDocumentInterface} param0.asyncapi 
 * @returns 
 */
export default function({ asyncapi, params = {} }) {
  return (
    <File name='app.js'>
        <App asyncapi={asyncapi} params={params} />
    </File>
  );
}
