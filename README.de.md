# Stunts HD Track Editor

Ein eigenständiger Streckeneditor für Stunts / 4D Sports Driving, mit einer scharfen, zoombaren Vektorkarte. Die Webseite arbeitet vollständig lokal: importierte Strecken und Entwürfe werden nicht hochgeladen.

## Benutzen

Unter **Spielansicht** lässt sich eine Live-Vorschau wie in der originalen Streckenauswahl zuschalten: originale 3D-Bauteile, Höhen, VGA-Farben und alle fünf Landschaftshintergründe. Sie folgt Zeichnen, Radieren, Rückgängig, Geländewechsel und TRK-Import automatisch. Die Karte bleibt daneben bearbeitbar; auf kleinen Bildschirmen steht die Vorschau darunter. Die Originalgrafik wird mit scharfen Pixeln und den ursprünglichen 4:3-Bildschirmproportionen vergrößert. Alle Ressourcen sind eingebettet und funktionieren offline.

`dist/index.html` direkt im Browser öffnen. Die Release-ZIP enthält dieselbe Datei als `index.html`, ohne Installation und ohne externe Abhängigkeiten. Automatische Entwurfssicherungen können bei `file://` je nach Browser eingeschränkt sein; TRK-Import und -Export bleiben verfügbar.

- Deutsch, Englisch, Spanisch, Italienisch und Französisch. Die erste Sprache folgt den bevorzugten Browsersprachen, mit Englisch als Rückfall. Die Sprachauswahl oben speichert eine manuelle Wahl; „Automatisch“ aktiviert die Erkennung wieder. Sprachwechsel erhält Strecke, Auswahl und Rückgängig-Verlauf.
- 30 × 30 Felder, Straßen, Stunts und Landschaftselemente mit allen 183 unterstützten Bauteil-IDs.
- Ohne gespeicherten Entwurf wird die originale DEFAULT.TRK mit Gelände und Landschaft vorgeladen. Ein vorhandener Browser-Entwurf hat Vorrang. Der DEFAULT-Knopf lädt die Originalstrecke erneut; Rückgängig stellt die vorherige Strecke wieder her. „Beispiel“ lädt weiterhin die selbst erstellte DEMO.
- TRK öffnen und wieder exportieren; genau 1.802 Bytes. Unbekannte Werte, Horizont und das letzte Metadatenbyte bleiben beim Öffnen und unveränderten Export erhalten.
- Mehrfeld-Bauteile mit automatisch gesetzten Fortsetzungsfeldern; Ersetzen und Radieren entfernt das gesamte betroffene Bauteil.
- Sichtbare Platzierungsvorschau im gelben Rahmen. Rahmen und markierte Felder umfassen das gesamte ausgewählte Bauteil und passen sich beim Drehen an. Ungültige Randpositionen werden rot markiert.
- Alle 19 originalen Gelände-Typen: Gras, Wasser, Ufer, Hochebenen, Hänge sowie innere und äußere Hügelecken.
- Fünf vorgefertigte Original-Terrains mit Vorschau unter „Terrain-Vorlagen“. Nur Gelände anwenden erhält die Strecke; „Neue Strecke damit“ entfernt ihre Bauteile. Beides ist mit einem Schritt rückgängig zu machen. Horizont und das letzte Metadatenbyte bleiben erhalten.
- Horizont-Landschaft, Drehung, Suche und Kategorien.
- Rückgängig und Wiederholen (bis zu 100 Änderungen), ein Zeichenstrich als eine Änderung.
- Automatische lokale Entwurfswiederherstellung und zehn manuelle Sicherungen pro Browser/Origin.
- Zoom, Einpassen und Verschiebemodus; Desktop und Handy.
- Optionale WebMCP-Browserfunktionen zum Lesen, Suchen, Platzieren, Anwenden von Terrain-Vorlagen und Zurücknehmen.

Ziehen zeichnet. Rechtsklick auf die Karte oder `R` dreht das ausgewählte Bauteil zur nächsten verfügbaren Ausrichtung. Umschalt + Rechtsklick oder der Radierer radiert. Bauteiltyp und Straßenbelag bleiben beim Drehen erhalten; ohne weitere Ausrichtung bleibt die Auswahl unverändert. `Alt` + Klick übernimmt ein Bauteil aus der Karte. Auf der fokussierten Karte bewegen Pfeiltasten das markierte Feld; Leertaste platziert, Entf radiert. `Strg/⌘ Z` nimmt die letzte Änderung zurück, mit Umschalt wird sie wiederholt.

