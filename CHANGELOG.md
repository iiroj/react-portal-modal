# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="4.2.1"></a>
## [4.2.1](https://gitlab.com/iiroj/styled-modal/compare/v4.2.0...v4.2.1) (2018-08-27)



<a name="4.2.0"></a>
# [4.2.0](https://gitlab.com/iiroj/styled-modal/compare/v4.1.0...v4.2.0) (2018-08-27)


### Bug Fixes

* Remove unused typings ([075a366](https://gitlab.com/iiroj/styled-modal/commit/075a366))


### Features

* Use Jest instead of Mocha to collect coverage ([5459fd0](https://gitlab.com/iiroj/styled-modal/commit/5459fd0))
* Use ts-loader and fork-ts-checker-webpack-plugin ([828aabb](https://gitlab.com/iiroj/styled-modal/commit/828aabb))



<a name="4.1.0"></a>
# [4.1.0](https://gitlab.com/iiroj/styled-modal/compare/v4.0.1...v4.1.0) (2018-08-16)


### Features

* Use standard-version ([9fd3263](https://gitlab.com/iiroj/styled-modal/commit/9fd3263))



----

# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [4.0.1] - 2018-08-09
### Changed
- Update packages
- Update readme

## [4.0.0] - 2018-07-26
### Added
- Added async lifecycle methods `beforeOpen`, `afterOpen`, `beforeClose` and `afterClose`, which run around the changing of `open: boolean`. They are awaited so the modal will only open after `beforeOpen` resolves, and close after `beforeClose` resolves. Similarly, the `beforeOpen` cannot fire before `afterClose` is resolved, or `beforeClose` before `afterOpen`.
### Fixed
- Fix incorrect usage of `onKeyUp` on a non-input element and thus `closeOnEsc` not working

## [3.1.2] - 2018-07-23
### Fixed
- Fix initializing `open: false` from prop

## [3.1.1] - 2018-07-23
### Fixed
- Use `getSnapshotBeforeUpdate` for setting `isToggled` to make sure it applies before rendering

## [3.1.0] - 2018-07-23
### Added
- Add `isToggled: boolean` prop passed to all custom modal components. By default `false`, this will change to `true` once the modal has been toggled client-side. Useful for enabling animations (so that initial SSR animation are not applied).

## [3.0.0] - 2018-07-19
### Added
- Add initial tests, with Mocha, Chai and Enzyme, transpiled with Babel
- Add `isClientSide: boolean` prop passed to all custom modal components. See Readme for usage
### Changed
- the `hasDom` helper is ran only once, and its behaviour has changed slightly. Now it checks for `window` and `window.document` not being undefined
  - This helper is now also exported
- *BREAKING CHANGE*: The `<Portal />` component's `target?: string = 'modal'` prop is now a string instead of a dom node
- The above `target?: string = 'modal'` props has been added to the default import `<StyledModal />`, and is passed through to the `<Portal />`
- When using a custom `target?: string` (the "root" where modals are portaled to), the `flushPortals` function can be supplied the the same `target?: string = 'modal'` as an argument

## [2.9.0] - 2018-07-3
### Changed
- Use React synthetic events for closing the Modal. This fixes bugs related to the clicked DOM node disappearing from inside the Modal, and thus the Modal closing.
- Fix bug with scroll-locking by always importing dependencies

## [2.8.1] - 2018-07-2
### Changed
- Update packages

## [2.8.0] - 2018-06-24
### Changed
- Escape key detection uses `KeyboardEvent.key` and `KeyboardEvent.code` instead of `KeyboardEvent.keyCode`
- Rename `@types` to `types``
- Update packages

## [2.7.2] - 2018-06-07
### Fixed
- Fix typo in license

## [2.7.1] - 2018-06-06
### Changed
- Update to repository

## [2.7.0] - 2018-06-01
### Changed
- Update packages
- Use `React.createRef`

## [2.6.2] - 2018-05-14
### Changed
- Update packages
- Migrate `.babelrc` to `babel.config.js`

## [2.6.1] - 2018-04-30
### Fixed
- Update `package-lock.json`

## [2.6.0] - 2018-04-30
### Changed
- Allow supplying custom `Overscroll` component via prop.

## [2.5.2] - 2018-04-26
### Fixed
- Bumb version because of (possibly) failed publish

## [2.5.1] - 2018-04-26
### Fixed
- Specify `types` in package.json

## [2.5.0] - 2018-04-23
### Changed
- Import `dom-focus-lock` and `no-scroll` dynamically only if enabled

## [2.4.0] - 2018-04-23
### Added
- Added the props `lockFocusWhenOpen` and `lockScrollWhenOpen`
### Removed
- Remove extraneous `babel` packages that were unneeded for development (since the package is built with TSC)
### Changed
- Updated rest of the packages

## [2.3.7] - 2018-04-19
### Fixed
- Modules are "commonJs" instead of "amd"

## [2.3.6] - 2018-04-19
### Fixed
- Fix importing of React and other stuff for TypeScript Compiler

## [2.3.5] - 2018-04-19
### Fixed
- Fix importing of React and other stuff for TypeScript Compiler

## [2.3.4] - 2018-04-19
### Fixed
- Fix importing of React and other stuff for TypeScript Compiler

## [2.3.3] - 2018-04-19
### Changed
- The production package is now built with the TypeScript Compiler

## [2.3.2] - 2018-04-17
### Changed
- Use npm instead of Yarn in Travis

## [2.3.1] - 2018-04-17
### Changed
- Update packages
- Use npm instead of Yarn

## [2.3.0] – 2018-04-07
### Changed
- Rename `backdropComponent` to `containerComponent`
- Styles are now passed as a styled-components theme to `modalComponent` and `containerComponent`
- The Container component now receives the `open` prop and should return either JSX with `children` (the modal) or `null` (when modal is closed). This allows for better customization like animating the closing of the modal. See Readme for example for a custom component.
### Removed
- Removed tests, as they didn't really do anything meaningful; Storybook working is good enough of a test

## [2.2.0] - 2018-04-05
### Added
- Add a secondary `_ref` prop for the optional `modalComponent`, so that you can pass references to more complex components. This is because `styled-components` eats the `innerRef` prop and doesn't pass it to its children.

## [2.1.2] - 2018-04-04
### Fixed
- `has-dom` workaround for tslint complaining

## [2.1.1] - 2018-04-04
### Fixed
- `has-dom` util correctly checks for `window`
- `<Modal />` runs opening side-effects on componentDidMount, if necessary
### Changed
- Update Storybook's webpack config to new standard: https://storybook.js.org/configurations/custom-webpack-config/#full-control-mode--default

## [2.1.0] - 2018-04-03
### Changed
- Modal no longer has a state, and instead relies only on `open`, `handleOpen`, and `handleClose` props
- Update packages

## [2.0.1] - 2018-03-30
### Added
- Include sources in the package for Typescript definitions
### Changed
- Update readme

## [2.0.0] - 2018-03-30
### Changed
- Rewrite in Babel 7 / Typescript
- Update for React 16.3.0
- `<Portal />` can be render to whatever dom element by supplying it in the `target` prop

## [1.1.0] - 2018-03-10
### Added
- Pass all other props supplied to `<Modal />` to the container component. This allow you to set `aria-labelledby` and `aria-describedby`, for example
- When supplying an `appId` prop, that element is set to `aria-hidden="true"` when Modal is open
### Changed
- `modalComponent` and `backdropComponent` are set in `render()` so they can change dynamically
### Fixed
- Side effects for opening the Modal are now run on `componentWillMount()`, if Modal should be open when mounted.

## [1.0.3] - 2018-03-10
### Changed
- Target current node version
### Fixed
- Fix setting `this.container`

## [1.0.2] - 2018-03-10
### Fixed
- Fix running callback functions
- Fix running tests by changing from `react-focus-lock`to `dom-focus-lock`

## [1.0.1] - 2018-03-08
### Changed
- Pass fallback/defalt components through defaultProps

## [1.0.0] - 2018-03-08
### Added
- Modal locks focusing on elements inside itself when open
- Scrolling of Window is disabled when modal is open
- Modal has the `aria-role="dialog"` attribute
### Changed
- Instead of css, supply complete styled components for `backdropComponent`and `modalComponent`.
- Codebase structure is slightly changed, with stories in a separate folder.
### Fixed
- Fixed the logic of portaling into the specified element instead of duplicating it.

## [0.1.4] - 2018-03-06
### Changed
- Update readme.

## [0.1.3] - 2018-03-06
### Changed
- Update readme.

## [0.1.2] - 2018-03-06
### Changed
- Do not include src to published package.

## [0.1.1] - 2018-03-06
### Changed
- Change package name to `styled-modal` because it was available.

## [0.1.0] - 2018-03-06
### Added
- Initial Release
