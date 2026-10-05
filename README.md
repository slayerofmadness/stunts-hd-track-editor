# Stunts HD Track Editor

A standalone track editor for **Stunts / 4D Sports Driving**, with a sharp, zoomable vector map, familiar top-down track pieces, and a live preview using the original game graphics. The editor runs locally in your browser; imported tracks and drafts are never uploaded.

[Deutsche Anleitung](README.de.md)

![Stunts HD Track Editor](docs/editor-preview.jpg)

## Use the editor

Download the `stunts-hd-track-editor-v1.5.0-web.zip` asset from this repository's **Releases** page, extract it, and open `index.html`. No installation, account, or external dependencies are needed. Alternatively, open `dist/index.html` from this repository.

Draft recovery may be limited when using `file://`, depending on your browser. Track import and export remain available. To use a local web server, see the development instructions below.

## Features

- **Game view**: toggle a live original track-selection preview beside the map. Original 3D pieces, elevations, VGA palette, and all five landscape backgrounds update when you paint, erase, undo, change terrain, or import a track. The native 320 × 200 raster is scaled with sharp pixels and the original 4:3 display proportions. On smaller screens it appears below the map.

- German, English, Spanish, Italian, and French. The initial language follows your browser preferences, with English as the fallback. A manual selection is remembered.
- A 30 × 30 track grid, with all 183 supported track-piece identifiers and independently drawn vector symbols inspired by the original editor.
- Import and export 1,802-byte `.TRK` files. Unknown identifiers, the horizon, and the final metadata byte survive an unchanged round trip.
- The original DEFAULT track is preloaded on first use, including its terrain and horizon. Saved drafts take priority. The DEFAULT button reloads the original as an undoable edit; the Example button keeps the editor-created DEMO available.
- Multi-cell pieces, rotation, categories, search, and whole-piece replacement or erasure.
- Side-profile palette illustrations distinguish open bridge ramps, solid bridge ramps, and the original blue-framed bridge; map graphics stay top-down. Direction arrows indicate the raised end on the map.
- Palette names, IDs and hints wrap inside their cards in all five languages.
- A live placement preview with a frame covering the complete selected piece, including rotated multi-cell pieces.
- All 19 terrain types, with five original terrain presets and previews. Apply terrain to an existing track, or start a new track on that terrain.
- Undo and redo for up to 100 changes, automatic local draft recovery, and ten manual saves per browser origin.
- Zoom, fit-to-view, panning, desktop and mobile layouts, and keyboard controls.
- Optional WebMCP browser tools for reading tracks, finding and placing pieces, applying terrain presets, and undoing changes.

The editor does not change an installed copy of the game. Export a `.TRK` file and copy it into your game separately.

## Controls

| Action | Control |
| --- | --- |
| Draw | Click or drag |
| Erase | `Shift` + right-click, or the eraser |
| Rotate the selected piece | Right-click on the map, `R`, or the rotate button |
| Pick a piece from the map | `Alt` + click |
| Move the selected grid cell | Arrow keys while the map is focused |
| Place / erase at the selected cell | Space / Delete |
| Undo / redo | `Ctrl` or `⌘` + `Z` / add Shift |

Rotation uses the next available orientation of the same piece type and surface. Symmetric pieces cycle through their stored orientations; pieces with no other orientation stay unchanged. Slope-road IDs 182–185 use the original normal asphalt-road symbol and remain available for TRK compatibility. They represent a road on sloping terrain, rather than a separate bridge ramp.

Local saves belong to the current browser and webpage address. Exported tracks can be kept independently.

## Develop

Use Node.js 22 or later. There are no packages to install.

```sh
npm test
npm run build
npm start
```

Open `http://127.0.0.1:48321/`. The `src/` directory contains the source. The `vendor/` directory includes the complete preferred renderer source and original preview resource data. The build bundles the editor into `dist/index.html`; `dist/` can be served by any static web host.

```sh
npm run release
```

This creates offline and source ZIP packages and `SHA256SUMS.txt` in `release/`. Packaging uses the `zip` command, available on macOS and most Linux distributions.

For an existing Debian/Nginx installation behind Pangolin, see the [update instructions](UPDATE.de.md).

## Limitations

The editable map uses independently drawn vector approximations. The optional Game view uses original Stunts graphics and the PlayStunts native software renderer with the fixed track-selection camera; it is a visual overview, not a driving simulation. It needs a current browser with DecompressionStream support. All preview resources are embedded for offline use. Unsupported imported fields are simplified in the preview only; original TRK bytes remain available for unchanged export. Structure checking detects missing start/finish lines, invalid boundaries, overlaps, continuation markers, and unknown identifiers. It does **not** validate the complete driving route or physical drivability. Terrain and track combinations are not automatically repaired. Test the finished track in the game.

## License and credits

**GPL-3.0-only.** See [LICENSE](LICENSE) and [third-party notices](THIRD_PARTY_NOTICES.md).

Track identifiers, rotations, footprints, and terrain layouts follow the PlayStunts format tables and editor data. The five terrain presets contain terrain identifiers only. Game view includes original scene graphics, landscape rasters and palette data from the supplied game resources. It includes no original DOS executable or audio. The GPL license covers editor/renderer code; original game resource ownership is retained. It includes the original DEFAULT track layout (1,802 bytes) from the supplied game installation. DEMO was created for this editor. See the notices for the distinction between editor code and original track data.

The vendored native renderer is already compiled. To regenerate it, install `esbuild@0.28.1` locally and run `node scripts/build-overview-renderer.mjs`. Normal builds and releases need no external packages.
