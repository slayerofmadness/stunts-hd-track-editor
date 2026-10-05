# Changelog

## 1.4.2

- Visible placement preview inside the yellow cursor frame; selected cells no longer cover the track graphics.
- Cursor frame and selected grid cells match the complete piece footprint, including 2 × 2 curves and rotated 1 × 2 / 2 × 1 stunts.
- Pointer hover and keyboard navigation update the preview without changing track data or undo history.
- Eyedropper selection anchors to the complete piece, including when picking a continuation cell.
- Invalid edge placements show a red frame; panning hides the placement preview.

## 1.4.1

- Independently drawn pale-yellow brush wordmark inspired by the original Stunts DOS cover.
- Forward-slanted strokes, irregular edges and tapered flourishes replace the block-letter badge.
- Matching brush-S favicon; inline SVG keeps the wordmark sharp and self-contained offline.

## 1.4.0

- German, English, Spanish, Italian and French throughout the interface, piece and terrain names, help, status messages, accessibility labels and validation errors.
- Automatic browser language detection, including regional variants; English fallback for unsupported languages.
- Persistent manual language selection with an Automatic option. Switching language keeps track data and edit history.
- Localized piece search with accent-insensitive matching and locale-aware snapshot dates.

## 1.3.0

- All five original Stunts terrain presets with north-up previews.
- Apply terrain while preserving track pieces, or start a new track on a preset; each is one undoable edit.
- Correct original IDs for water, shore, plateau, slopes and hill corners; all 19 terrain types are now supported.
- Shared terrain vector symbols in palette, map and previews.
- Presets preserve horizon and trailing TRK metadata; exact terrain layouts verified by SHA-256.

## 1.2.1

- Clearer bridge and solid ramp symbols with straight, aligned road connections.
- Open supporting piers versus a continuous concrete wedge distinguish the ramp types.
- Deck shading and a raised edge show elevation; palette hints identify the high end in all four orientations.

## 1.2.0

- Fixed overhead symbols in both palette and map, replacing perspective previews.
- Original editor artwork studied directly, including its masks, palette and tile orientations.
- Redrawn vector silhouettes for loops, corkscrews, banks, ramps, tunnels, pipes and scenery.
- Classic editor colours: green ground, unmarked grey asphalt, brown dirt and white ice.
- Original-style ramp highlights, raised-road supports, pipe openings and curve markings.
- Existing TRK data, placement, undo/redo and installed game preserved.

## 1.1.0

- Independently modelled low-poly tile previews inspired by the original Stunts style.
- Oblique 3D previews in the tile palette, matching geometry in the map.
- Narrower grey roads, yellow centre markings, raised ramps, banks, bridges, red tunnels, round pipes and visible loop openings.
- Recognisable trees, cactus, palm, buildings, windmill, boat and tennis court in place of numbered scenery boxes.
- All existing tile IDs, rotations, terrain data and TRK import/export preserved.

## 1.0.0

First standalone web release of the HD track editor.

- Dependency-free offline HTML and static-hosting build.
- Zoomable vector map, searchable tile catalog and terrain tools.
- Lossless TRK import/export, including unknown bytes and metadata.
- Atomic multi-tile replacement and erase with edge validation.
- Undo/redo, local recovery and ten saved browser drafts.
- Responsive layout, keyboard controls, map panning and tile eyedropper.
- Structural validation and optional browser-native WebMCP tools.

The structural check does not replace the game's route/driveability check.
