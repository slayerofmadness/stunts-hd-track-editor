# Debian-Installation auf v1.4.4 aktualisieren

Diese Anleitung gilt für die zuvor eingerichtete Nginx-Installation mit Webdateien unter `/var/www/stunts` und Port 8080. Alle Befehle als root im Debian-Container ausführen.

## Release herunterladen und prüfen

```bash
STUNTS_UPDATE_DIR=$(mktemp -d)
cd "$STUNTS_UPDATE_DIR"
STUNTS_RELEASE_URL="https://github.com/slayerofmadness/stunts-hd-track-editor/releases/download/v1.4.4"

curl -fL "$STUNTS_RELEASE_URL/stunts-hd-track-editor-v1.4.4-web.zip" \
  -o stunts-hd-track-editor-v1.4.4-web.zip
curl -fL "$STUNTS_RELEASE_URL/SHA256SUMS.txt" -o SHA256SUMS.txt
sha256sum --ignore-missing -c SHA256SUMS.txt
```

Die Prüfung muss für die Web-ZIP `OK` melden. Erst danach fortfahren.

## Bestehende Version sichern und Dateien aktualisieren

```bash
unzip -o stunts-hd-track-editor-v1.4.4-web.zip
STUNTS_BACKUP="/var/www/stunts-backup-$(date +%Y%m%d-%H%M%S)"
cp -a /var/www/stunts "$STUNTS_BACKUP"
cp -a stunts-hd-track-editor-v1.4.4-web/. /var/www/stunts/
printf 'Sicherung: %s\n' "$STUNTS_BACKUP"
```

Nginx liefert die aktualisierten Dateien direkt aus. Die bestehenden Webserver- und Pangolin-Einstellungen können weiterverwendet werden.

## Prüfen

```bash
curl --fail --silent --show-error http://127.0.0.1:8080/ \
  -o "$STUNTS_UPDATE_DIR/served-index.html"
cmp /var/www/stunts/index.html "$STUNTS_UPDATE_DIR/served-index.html"
```

Die öffentliche Domain im Browser neu laden, bei Bedarf mit `Strg+F5` beziehungsweise `⌘+Umschalt+R`. Im Seitenfuß muss `v1.4.4` stehen.

Bei einem ersten Aufruf ohne gespeicherten Entwurf erscheint die originale DEFAULT-Strecke. Vorhandene Entwürfe haben Vorrang. Über DEFAULT kann die Originalstrecke geladen werden; Rückgängig stellt die vorherige Strecke wieder her.

Rechtsklick auf der Karte dreht die Auswahl; Umschalt + Rechtsklick radiert. Brücke und Rampen zeigen in der Palette Seitenprofile mit Richtungspfeil.

Eine große Kurve auswählen: Der Rahmen umfasst vier Kacheln und zeigt die Kurve. Beim Drehen eines Loopings wechselt die Vorschau zwischen 1 × 2 und 2 × 1. Die Vorschau verändert die Strecke erst beim Platzieren.

Gesicherte Browser-Entwürfe bleiben bei derselben Domain verfügbar. Zum Zurückwechseln auf die vorherige Version können die Dateien aus dem ausgegebenen Sicherungsordner wieder nach `/var/www/stunts/` kopiert werden.
