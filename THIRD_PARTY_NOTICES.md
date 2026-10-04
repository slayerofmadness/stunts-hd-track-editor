# Third-party notices

This standalone editor continues the HD editor developed in this workspace for PlayStunts. Its track byte layout, tile identifiers, rotation facts and footprints are derived from the PlayStunts format tables and editor implementation:

- PlayStunts: https://github.com/ACatWithEbola/playstunts
- License: GNU General Public License version 3 only (GPL-3.0-only).
- The upstream GPL license is included as `LICENSE`.

This release is distributed under GPL-3.0-only. New interface code, map diagrams and the example track were authored for this standalone editor.

Stunts / 4D Sports Driving is the name of the original game. No original game executables, game artwork, extracted 3D models, cars, sound files or original tracks are distributed in this repository or release. The map uses independently authored simplified vector diagrams; tile names and identifiers describe file-format compatibility.

The five original editor terrain layouts (900 terrain identifiers each) are taken from `public/game/editor-terrain-presets.json` in the workspace's PlayStunts source. Only their terrain grids are included, excluding the resource footer and any track tiles. The 19 terrain types follow PlayStunts terrain identifiers. Terrain symbols are independently drawn SVG diagrams using the original editor's green/water colours and checker shading; no extracted original bitmap assets are included.

The header wordmark and brush-S favicon are independently drawn SVG outlines inspired by the pale-yellow brush lettering on the original Stunts DOS cover (reference: https://upload.wikimedia.org/wikipedia/en/7/7c/Stunts-dos-cover.jpg). The cover image itself is not bundled. Stunts remains the original game's name; the HD / TRACK EDITOR caption identifies this standalone editor.
