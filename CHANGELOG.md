# Changelog

## 1.8.0 — Streckenbibliothek (10. Oktober 2026)

- 4.287 unterschiedliche Archivstrecken nur im Editor: Suche nach Originalnamen, Autoren und Sammlungen, Statusfilter, 40 Ergebnisse pro Seite und Karten-/Herkunftsvorschau.
- Import aus verschachtelten ZIPs, bytegenaue Dublettenerkennung, Original-Fundstellen und Bliss-Metadaten bleiben erhalten. Fünf unlesbare Dateien protokolliert.
- 4.000 Strecken bestehen die Editor-Spielprüfung, 287 sind als reparaturbedürftig gekennzeichnet. Auch problematische Strecken können als Entwurf geladen werden.
- Laden ist ein Rückgängig-Schritt und schreibt nichts in den Spielkatalog. Speichern ins Spiel oder TRK-Export erfolgt ausdrücklich über die vorhandenen Knöpfe.
- Lokale Datenpakete werden bei Bedarf mit Prüfsummen geladen; maximal zwei Pakete im Cache. Keine Spieleprogramme, zusätzlichen Autos, Replays oder Bestzeiten aus dem Archiv eingebunden.
- 42 Editorprüfungen bestanden; Bibliotheksfluss und Abbruch in App 0.4.1 geprüft.


## 1.7.0 — Bauwerkzeuge (lokal, 10. Oktober 2026)

- Anschlussanzeige aus den originalen Routentabellen: Straße, Hochstraße, Röhre und Steilwand; Grün verbunden, Rot unpassend, Blau offen. Die Platzierungsvorschau bewertet ihre Nachbarn vor dem Setzen.
- Zusammenhängende Röhren, Halfpipes und Tunnel ohne wiederholte Portale in jedem Feld. Die Palette bleibt unverändert.
- Mehrere lokale Anschluss- und Geländekonflikte mit Koordinaten neben der nativen Rundkursprüfung. Lokale Hinweise blockieren keinen von der Engine akzeptierten Sprung oder unbefahrenen Nebenabschnitt.
- Schematische Höhenansicht mit Ost/West- oder Nord/Süd-Schnitt und wählbarer Zeile/Spalte; Gelände, Rampen und Hochstraße.
- Abschnitte als vollständige Mehrfeldteile auswählen, kopieren, verschieben und im Uhrzeigersinn drehen. Zielvorschau, optionales Gelände, ausdrückliches Ersetzen belegter Felder; atomarer Fehlerabbruch und ein Rückgängig-Schritt. Veränderte Quellen können nicht versehentlich ausgeschnitten werden.
- Teststart auf einer geeigneten Geraden vor dem markierten Abschnitt. Standalone exportiert TESTDRV.TRK, die macOS-App startet eine temporäre Solofahrt und stellt anschließend Strecke und Gegnerauswahl wieder her. Originaldatei und Bestzeiten werden nicht überschrieben.
- Lange Zeichenstriche rendern einmal pro Mausereignis statt einmal für jedes interpolierte Feld. Rückgängig ist auf 100 Änderungen begrenzt, Browser-Sicherungen auf zehn.
- Neue Werkzeuge und Meldungen in allen fünf Sprachen. 37 Editorprüfungen, native Teststartprüfung und macOS-Integrationsprüfungen.

## 1.6.1 — Kartengrafik (lokal, 10. Oktober 2026)

- Rampen, Hochstraßen und Steilwandteile schließen auf der Kartenmitte ohne künstlichen Versatz an.
- Überführungen behalten in beiden Richtungen die korrekte Kreuzung aus oberer und unterer Straße.
- Brückenstücke zeigen das durchgehende Deck des Originalmodells; Stützen, Schatten und Neigung sind klarer dargestellt.
- Steilwandkurven und Einfahrten verwenden zusammenhängende Fahrbahnen und Außenkanten.
- Die 184 vorhandenen Menübilder bleiben identisch. 36 Bauteilorientierungen mit Rastertests geprüft.

## 1.5.0

- Add a toggleable live Game view with the original Stunts track-selection camera, native software renderer, scene models, VGA palette and all five landscape panoramas.
- Paint, erase, undo/redo, terrain, landscape, draft loading and TRK import update the preview automatically. Cursor movement and piece selection do not render unplaced pieces.
- Keep the top-down map editable beside the preview; stack the preview below it on narrow screens. Native pixels scale sharply with original 4:3 display proportions.
- Embed all resources in the standalone HTML for offline use. Initialize graphics on first opening and coalesce edits per animation frame.
- Simplify unsupported imported fields only in a preview copy; preserve original TRK bytes and metadata for export. Localize controls, help and messages in all five languages.
- Include the complete preferred PlayStunts renderer source and resource provenance in the source package.

## 1.4.4

- Preload the unchanged original DEFAULT.TRK on first use, including all track tiles, terrain, horizon and metadata. Initial document name is DEFAULT.
- Existing saved browser drafts remain the startup priority.
- Add a DEFAULT button to reload the original track as an undoable edit. Keep the editor-created DEMO under Example.
- Embed DEFAULT data in the offline page and include DEFAULT.TRK in the web package. Document its provenance separately from editor code.

## 1.4.3

- Right-click rotates the selected track piece without editing the track; Shift + right-click erases complete pieces. Help and controls updated in all five languages.
- Rotation keeps the same family and surface, cycles clockwise through available orientations, and disables rotation for pieces with a single orientation. Fixes overpass/bridge-section type swaps.
- Palette cards grow with their contents. Names, identifiers and hints wrap within their boundaries, including narrow desktop and mobile layouts.
- Independently drawn side profiles for open and solid bridge ramps, with compass arrows; blue-framed bridge illustration follows the original model. Map remains top-down.
- Slope-road IDs 182–185 use the normal asphalt-road symbol, matching the original editor, with a clearer name and explanation. IDs and TRK data remain supported.

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

## 1.6.0 (local build, 2026-10-10)

- Use the native PlayStunts terrain and route validator offline, in addition to structural checks.
- Automatically check after edits, mark errors red and navigate to them by clicking coordinates.
- Store slope pieces using the original TRK road identifiers; preserve terrain and trailing metadata.
- Explain pipe transitions, ramp height connections and slope alignment; translate the new controls and errors into all five supported languages.
- App integration preserves unfinished drafts while checking routes before applying them to the game.
