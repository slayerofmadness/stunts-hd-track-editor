# Stunts HD Track Editor v1.4.4

Preloads the original Stunts DEFAULT track, as in the game.

- On first use, load the unchanged **DEFAULT.TRK**, including its track pieces, terrain, horizon and metadata. The document name starts as DEFAULT.
- **Saved browser drafts still take priority** on startup, so updating the editor keeps your work available.
- The new **DEFAULT** button reloads the original track as one undoable edit. Undo restores the previous track and name.
- The **Example** button still loads the editor-created DEMO.
- DEFAULT data is embedded in the offline webpage, so loading it needs no server request or Internet connection. The web ZIP also includes DEFAULT.TRK.
- Load messages and button labels are localized in all five languages.

## Downloads

- `stunts-hd-track-editor-v1.4.4-web.zip`: standalone webpage, DEFAULT.TRK, DEMO.TRK, documentation, and license/notices.
- `stunts-hd-track-editor-v1.4.4-source.zip`: source, built webpage, documentation, tests, and build scripts.
- `SHA256SUMS.txt`: checksums for both ZIP files.

For Debian/Nginx behind Pangolin, follow [UPDATE.de.md](https://github.com/slayerofmadness/stunts-hd-track-editor/blob/v1.4.4/UPDATE.de.md), also included in both ZIPs. Existing browser drafts remain available under the same domain. To view DEFAULT immediately after updating, use the DEFAULT button.

## Validation

All 19 core and localization tests pass. The embedded original track retains all 1,802 bytes and matches SHA-256 `4111e30379c39020d10f30eef15b7e46aca87a7716e499cde2e89c7c545388fd`. Browser checks verify a first visit with DEFAULT, restoration of an edited draft after reload, exact DEFAULT reload, and undo restoring the prior draft and name.

Editor code: GPL-3.0-only. DEFAULT is original game track data; see THIRD_PARTY_NOTICES.md for provenance. No original game executable, bitmap artwork or 3D model is bundled.
