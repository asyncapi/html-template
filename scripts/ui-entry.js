/**
 * Entry of the browser bundle `template/js/asyncapi-ui.min.js`.
 *
 * It exposes the same `render`, `hydrate` and `hljs` as the standalone bundle of
 * `@asyncapi/react-component`, and adds the factories of the plugins that the
 * template can register. The component and the plugins use one React instance.
 */
import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import AsyncApiComponent, { hljs } from '@asyncapi/react-component/lib/esm/without-parser';
import { createWsPlugin } from 'asyncapi-ws-plugin';

function container(element) {
  return element ?? document.querySelector('asyncapi');
}

export function render(props, element) {
  const root = container(element);
  if (root) {
    createRoot(root).render(React.createElement(AsyncApiComponent, props));
  }
}

export function hydrate(props, element) {
  const root = container(element);
  if (root) {
    hydrateRoot(root, React.createElement(AsyncApiComponent, props));
  }
}

export { hljs, createWsPlugin };
