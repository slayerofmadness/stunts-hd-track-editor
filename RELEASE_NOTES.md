# Stunts HD Track Editor v1.4.3

Improves rotation controls, palette layout, and bridge/ramp recognition.

- **Right-click rotates** the selected piece on the map. `R` and the rotate button work too. **Shift + right-click erases** complete pieces.
- Rotation follows the next available orientation of the same type and surface. Symmetric pieces cycle through their stored orientations, and pieces with no other orientation stay unchanged. Overpasses can no longer turn into bridge sections.
- Names, IDs and hints stay inside palette cards, including tight dirt corners and long translated names. Cards grow to fit their contents.
- Open bridge ramps and solid bridge ramps have clear **side-profile palette illustrations** with arrows indicating the raised-end direction on the map. The bridge has the original high blue frame and straight braces. The map retains its fixed top-down view.
- **Asphalt road on slope (IDs 182–185)** now uses the original normal-road symbol, with a clearer explanation. These original identifiers remain supported for existing TRK files; they do not automatically create sloping terrain.
- Controls, help, labels and hints are updated in German, English, Spanish, Italian and French.

## Downloads

- `stunts-hd-track-editor-v1.4.3-web.zip`: standalone webpage, documentation, example track, and license.
- `stunts-hd-track-editor-v1.4.3-source.zip`: source, built webpage, documentation, tests, and build scripts.
- `SHA256SUMS.txt`: checksums for both ZIP files.

Debian/Nginx behind Pangolin: follow [UPDATE.de.md](https://github.com/slayerofmadness/stunts-hd-track-editor/blob/v1.4.3/UPDATE.de.md), also included in both ZIPs. It includes a backup and rollback instructions. Keep the current domain to retain browser-local drafts.

## Validation

All 18 core and localization tests pass, including orientation cycles and bridge-type preservation. Browser checks verify right-click rotation without edits, rectangular cursor resizing, placement, Shift + right-click erasure from a continuation cell, undo, single-orientation pieces, slope-road symbols, and all palette-card bounds in five languages at default, 800-pixel and 390-pixel widths.

GPL-3.0-only. No original game executable, extracted bitmap artwork or 3D model is bundled.
