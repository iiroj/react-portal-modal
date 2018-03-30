# styled-modal

[![npm](https://img.shields.io/npm/v/styled-modal.svg)](https://www.npmjs.com/package/styled-modal)
[![Build Status](https://travis-ci.org/iiroj/styled-modal.svg?branch=master)](https://travis-ci.org/iiroj/styled-modal)
[![GitHub issues](https://img.shields.io/github/issues-raw/iiroj/styled-modal.svg)](https://github.com/iiroj/styled-modal/issues)
[![GitHub pull requests](https://img.shields.io/github/issues-pr-raw/iiroj/styled-modal.svg)](https://github.com/iiroj/styled-modal/pulls)

A Modal built with styled-components and Portals with Server-Side Rendering Support.

Inspired by [Render React portals on the server - Michal Zalecki](https://michalzalecki.com/render-react-portals-on-the-server/).

## About

This component is used for rendering React components inside a Modal. There are some basic styles included but you should supply your own styles. The component uses the native `ReactDOM.createPortal` introduced with React 16.2.0.

Yarn:
```bash
yarn add styled-modal
```

npm:
```bash
npm install styled-modal
```

Please see the included Storybook for examples:

```bash
git@github.com:iiroj/styled-modal.git
cd styled-modal
yarn
yarn start
open http://127.0.0.1:8080/
```

## `<Modal />`

The main entrypoint of this package is the `<Modal />` component. It's a stateful component with support for closing on outside click and ESC keypress. You can supply the open-state with a prop, as well as callback functions for opening and closing. There's an option for showing a built-in close button. You can also render it conditionally without any props, as it's open by default. You can further specify the id for portaling.

Finally, you can customize the UI by supplying your own styled components for the Backdrop and Modal container via the `backdropComponent` and `modalComponent` props. Some css properties will be added to make sure the Modal still functions properly.

### Basic Props

```javascript
import { render } from 'react-dom';
import Modal from 'styled-modal';

type Props = {
  backdropComponent?: any,
  children?: any,
  closeOnEsc: boolean,
  closeOnOutsideClick: boolean,
  modalComponent?: any,
  onClose?: any => any,
  onOpen?: any => any,
  open: boolean,
  targetId?: string,
};

type DefaultProps = {
  backdropComponent: FallbackBackdrop,
  closeOnEsc: false,
  closeOnOutsideClick: false,
  modalComponent: FallbackContainer,
  open: true,
};

render(
  <Modal>
    <p>This text will open in a modal</p>
  </Modal>,
  document.getElementById('root'),
);
```

### Conditional Rendering

```javascript
import Modal from 'styled-modal';

...

export default props => {
  const { showModal, handleOpen } = props;

  return (
   <div>
    <button onClick={handleOpen}>Show Modal!</button>
    {showModal && (
      <Modal>
        <p>This text will open in a modal</p>
      </Modal>
    )}
  )
}
```

### Rendering Based on State

```javascript
import Modal from 'styled-modal';

...

export default props => {
  const { showModal, handleOpen, handleClose } = props;

  return (
   <div>
    <button onClick={handleOpen}>Show Modal!</button>
    <Modal open={showModal} onOpen={handleOpen} onClose={handleClose}>
      <p>This text will open in a modal</p>
    </Modal>
  )
}
```

## `<Portal />`

This component handles the actual portaling and is used as the top-most wrapper component in `<Modal />`. You can also use `<Portal />` directly to render things into some other DOM Element.

```javascript
import { Portal } from 'styled-modal';

const target = document.getElementById("Helsinki");

render(
  <Portal target={target}>
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
import Modal, { collectPortals } from 'styled-modal';
import App from 'components/App';

...

const renderResponse = async (req, res) => {
  const initialState = await getInitialState(req);

  const sheet = new ServerStyleSheet();

  const appHtml = renderToStaticMarkup(
    sheet.collectStyles(
      <App>
        <Modal>
          <p>This text will be portaled to #modal</p>
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
import Modal, { flushPortals } from 'styled-modal';
import App from 'components/App';

flushPortals();

render(
  <App>
    <Modal>
      <p>This text will be portaled to #modal</p>
    </Modal>
  </App>,
  document.getElementById('root');
);
```