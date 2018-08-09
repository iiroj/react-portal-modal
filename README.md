<div align="center">
  <h1 align="center">styled-modal</h1>
  <p>A Modal built with styled-components and Portals with Server-Side Rendering Support</p>
  <a href="https://www.npmjs.com/package/styled-modal"><strong>npm</strong></a> ·
  <a href="https://gitlab.com/iiroj/styled-modal"><strong>GitLab</strong></a>
  <br/>
  <br/>
  <a href="https://www.npmjs.com/package/styled-modal">
    <img src="https://img.shields.io/npm/v/styled-modal.svg?style=flat-square">
  </a>
  <a href="https://gitlab.com/iiroj/styled-modal">
    <img src="https://img.shields.io/github/languages/code-size/iiroj/styled-modal.svg?style=flat-square">
  </a>
  <a href="https://gitlab.com/iiroj/styled-modal/pipelines/">
    <img src="https://img.shields.io/badge/GitLab-Pipeline-lightgrey.svg?style=flat-square">
  </a>
  <a href="https://gitlab.com/iiroj/styled-modal/blob/master/package.json">
    <img src="https://img.shields.io/david/iiroj/styled-modal.svg?style=flat-square">
  </a>
  <a href="https://gitlab.com/iiroj/styled-modal/blob/master/package.json">
    <img src="https://img.shields.io/david/dev/iiroj/styled-modal.svg?style=flat-square">
  </a>
  <br/>
  <br/>
</div>

Inspired by [Render React portals on the server - Michal Zalecki](https://michalzalecki.com/render-react-portals-on-the-server/).

## Props

Below is a cheatcheet of all available props. All of them are optional.

| Prop                | Type                         | description |
| :------------------ | :--------------------------- | :---------- |
| afterClose          | `() => Promise<void> | void` | Async function ran after closing |
| afterOpen           | `() => Promise<void> | void` | Async function ran after opening |
| appId               | `string`                     | Id of the main react root dom node. Will set as `aria-hidden=true` |
| beforeClose         | `() => Promise<void> | void` | Async function ran before closing |
| beforeOpen          | `() => Promise<void> | void` | Async function ran before opening |
| children            | `any`                        | Contents of the modal |
| closeOnEsc          | `boolean`                    | Whether the modal should close (call `onClose`) when pressing Esc |
| closeOnOutsideClick | `boolean`                    | Whether the modal should close (call `onClose`) when clicking outside the modal |
| containerComponent  | `any`                        | A custom component for the container. By default the dark background. Its child is the `overscrollComponent` |
| lockFocusWhenOpen   | `boolean`                    | Whether focus should be locked inside the modal, via [dom-focus-lock](https://github.com/theKashey/dom-focus-lock) |
| lockScrollWhenOpen  | `boolean`                    | Whether scrolling should be locked when the modal is open, via [no-scroll](https://github.com/davidtheclark/no-scroll) |
| modalComponent      | `any`                        | A custom component for the modal. By default a simple div. Its children are the `<StyledModal>`'s children |
| onClose             | `() => Promise<void> | void` | Async function ran when closing. Typically for setting the prop `open: false` |
| onOpen              | `() => Promise<void> | void` | Async function ran after opening. Typically for setting the prop `open: true` |
| open                | `boolean`                    | Whether the modal is open. Defaults to `true` |
| overscrollComponent | `any`                        | A custom component for the overscoll. By default this allows the Modal to nicely scroll. Its child is the `modalComponent` |
| target              | `string`                     | The id of the Portal's target dom node. By default `modal`. The node will be added to the end of `document.body` if not present |

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

### Lifecycle Methods

`<Modal />`supports async lifecycle methods `beforeOpen`, `afterOpen`, `beforeClose` and `afterClose` (`() => Promise<void> | void`), which run around the changing of `open: boolean` (the Modal opening). They are awaited so the modal will only open after `beforeOpen` resolves, and close after `beforeClose` resolves. Similarly, the `beforeOpen` cannot fire before `afterClose` is resolved, or `beforeClose` before `afterOpen`.

The other methods are `onOpen: () => Promise<void> | void`, which is run between `beforeOpen` and `afterOpen`, and `onClose: () => Promise<void> | void`, similarly.

The `onClose` method is fired when clicking outside the modal or pressing the `Esc` key, if `closeOnOutsideClick?: boolean = true` or `closeOnEsc?: boolean = true` are enabled, respectively.

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