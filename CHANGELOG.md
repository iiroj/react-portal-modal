# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

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
