# react-portal-modal

A Modal built with styled-components and Portals with Server-Side Rendering Support.

## About

This component is used for rendering React components inside a Modal. The component uses the native `ReactDOM.createPortal` introduced with React 16.2.0. Support for Server-Side Rendering is achieved with support for statically rendering Portals and flushing them client-side.

## `<Modal />`

The main entrypoint of this package is the `<Modal />` component. It's a stateful component with support for closing on outside click and ESC keypress. You can supply the open-state with a prop, as well as callback functions for opening and closing. There's an option for showing a built-in close button. You can also render it conditionally without any props, as it's open by default. You can further specify the id for portaling.

Finally, you can customize the UI by supplying your own styles as CSS in a template literal. You should probably use the `css` helper from `styled-components`. The `<Container />` and `<Overlay />` are extended with these styles.

```javascript
import { render } from 'react-dom';
import Modal from 'react-portal-modal';
import type { ComponentType } from 'react';
import type { RuleSet } from 'styled-components';

type Props = {
  children?: ComponentType<any>,
  closeOnEsc: boolean,
  closeOnOutsideClick: boolean,
  styles: {
    overlay?: string | RuleSet,
    container?: string | RuleSet,
  },
  onClose?: any => any,
  onOpen?: any => any,
  open: boolean,
  showClose: boolean,
  targetId?: string,
};

type DefaultProps = {
  closeOnEsc: false,
  closeOnOutsideClick: false,
  open: true,
  showClose: false,
};

render(
  <Modal>
    <p>This text will open in a modal</p>
  </Modal>,
  document.getElementById('root'),
);
```

## `<Portal />`

This component handles the actual portaling and is used as the top-most wrapper component in `<Modal />`. You can also use `<Portal />` directly to render things into some other DOM Element by supplying its id.

```javascript
import { Portal } from 'react-portal-modal';

render(
  <Portal targetId="Helsinki">
    <p>This text will be portaled to #Helsinki</p>
  </Portal>,
  document.getElementById('root'),
);
```

## Server-Side Rendering

On the server side we cannot use `ReactDOM.createPortal`. This is why the underlying `<Portal />` component returns `null` and instead collects the portals' contents into a global array with `collectPortals`. We can then render this array seperately ourselves! To prevent rendering double client-side, we must also flush the portal target element before (client-side) rendering with `flushPortals`.

>server
```javascript
import Express from 'express';
import { renderToStaticMarkup } from 'react-dom/server';
import { ServerStyleSheet } from 'styled-components';
import Modal, { collectPortals } from 'react-portal-modal';
import App from 'components/App';

...

const renderResponse = async (req, res) => {
  const initialState = await getInitialState(req);

  const sheet = new ServerStyleSheet();

  const appHtml = renderToStaticMarkup(
    sheet.collectStyles(
      <App>
        <Modal>
          <p>This text will be portaled to #portal</p>
        </Modal>
      </App>
    )
  );

  const portalHtml = renderToStaticMarkup(
    collectPortals()
  );

  const styles = sheet.getStyleTags();

  const response = renderHtmlResponse(initialState, appHtml, portalHtml, styles);

  res.send(response);
};

app.use(renderResponse);
```

>client
```javascript
import { render } from 'react-dom'
import Modal, { flushPortals } from 'react-portal-modal';
import App from 'components/App';

flushPortals();

render(
  <App>
    <Modal>
      <p>This text will be portaled to #portal</p>
    </Modal>
  </App>,
  document.getElementById('root');
);
```