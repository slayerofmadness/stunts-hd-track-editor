# Stunts HD Track Editor

Version 1.8.0 adds an editor-only library of 4,287 community tracks with search, filters and map previews. Tracks enter the game only when explicitly saved or exported. Download the web and source packages from [release v1.8.0](https://github.com/slayerofmadness/stunts-hd-track-editor/releases/tag/v1.8.0).

A standalone track editor for **Stunts / 4D Sports Driving**, with a sharp, zoomable vector map, familiar top-down track pieces, and a live preview using the original game graphics. The editor runs locally in your browser; imported tracks and drafts are never uploaded.

[Deutsche Anleitung](README.de.md)

![Stunts HD Track Editor](docs/editor-preview.jpg)

## Construction tools in 1.7.0

Connections colors compatible road ports green, incompatible ports red and exposed ports blue. Local hints list multiple construction problems, while the native game check remains authoritative for a complete circuit.

Select section, drag a rectangle, then Copy, Move or Rotate and click its destination. Multi-cell pieces are included completely. Include terrain also rotates the original terrain height fields; Replace destination must be enabled to overwrite existing pieces. Escape cancels and Undo restores the whole operation.

Height profile shows a schematic cross-section with selectable direction and row/column. It represents terrain, ramps and elevated road; it is not a physical driving simulation or a complete side view of every stunt.

Export test start creates a separate TESTDRV.TRK with a start on a suitable preceding straight. The entire circuit must pass the native check. The original draft and metadata stay intact. In the macOS app, Test drive from here launches a temporary solo race and restores the draft, normal start and opponent difficulty afterward, without writing the track or best times.

## Use the editor

Download [stunts-hd-track-editor-v1.8.0-web.zip](https://github.com/slayerofmadness/stunts-hd-track-editor/releases/download/v1.8.0/stunts-hd-track-editor-v1.8.0-web.zip) and extract it. To use the track library, install Node.js 22 or later, run `node start.mjs` in the extracted folder, and open `http://127.0.0.1:48321/`. No npm packages or account are needed. Opening `index.html` directly supports the other editor tools, import and export.

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

The editable map uses independently drawn vector approximations. The optional Game view uses original Stunts graphics and the PlayStunts native software renderer with the fixed track-selection camera; it is a visual overview, not a driving simulation. It needs a current browser with DecompressionStream support. All preview resources are embedded for offline use. Unsupported imported fields are simplified in the preview only; original TRK bytes remain available for unchanged export. Version 1.6.0 checks both file structure and the complete route using the native PlayStunts terrain and route validator. Errors are marked red; click coordinates in the result to jump to the location. Native traversal reports its first error; subsequent errors appear after correction. A passing result confirms a valid circuit, not a successful physical test drive. Engine-only slope pieces 182–185 are saved as ordinary straight roads 4/5; the terrain provides their height and slope. Other bytes, including metadata, are preserved. Unfinished tracks can still be exported.

## License and credits

**GPL-3.0-only.** See [LICENSE](LICENSE) and [third-party notices](THIRD_PARTY_NOTICES.md).

Track identifiers, rotations, footprints, and terrain layouts follow the PlayStunts format tables and editor data. The five terrain presets contain terrain identifiers only. Game view includes original scene graphics, landscape rasters and palette data from the supplied game resources. It includes no original DOS executable or audio. The GPL license covers editor/renderer code; original game resource ownership is retained. It includes the original DEFAULT track layout (1,802 bytes) from the supplied game installation. DEMO was created for this editor. See the notices for the distinction between editor code and original track data.

The vendored native renderer is already compiled. To regenerate it, install `esbuild@0.28.1` locally and run `node scripts/build-overview-renderer.mjs`. Normal builds and releases need no external packages.

## Track library in 1.8.0

**Track library** provides 4,287 distinct tracks from the [Huge Stunts Track Archive](https://archive.org/details/hugestuntstrackarchive). Search original names, authors or collections, inspect the map preview and filter game-check results. 4,000 pass the editor check; 287 need repair. **Load into editor** creates an undoable draft. Import into the game requires a manual export, or explicit saving in the macOS app.

The web library requires the included `community-tracks` folder next to `index.html`, served by a local web server (`node start.mjs` in the web ZIP, or `npm start` after building the source) or a website. The macOS offline app includes it directly. Other editor features still work when opening the HTML file itself. Identical copies are grouped while source paths, original names and available Bliss title/author metadata are retained.
