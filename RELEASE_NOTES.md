# Stunts HD Track Editor 1.8.0

4.287 unterschiedliche Strecken aus dem [Huge Stunts Track Archive](https://archive.org/details/hugestuntstrackarchive) sind über **Streckenbibliothek** verfügbar. Suche nach Namen, Autoren und Sammlungen, Statusfilter, Kartenvorschau und Herkunft helfen bei der Auswahl. Laden erzeugt ausschließlich einen rückgängig machbaren Editor-Entwurf. Ins Spiel gelangen die Strecken erst durch manuelles Exportieren oder ausdrückliches Speichern in der macOS-App. 4.000 Strecken bestehen die Spielprüfung; 287 sind als reparaturbedürftig gekennzeichnet. Dubletten und vorhandene Bliss-Metadaten bleiben nachvollziehbar.

Seit dem letzten GitHub-Release 1.5.0 sind außerdem enthalten:

- Verbesserte Kartensymbole für Überführungen, Rampen, Hochstraßen und Steilkurven mit passenden Anschlüssen.
- Native Prüfung des gesamten Rundkurses und Geländes sowie lokale Anschlusswarnungen mit anklickbaren Koordinaten.
- Abschnitte auswählen, kopieren, verschieben und drehen, einschließlich vollständiger Mehrfeldteile und optionalem Gelände.
- Schematische Höhenansicht und Export eines temporären Teststarts als TESTDRV.TRK.
- Zusammenhängende Röhren-/Tunnelgrafik und weniger Neuzeichnen bei langen Zeichenstrichen.
- Alle neuen Werkzeuge und Meldungen in fünf Sprachen.

## Downloads und Start

- **Web-ZIP:** entpacken, mit Node.js 22 oder neuer `node start.mjs` starten und `http://127.0.0.1:48321/` öffnen. Für die Bibliothek muss der Ordner `community-tracks` neben `index.html` erhalten bleiben. Alternativ den gesamten Inhalt auf einem statischen Webserver bereitstellen. Die übrigen Editorwerkzeuge funktionieren auch beim direkten Öffnen der HTML-Datei.
- **Source-ZIP:** vollständiger Quellcode einschließlich Daten, Renderer und nativer Streckenprüfung; `npm test`, `npm run build`, `npm start`.
- **SHA256SUMS.txt:** Prüfsummen beider ZIP-Pakete.

42 automatisierte Editorprüfungen bestanden. Bibliotheksvorschau, Suche, Filter, Laden und Abbruch zusätzlich in der macOS-App 0.4.1 geprüft. Die Spielprüfung bestätigt einen gültigen Rundkurs, keine erfolgreiche physikalische Testfahrt mit jedem Auto. Originalrechte an Strecken und Spielressourcen bleiben erhalten; siehe THIRD_PARTY_NOTICES.md.
