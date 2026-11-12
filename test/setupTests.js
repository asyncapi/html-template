import 'regenerator-runtime/runtime';
import { TextDecoder, TextEncoder } from 'util';

// The jsdom environment of jest 26 does not have these globals, but the React component uses them.
if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = TextDecoder;
}
if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder;
}