Sicherungen sind an diesen Browser und diese Webseitenadresse gebunden. Exportierte `.TRK`-Dateien lassen sich unabhängig davon aufbewahren und ins Spiel kopieren. Das Tool verändert keine installierte Spielversion.

## Grenzen

Die Bauteilsymbole sind in fester Draufsicht nach der Bildsprache des originalen Stunts-Streckeneditors neu gezeichnet. Die Karte bleibt in Draufsicht. Brücke, Brückenrampe und massive Brückenrampe zeigen in der Palette ein Seitenprofil mit Richtungspfeil zum hohen Ende. Die Brücke hat ein blaues Traggestell mit geraden Streben; die offene Rampe hat schlanke Stützen, die massive Rampe einen geschlossenen Unterbau. Lange Beschriftungen und ID-Angaben umbrechen innerhalb der Karten. Grauer Asphalt ohne Mittelstreifen, brauner Schotter, weißes Eis, die Markierungen der Steilkurven sowie die charakteristischen Symbole für Tunnel, Röhren und Loopings orientieren sich an den untersuchten 16-/32-Pixel-Vorlagen. SVG-Vektoren bleiben beim Zoomen scharf. Diese Vektorsymbole sind Annäherungen. Die zusätzliche Spielansicht verwendet originale Grafikdaten und den nativen Software-Renderer von PlayStunts mit der festen Kamera der Streckenauswahl. Sie ist eine visuelle Vorschau; zum Fahren wird weiterhin das Spiel benötigt. Ein aktueller Browser mit DecompressionStream-Unterstützung ist erforderlich. Unbekannte oder ungültige importierte Felder werden nur in der Vorschau vereinfacht; die Originalbytes der TRK bleiben erhalten. Die Strukturprüfung kontrolliert Start-/Ziellinie, Grenzen, Überschneidungen, Fortsetzungsfelder und unbekannte Werte. Sie prüft **nicht den vollständigen Streckenverlauf oder die physikalische Befahrbarkeit**. Gelände-Bauteil-Kombinationen werden nicht automatisch bereinigt. Die endgültige Streckenprüfung findet im Spiel statt.

## Entwickeln

Node.js 22 oder neuer, keine Pakete zu installieren:

```sh
npm test
npm run build
npm start
```

Die Vorschau läuft unter `http://127.0.0.1:48321/`. `src/` enthält den Quellcode; `scripts/build.mjs` bündelt HTML, CSS, Katalog und JavaScript in eine einzelne HTML-Datei. `dist/` ist direkt auf jedem statischen Webhost nutzbar. Mit `npm run release` entstehen ZIP-Pakete mit Offline-Fassung und Quellcode sowie SHA-256-Prüfsummen.

## Herkunft und Lizenz

GPL-3.0-only. Siehe [LICENSE](LICENSE) und [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md). Die Tile-IDs, Drehungen und Platzbelegung orientieren sich an den Format-Tabellen des PlayStunts-Projekts. Die Spielansicht enthält originale Szenenmodelle, Landschaftsbilder und Palettendaten aus den bereitgestellten Spielressourcen. Kein DOS-Programm und keine Audiodateien werden mitgeliefert. Die GPL gilt für Editor- und Renderer-Code; die Originalrechte an den Spielressourcen bleiben erhalten. Das ursprüngliche Layout der DEFAULT.TRK (1.802 Bytes) aus der bereitgestellten Spielinstallation wird mitgeliefert; diese Original-Streckendaten sind vom neu geschriebenen Editor-Code zu unterscheiden. Die DEMO-Beispielstrecke wurde für diesen Editor erstellt. Die fünf Gelände-Layouts wurden aus den Original-Terrain-Daten des PlayStunts-Editors übernommen; sie enthalten ausschließlich die 900 Gelände-IDs, keine Streckenbauteile. Die Gelände-Symbole sind neu gezeichnete SVGs.

Die „Asphaltstraße am Hang“ (IDs 182–185) verwendet wie im Originaleditor das normale Straßensymbol. Die Originaldaten ordnen diese IDs dem Straßenmodell auf einer Geländesteigung zu; sie werden zur Kompatibilität mit bestehenden TRK-Dateien erhalten. Der Editor erzeugt dazu nicht automatisch einen Gelände-Hang.

`vendor/` enthält den vollständigen Renderer-Quellcode und die Grafikressourcen der Vorschau. Der vorgebaute Renderer benötigt beim normalen Build keine Zusatzpakete. Zum erneuten Übersetzen lokal `esbuild@0.28.1` installieren und `node scripts/build-overview-renderer.mjs` ausführen.
