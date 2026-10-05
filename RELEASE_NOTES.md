# Stunts HD Track Editor v1.5.0

Adds **Game view**: a live preview using the original Stunts track-selection graphics.

- Toggle **Game view / Spielansicht** to see your track with original 3D pieces, hills, ramps, bridges, VGA colours and all five landscape panoramas.
- Painting, erasing, undo/redo, terrain changes, imports and loading drafts update the image automatically. Unplaced cursor previews stay on the editable map.
- The fixed original track-selection camera stays beside the top-down editor. On narrow screens the game preview appears below the map. Pixels scale sharply with original 4:3 display proportions.
- All resources are embedded in the standalone page. No server, Internet connection or external game installation is needed for the preview. Use a current browser with DecompressionStream support.
- Unknown or invalid imported fields are simplified only in the preview; the original TRK data remains available for export.
- Controls, help and messages are available in German, English, Spanish, Italian and French. Existing drafts and DEFAULT startup behaviour are retained.

## Downloads

- `stunts-hd-track-editor-v1.5.0-web.zip`: standalone offline webpage, DEFAULT.TRK, DEMO.TRK, documentation and license/notices.
- `stunts-hd-track-editor-v1.5.0-source.zip`: editor source, complete preferred native renderer source, preview resources, built webpage, tests and build scripts.
- `SHA256SUMS.txt`: checksums for both ZIP files.

For Debian/Nginx behind Pangolin, follow [UPDATE.de.md](https://github.com/slayerofmadness/stunts-hd-track-editor/blob/v1.5.0/UPDATE.de.md), also included in both ZIPs. Keep the existing domain to retain browser drafts, then reload and enable Game view.

## Validation

All 24 core, localization and overview tests pass. These verify native DEFAULT pixel output, all supported pieces and terrain types, five different panoramas, independent render frames, live data changes and protection of imported TRK bytes. Desktop and narrow mobile browser checks verify painting, undo, scenery changes, translated controls and preview visibility.

Editor and PlayStunts renderer code: GPL-3.0-only. The preview includes original Stunts graphical resources, whose original ownership is retained. It includes no original DOS executable or audio. See THIRD_PARTY_NOTICES.md for provenance.
