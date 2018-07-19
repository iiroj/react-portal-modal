# styled-modal

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

Finally, you can customize the UI by supplying your own styled components for the Container (backdrop) and Modal via the `containerComponent` and `modalComponent` props. Some default styles will be supplied via the styled-components theme prop.

### Basic Props

```javascript
import { render } from 'react-dom';
import Modal from 'styled-modal';

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
  const { showModal, openCallback, closeCallback } = props;

  return (
   <div>
    <button onClick={handleOpen}>Show Modal!</button>
    <Modal open={showModal} onOpen={openCallback} onClose={closeCallback}>
      <p>This text will open in a modal</p>
    </Modal>
  )
}
```

### Custom styles

It is possible to supply custom `modalComponent`, `containerComponent` and `overscrollComponent` to customize the look of the Modal. These should be [styled-components](https://github.com/styled-components/styled-components). The components will be provided default styles necessary for the Modal to function in the `theme` prop.

```javascript
import StyledModal from 'styled-modal';
import styled from 'styled-components';

const ContainerComponent = ({ children, className, open }: IProps) =>
  open ? <div className={className}>{children}</div> : null;

const Container = styled(ContainerComponent)`
  background-color: rgba(0, 0, 0, 0.4);
  ${props => props.theme.container};
`

const Overscroll = styled.div`
  ${props => props.theme.overscroll};
`

const Modal = styled.div`
  background-color: white;
  ${props => props.theme.modal};
`

...

export default () => (
  <StyledModal open={showModal} containerComponent={Container} modalComponent={Modal} overscrollComponent={Overscroll}>
    <p>This text will open in a modal</p>
  </StyledModal>
)
```

### Animations

StyledModal supports animations since you can supply custom components. These can be wrapped in whatever, like [react-motion-ui-pack](https://github.com/souporserious/react-motion-ui-pack)'s `<Transition />` as seen in the Storybook's Animated example.

There's is also a special prop `isClientSide: boolean` available to all components. You can disable your animations based on this server-side, to not mess up initial styles client-side.

#### Refs

Since we need the DOM reference to the `modalComponent` for accessibility features (focus lock and closing by clicking outside), we supply (via `React.createRef`) both a `innerRef` and `_ref`. Styled-components eats the `innerRef` and `_ref` can be used in more complex components wrapped in `styled()`.

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