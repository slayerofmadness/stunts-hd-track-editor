# Stunts HD Track Editor v1.4.1

A standalone browser-based track editor for Stunts / 4D Sports Driving. Download the **web ZIP**, extract it, and open `index.html` to start editing. No installation or account is required.

## Included

- Familiar top-down vector track pieces, all 183 supported piece identifiers, and corrected bridge and solid ramp symbols.
- A zoomable 30 × 30 map, multi-cell pieces, rotation, search, undo/redo, local draft recovery, and manual saves.
- All 19 terrain types and five original terrain presets, with previews and separate options to preserve or clear the current track.
- German, English, Spanish, Italian, and French, with automatic browser-language detection and a remembered manual choice.
- Import and export of 1,802-byte `.TRK` files, preserving unknown identifiers, the horizon, and trailing metadata on an unchanged round trip.
- A new pale-yellow brush wordmark and matching favicon, independently drawn in the lettering style of the original Stunts cover.
- English and German documentation, GPL license, example track, and source/build scripts.

All interface assets are bundled locally. Imported tracks are not uploaded, and the installed game is not modified.

## Downloads

- `stunts-hd-track-editor-v1.4.1-web.zip`: offline webpage, example track, documentation, and license.
- `stunts-hd-track-editor-v1.4.1-source.zip`: source, built webpage, documentation, tests, and build scripts.
- `SHA256SUMS.txt`: checksums for both ZIP files.

## Validation and limitations

All 17 tests pass, covering byte-preserving import/export, piece placement and erasure, terrain presets, metadata preservation, browser-language detection, and translation coverage.

The structure checker does not validate the complete driving route or physical drivability. Test finished tracks in the game. Browser-local saves may be limited when opening the offline webpage with `file://`; track import/export remain available.

GPL-3.0-only. No original game executable or extracted game artwork is included. See `THIRD_PARTY_NOTICES.md` for format and terrain credits.
