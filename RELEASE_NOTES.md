# Stunts HD Track Editor v1.4.2

Fixes the placement cursor and selection footprint.

- The yellow cursor now displays the selected piece instead of an empty tile. The selection no longer covers the track graphics.
- The frame and selected grid cells match the complete footprint: 2 × 2 for large curves, 1 × 2 or 2 × 1 for rectangular stunts, and 1 × 1 for regular pieces and terrain.
- Rotation and palette changes update the preview immediately. Mouse hover and arrow keys move the preview without changing track data or undo history.
- Picking a piece from a continuation cell selects its complete footprint at the original anchor.
- Out-of-bounds placements show a red frame and remain rejected without changing the track. Panning hides the placement preview.

## Downloads

- `stunts-hd-track-editor-v1.4.2-web.zip`: offline webpage, documentation, example track, and license.
- `stunts-hd-track-editor-v1.4.2-source.zip`: source, built webpage, documentation, tests, and build scripts.
- `SHA256SUMS.txt`: checksums for both ZIP files.

For an existing Debian/Nginx installation behind Pangolin, follow [UPDATE.de.md](https://github.com/slayerofmadness/stunts-hd-track-editor/blob/v1.4.2/UPDATE.de.md). The same instructions are included in both ZIP packages. Keep the current domain to retain browser-local drafts.

## Validation

All 17 existing core and localization tests pass. Browser checks cover visible previews, 1 × 1 and 2 × 2 selections, rotation between 1 × 2 and 2 × 1, mouse hover without edits, keyboard placement, invalid edges, terrain, panning, eyedropper selection, and undo.

GPL-3.0-only. No original game executable or extracted game artwork is included.
