# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

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
