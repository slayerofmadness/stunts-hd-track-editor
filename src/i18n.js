export const LANGUAGES = Object.freeze({de:'Deutsch',en:'English',es:'Español',it:'Italiano',fr:'Français'});
export const LANGUAGE_KEY = 'stunts-hd-language-v1';
let language='de';
export function chooseLanguage(preference,browserLanguages=[]) {
 if(Object.hasOwn(LANGUAGES,preference))return preference;
 for(const locale of Array.isArray(browserLanguages)?browserLanguages:[browserLanguages]) {
  const code=typeof locale==='string'?locale.trim().toLowerCase().split(/[-_]/)[0]:'';
  if(Object.hasOwn(LANGUAGES,code))return code;
 }
 return 'en';
}
export function setLanguage(code){if(!Object.hasOwn(LANGUAGES,code))throw Error('Unsupported language.');language=code;}
export function getLanguage(){return language;}
export function normalizeSearch(value){return String(value).normalize('NFD').replace(/\p{M}/gu,'').toLowerCase();}

// German source keys keep format data independent of the interface language.
// Each row provides English, Spanish, Italian and French, respectively.
const rows=`
Streckenbibliothek|Track library|Biblioteca de pistas|Biblioteca dei circuiti|Bibliothèque de circuits
Streckenbibliothek wird geladen…|Loading track library…|Cargando biblioteca de pistas…|Caricamento della biblioteca…|Chargement de la bibliothèque…
Streckenbibliothek konnte nicht geladen werden.|Could not load the track library.|No se pudo cargar la biblioteca.|Impossibile caricare la biblioteca.|Impossible de charger la bibliothèque.
Ungültige Streckenbibliothek.|Invalid track library.|Biblioteca no válida.|Biblioteca non valida.|Bibliothèque invalide.
Unbekannte Archivstrecke.|Unknown archive track.|Pista de archivo desconocida.|Circuito d’archivio sconosciuto.|Circuit d’archive inconnu.
Archivstrecke konnte nicht geladen werden.|Could not load the archive track.|No se pudo cargar la pista.|Impossibile caricare il circuito.|Impossible de charger le circuit.
Prüfsumme der Archivstrecke stimmt nicht.|Archive track checksum mismatch.|La suma de comprobación no coincide.|La somma di controllo non corrisponde.|La somme de contrôle ne correspond pas.
Archivstrecken werden nur als Editor-Entwurf geladen. Im Spiel musst du sie anschließend selbst speichern.|Archive tracks load as editor drafts. Save them into the game yourself afterwards.|Las pistas se cargan como borradores. Después debes guardarlas tú en el juego.|I circuiti vengono caricati come bozze. Devi poi salvarli nel gioco.|Les circuits sont chargés comme brouillons. Enregistrez-les ensuite dans le jeu.
Strecke suchen|Search tracks|Buscar pistas|Cerca circuiti|Chercher un circuit
Name, Autor oder Sammlung|Name, author or collection|Nombre, autor o colección|Nome, autore o raccolta|Nom, auteur ou collection
Sammlung|Collection|Colección|Raccolta|Collection
Alle Sammlungen|All collections|Todas las colecciones|Tutte le raccolte|Toutes les collections
Spielprüfung|Game check|Comprobación del juego|Verifica del gioco|Vérification du jeu
Alle Strecken|All tracks|Todas las pistas|Tutti i circuiti|Tous les circuits
Spielprüfung bestanden|Game check passed|Comprobación superada|Verifica superata|Vérification réussie
Reparatur nötig|Needs repair|Necesita reparación|Richiede riparazione|Réparation nécessaire
Archivstrecken|Archive tracks|Pistas del archivo|Circuiti d’archivio|Circuits d’archive
Seiten|Pages|Páginas|Pagine|Pages
Zurück|Previous|Anterior|Indietro|Précédent
Weiter|Next|Siguiente|Avanti|Suivant
Wähle eine Strecke für die Vorschau.|Select a track to preview.|Selecciona una pista para verla.|Seleziona un circuito per l’anteprima.|Sélectionnez un circuit pour l’aperçu.
In den Editor laden|Load into editor|Cargar en el editor|Carica nell’editor|Charger dans l’éditeur
Quelle: Internet Archive|Source: Internet Archive|Fuente: Internet Archive|Fonte: Internet Archive|Source : Internet Archive
{count} Treffer · {total} Strecken|{count} matches · {total} tracks|{count} resultados · {total} pistas|{count} risultati · {total} circuiti|{count} résultats · {total} circuits
Keine passenden Strecken.|No matching tracks.|No hay pistas que coincidan.|Nessun circuito corrispondente.|Aucun circuit correspondant.
Seite {page} von {pages}|Page {page} of {pages}|Página {page} de {pages}|Pagina {page} di {pages}|Page {page} sur {pages}
Streckenvorschau|Track preview|Vista previa de la pista|Anteprima del circuito|Aperçu du circuit
Streckenvorschau wird geladen…|Loading track preview…|Cargando vista previa…|Caricamento dell’anteprima…|Chargement de l’aperçu…
Autor|Author|Autor|Autore|Auteur
Spielname: {name}.TRK|Game filename: {name}.TRK|Nombre en el juego: {name}.TRK|Nome nel gioco: {name}.TRK|Nom dans le jeu : {name}.TRK
Herkunft · {count} Fundstellen|Sources · {count} occurrences|Origen · {count} apariciones|Origine · {count} occorrenze|Origine · {count} occurrences
Die Bibliothek benötigt die mitgelieferten Dateien und einen lokalen Webserver. In der macOS-App ist sie direkt verfügbar.|The library needs the included files and a local web server. It is directly available in the macOS app.|La biblioteca necesita los archivos incluidos y un servidor web local. Está disponible en la aplicación macOS.|La biblioteca richiede i file inclusi e un server web locale. È disponibile nell’app macOS.|La bibliothèque nécessite les fichiers fournis et un serveur web local. Elle est disponible dans l’app macOS.
{file} als Editor-Entwurf geladen.|{file} loaded as an editor draft.|{file} cargado como borrador.|{file} caricato come bozza.|{file} chargé comme brouillon.
X {x}, Y {y} · {piece}|X {x}, Y {y} · {piece}|X {x}, Y {y} · {piece}|X {x}, Y {y} · {piece}|X {x}, Y {y} · {piece}
Sprache|Language|Idioma|Lingua|Langue
Automatisch ({language})|Automatic ({language})|Automático ({language})|Automatica ({language})|Automatique ({language})
STRECKE|TRACK|CIRCUITO|PISTA|CIRCUIT
Streckenname|Track name|Nombre del circuito|Nome della pista|Nom du circuit
TRK öffnen|Open TRK|Abrir TRK|Apri TRK|Ouvrir TRK
TRK exportieren|Export TRK|Exportar TRK|Esporta TRK|Exporter TRK
Letzter Export|Last export|Última exportación|Ultima esportazione|Dernier export
Werkzeugkasten|Toolbox|Herramientas|Strumenti|Outils
Ebene|Layer|Capa|Livello|Calque
Bauteile|Track pieces|Piezas|Elementi|Éléments
Gelände|Terrain|Terreno|Terreno|Terrain
Bauteil oder ID suchen|Search pieces or ID|Buscar piezas o ID|Cerca elementi o ID|Rechercher un élément ou un ID
Bauteile suchen|Search track pieces|Buscar piezas del circuito|Cerca elementi della pista|Rechercher des éléments
Alle|All|Todo|Tutti|Tous
Straße|Road|Carretera|Strada|Route
Landschaft|Scenery|Paisaje|Paesaggio|Décor
Bauteil drehen|Rotate piece|Girar pieza|Ruota elemento|Tourner l’élément
Bauteil drehen (R)|Rotate piece (R)|Girar pieza (R)|Ruota elemento (R)|Tourner l’élément (R)
Bauteilpalette|Piece palette|Paleta de piezas|Tavolozza degli elementi|Palette des éléments
Streckeneditor|Track editor|Editor de circuitos|Editor di piste|Éditeur de circuits
Neu|New|Nuevo|Nuova|Nouveau
Beispiel|Example|Ejemplo|Esempio|Exemple
Terrain-Vorlagen|Terrain presets|Terrenos predefinidos|Terreni predefiniti|Terrains prédéfinis
Rückgängig|Undo|Deshacer|Annulla|Annuler
Rückgängig (Strg/⌘ Z)|Undo (Ctrl/⌘ Z)|Deshacer (Ctrl/⌘ Z)|Annulla (Ctrl/⌘ Z)|Annuler (Ctrl/⌘ Z)
Wiederholen|Redo|Rehacer|Ripristina|Rétablir
Verschieben|Pan|Desplazar|Sposta|Déplacer
Strecke prüfen|Check track|Comprobar circuito|Controlla pista|Vérifier le circuit
Verkleinern|Zoom out|Alejar|Riduci zoom|Dézoomer
Vergrößern|Zoom in|Acercar|Aumenta zoom|Zoomer
Einpassen|Fit to view|Ajustar a la vista|Adatta alla vista|Ajuster à la vue
Horizont-Landschaft|Horizon scenery|Paisaje del horizonte|Paesaggio dell’orizzonte|Paysage de l’horizon
Entwurf nur in diesem Browser|Draft stored in this browser only|Borrador solo en este navegador|Bozza solo in questo browser|Brouillon dans ce navigateur uniquement
Entwurf sichern|Save snapshot|Guardar copia|Salva copia|Enregistrer une copie
Gesicherten Entwurf laden|Load saved snapshot|Cargar copia guardada|Carica copia salvata|Charger une copie enregistrée
Sicherung laden…|Load snapshot…|Cargar copia…|Carica copia…|Charger une copie…
Hilfe|Help|Ayuda|Aiuto|Aide
30 × 30 FELDER|30 × 30 CELLS|30 × 30 CASILLAS|30 × 30 CASELLE|30 × 30 CASES
Streckenkarte, Pfeile bewegen, Leertaste platziert|Track map: arrow keys move, Space places|Mapa: las flechas mueven, Espacio coloca|Mappa: le frecce spostano, Spazio posiziona|Carte : flèches pour déplacer, Espace pour placer
Bereit|Ready|Listo|Pronto|Prêt
Ziehen: zeichnen · Rechtsklick/R: drehen · Umschalt + Rechtsklick: radieren|Drag: draw · Right-click/R: rotate · Shift + right-click: erase|Arrastrar: dibujar · Clic derecho/R: girar · Mayús + clic derecho: borrar|Trascina: disegna · Clic destro/R: ruota · Maiusc + clic destro: cancella|Glisser : dessiner · Clic droit/R : tourner · Maj + clic droit : effacer
Vektoransicht · v1.8.0|Vector view · v1.8.0|Vista vectorial · v1.8.0|Vista vettoriale · v1.8.0|Vue vectorielle · v1.8.0
Dialog schließen|Close dialog|Cerrar ventana|Chiudi finestra|Fermer la fenêtre
Wüste|Desert|Desierto|Deserto|Désert
Tropen|Tropical|Trópico|Tropici|Tropiques
Alpen|Alpine|Alpes|Alpi|Alpes
Stadt|City|Ciudad|Città|Ville
Land|Countryside|Campo|Campagna|Campagne
Originalwert {value}|Original value {value}|Valor original {value}|Valore originale {value}|Valeur d’origine {value}
Nord|North|Norte|Nord|Nord
Ost|East|Este|Est|Est
Süd|South|Sur|Sud|Sud
West|West|Oeste|Ovest|Ouest
Seitenansicht|Side view|Vista lateral|Vista laterale|Vue de côté
Normale Asphaltstraße auf einem Gelände-Hang (Original-IDs 182–185).|Normal asphalt road on sloping terrain (original IDs 182–185).|Carretera asfaltada normal sobre terreno inclinado (IDs originales 182–185).|Normale strada asfaltata su terreno in pendenza (ID originali 182–185).|Route asphaltée normale sur un terrain en pente (IDs d’origine 182–185).
Gelände wird nicht gedreht.|Terrain is not rotated.|El terreno no se gira.|Il terreno non viene ruotato.|Le terrain ne tourne pas.
Dieses Bauteil hat keine weitere Ausrichtung.|This piece has no other orientation.|Esta pieza no tiene otra orientación.|Questo elemento non ha altri orientamenti.|Cet élément n’a pas d’autre orientation.
{piece} · Ausrichtung {angle}°|{piece} · Orientation {angle}°|{piece} · Orientación {angle}°|{piece} · Orientamento {angle}°|{piece} · Orientation {angle}°
Hohes Ende: {direction}|High end: {direction}|Extremo elevado: {direction}|Estremità alta: {direction}|Extrémité haute : {direction}
Leer|Empty|Vacío|Vuoto|Vide
Fortsetzung|Continuation|Continuación|Continuazione|Continuation
Bauteil {id}|Piece {id}|Pieza {id}|Elemento {id}|Élément {id}
Gelände {id}|Terrain {id}|Terreno {id}|Terreno {id}|Terrain {id}
{count} Bauteile · 1.802 Bytes|{count} pieces · 1,802 bytes|{count} piezas · 1.802 bytes|{count} elementi · 1.802 byte|{count} éléments · 1 802 octets
Keine passenden Bauteile.|No matching pieces.|No hay piezas coincidentes.|Nessun elemento corrispondente.|Aucun élément correspondant.
Automatisch in diesem Browser gespeichert|Automatically saved in this browser|Guardado automáticamente en este navegador|Salvato automaticamente in questo browser|Enregistré automatiquement dans ce navigateur
Browsersicherung nicht verfügbar · TRK exportieren|Browser saving unavailable · export TRK|Guardado no disponible · exporta TRK|Salvataggio non disponibile · esporta TRK|Enregistrement indisponible · exporter TRK
Lokalen Entwurf wiederhergestellt|Local draft restored|Borrador local recuperado|Bozza locale ripristinata|Brouillon local restauré
Letzten Entwurf aus diesem Browser wiederhergestellt.|Restored the last draft from this browser.|Se ha recuperado el último borrador de este navegador.|Ultima bozza di questo browser ripristinata.|Dernier brouillon de ce navigateur restauré.
Gesicherter Entwurf nicht lesbar · DEFAULT geöffnet.|Saved draft unreadable · DEFAULT opened.|No se puede leer el borrador · DEFAULT abierto.|Bozza salvata illeggibile · DEFAULT aperto.|Brouillon illisible · DEFAULT ouvert.
Originalstrecke DEFAULT · eigene TRK öffnen oder direkt weiterbauen.|Original DEFAULT track · open your TRK or start editing.|Circuito original DEFAULT · abre tu TRK o empieza a editar.|Pista originale DEFAULT · apri la tua TRK o inizia a modificare.|Circuit original DEFAULT · ouvrir une TRK ou commencer à modifier.
Änderung wiederholt.|Edit redone.|Cambio rehecho.|Modifica ripristinata.|Modification rétablie.
Änderung rückgängig gemacht.|Edit undone.|Cambio deshecho.|Modifica annullata.|Modification annulée.
Bauteil von der Karte übernommen.|Piece picked from the map.|Pieza seleccionada del mapa.|Elemento selezionato dalla mappa.|Élément sélectionné sur la carte.
Karte ziehen zum Verschieben.|Drag the map to pan.|Arrastra el mapa para desplazarlo.|Trascina la mappa per spostarla.|Glisser la carte pour la déplacer.
Zeichenmodus.|Drawing mode.|Modo de dibujo.|Modalità disegno.|Mode dessin.
{file} geöffnet.|Opened {file}.|{file} abierto.|{file} aperto.|{file} ouvert.
{file} exportiert · 1.802 Bytes.|Exported {file} · 1,802 bytes.|{file} exportado · 1.802 bytes.|{file} esportato · 1.802 byte.|{file} exporté · 1 802 octets.
Horizont-Landschaft geändert.|Horizon scenery changed.|Paisaje del horizonte cambiado.|Paesaggio dell’orizzonte modificato.|Paysage de l’horizon modifié.
Leere Strecke · mit Rückgängig zurück zum bisherigen Entwurf.|Empty track · Undo restores the previous draft.|Circuito vacío · Deshacer recupera el borrador anterior.|Pista vuota · Annulla ripristina la bozza precedente.|Circuit vide · Annuler restaure le brouillon précédent.
Originalstrecke DEFAULT laden|Load the original DEFAULT track|Cargar el circuito original DEFAULT|Carica la pista originale DEFAULT|Charger le circuit original DEFAULT
Originalstrecke DEFAULT geladen · bisherige Strecke bleibt in Rückgängig.|Original DEFAULT track loaded · Undo restores the previous track.|Circuito original DEFAULT cargado · Deshacer recupera el circuito anterior.|Pista originale DEFAULT caricata · Annulla ripristina la pista precedente.|Circuit original DEFAULT chargé · Annuler restaure le circuit précédent.
Beispielstrecke geladen · bisherige Strecke bleibt in Rückgängig.|Example loaded · Undo restores the previous track.|Ejemplo cargado · Deshacer recupera el circuito anterior.|Esempio caricato · Annulla ripristina la pista precedente.|Exemple chargé · Annuler restaure le circuit précédent.
{preset} angewendet · {mode} · mit Rückgängig zurück.|Applied {preset} · {mode} · Undo to restore.|{preset} aplicado · {mode} · Deshacer para restaurar.|{preset} applicato · {mode} · Annulla per ripristinare.|{preset} appliqué · {mode} · Annuler pour restaurer.
neue Strecke|new track|circuito nuevo|nuova pista|nouveau circuit
Bauteile erhalten|pieces preserved|piezas conservadas|elementi conservati|éléments conservés
Entwurf gesichert · die letzten zehn Sicherungen bleiben erhalten.|Snapshot saved · the last ten snapshots are kept.|Copia guardada · se conservan las diez últimas.|Copia salvata · vengono conservate le ultime dieci.|Copie enregistrée · les dix dernières sont conservées.
Sicherung fehlgeschlagen. Bitte die Strecke als TRK exportieren.|Saving failed. Please export the track as TRK.|Error al guardar. Exporta el circuito como TRK.|Salvataggio non riuscito. Esporta la pista come TRK.|Échec de l’enregistrement. Exporter le circuit en TRK.
Sicherung geladen · bisheriger Entwurf bleibt in Rückgängig.|Snapshot loaded · Undo restores the previous draft.|Copia cargada · Deshacer recupera el borrador anterior.|Copia caricata · Annulla ripristina la bozza precedente.|Copie chargée · Annuler restaure le brouillon précédent.
Bauteile platziert.|Pieces placed.|Piezas colocadas.|Elementi posizionati.|Éléments placés.
Originale Terrain-Vorlagen|Original terrain presets|Terrenos originales predefinidos|Terreni originali predefiniti|Terrains prédéfinis d’origine
Die fünf Gelände aus dem originalen Stunts-Editor. Wähle eine Vorlage; die Vorschau zeigt Norden oben.|The five terrains from the original Stunts editor. Choose a preset; north is at the top.|Los cinco terrenos del editor original de Stunts. Elige uno; el norte está arriba.|I cinque terreni dell’editor originale di Stunts. Scegli un terreno; il nord è in alto.|Les cinq terrains de l’éditeur Stunts d’origine. Choisir un terrain ; le nord est en haut.
Terrain {number}|Terrain {number}|Terreno {number}|Terreno {number}|Terrain {number}
Große Hochebene|Large plateau|Meseta grande|Grande altopiano|Grand plateau
Fluss und See|River and lake|Río y lago|Fiume e lago|Rivière et lac
Plateaus und Seen|Plateaus and lakes|Mesetas y lagos|Altopiani e laghi|Plateaux et lacs
Schmale Hügelketten|Narrow hill ridges|Colinas estrechas|Crinali stretti|Crêtes étroites
Große Hügel und Seen|Large hills and lakes|Colinas y lagos grandes|Grandi colline e laghi|Grandes collines et lacs
„Nur Gelände anwenden“ erhält alle Bauteile. „Neue Strecke damit“ entfernt alle Bauteile. Beide Aktionen lassen sich rückgängig machen; den Horizont behältst du bei.|“Apply terrain only” keeps all pieces. “Start new track here” removes all pieces. Both actions support Undo and keep the horizon.|“Aplicar solo terreno” conserva todas las piezas. “Crear circuito aquí” elimina todas las piezas. Ambas acciones se pueden deshacer y conservan el horizonte.|“Applica solo il terreno” conserva tutti gli elementi. “Crea pista qui” rimuove tutti gli elementi. Entrambe le azioni si possono annullare e mantengono l’orizzonte.|« Appliquer le terrain seul » conserve tous les éléments. « Créer un circuit ici » les supprime. Les deux actions peuvent être annulées et conservent l’horizon.
Nur Gelände anwenden|Apply terrain only|Aplicar solo terreno|Applica solo il terreno|Appliquer le terrain seul
Neue Strecke damit|Start new track here|Crear circuito aquí|Crea pista qui|Créer un circuit ici
Die Strukturprüfung hat Hinweise gefunden.|The structure check found issues.|La comprobación ha encontrado problemas.|Il controllo della struttura ha rilevato problemi.|La vérification de la structure a détecté des problèmes.
Start/Ziel und Mehrfeld-Bauteile sind strukturell korrekt.|Start/finish and multi-cell pieces are structurally correct.|La salida/meta y las piezas de varias casillas son correctas.|Partenza/traguardo ed elementi su più caselle sono strutturalmente corretti.|Le départ/arrivée et les éléments sur plusieurs cases sont structurellement corrects.
Diese Prüfung kontrolliert Dateistruktur, Bauteilgrenzen und Fortsetzungsfelder. Den vollständigen Streckenverlauf und die Befahrbarkeit prüfst du im Spiel.|This check covers file structure, piece boundaries and continuation cells. Check the full route and driveability in the game.|Esta comprobación revisa la estructura del archivo, los límites de las piezas y las casillas de continuación. Comprueba el recorrido completo y si se puede conducir en el juego.|Questo controllo verifica la struttura del file, i bordi degli elementi e le caselle di continuazione. Verifica il percorso completo e la percorribilità nel gioco.|Cette vérification porte sur la structure du fichier, les limites des éléments et les cases de continuation. Vérifier le parcours complet et sa praticabilité dans le jeu.
So baust du deine Strecke|How to build your track|Cómo construir tu circuito|Come costruire la tua pista|Construire votre circuit
Wähle ein Bauteil und zeichne auf der Karte. Rechtsklick oder R dreht die Auswahl zur nächsten verfügbaren Ausrichtung. Umschalt + Rechtsklick oder der Radierer entfernt ganze Bauteile. Mit Alt + Klick übernimmst du ein Bauteil von der Karte.|Choose a piece and draw on the map. Right-click or R rotates to the next available orientation. Shift + right-click or the eraser removes whole pieces. Alt + click picks a piece from the map.|Elige una pieza y dibuja en el mapa. El clic derecho o R gira a la siguiente orientación disponible. Mayús + clic derecho o la goma borran piezas completas. Alt + clic selecciona una pieza del mapa.|Scegli un elemento e disegna sulla mappa. Clic destro o R passa al successivo orientamento disponibile. Maiusc + clic destro o la gomma rimuove elementi interi. Alt + clic seleziona un elemento dalla mappa.|Choisir un élément et dessiner sur la carte. Le clic droit ou R passe à la prochaine orientation disponible. Maj + clic droit ou la gomme supprime des éléments entiers. Alt + clic sélectionne un élément sur la carte.
Pfeiltasten bewegen das markierte Feld. Leertaste platziert, Entf radiert. Strg/⌘ Z nimmt einen Zeichenstrich zurück; mit Umschalt wiederholst du ihn.|Arrow keys move the selected cell. Space places; Delete erases. Ctrl/⌘ Z undoes a stroke; add Shift to redo it.|Las flechas mueven la casilla seleccionada. Espacio coloca; Supr borra. Ctrl/⌘ Z deshace un trazo; añade Mayús para rehacerlo.|Le frecce spostano la casella selezionata. Spazio posiziona; Canc elimina. Ctrl/⌘ Z annulla un tratto; aggiungi Maiusc per ripristinarlo.|Les flèches déplacent la case sélectionnée. Espace place ; Suppr efface. Ctrl/⌘ Z annule un tracé ; ajouter Maj pour le rétablir.
„Terrain-Vorlagen“ enthält die fünf Original-Gelände mit Vorschau. Wende nur das Gelände auf deine Strecke an oder beginne eine neue Strecke damit; Rückgängig stellt den bisherigen Entwurf wieder her.|“Terrain presets” contains the five original terrains with previews. Apply only the terrain to your track or start a new track on it; Undo restores the previous draft.|“Terrenos predefinidos” contiene los cinco terrenos originales con vista previa. Aplica solo el terreno o crea un circuito nuevo; Deshacer recupera el borrador anterior.|“Terreni predefiniti” contiene i cinque terreni originali con anteprima. Applica solo il terreno o crea una nuova pista; Annulla ripristina la bozza precedente.|« Terrains prédéfinis » contient les cinq terrains d’origine avec aperçu. Appliquer le terrain seul ou créer un circuit dessus ; Annuler restaure le brouillon précédent.
Auf dem Handy kannst du zeichnen oder mit „Verschieben“ die vergrößerte Karte ziehen. Einpassen zeigt die gesamte Strecke.|On mobile, draw or use “Pan” to drag the enlarged map. “Fit to view” shows the whole track.|En el móvil, dibuja o usa “Desplazar” para mover el mapa ampliado. “Ajustar a la vista” muestra todo el circuito.|Sul telefono puoi disegnare o usare “Sposta” per trascinare la mappa ingrandita. “Adatta alla vista” mostra tutta la pista.|Sur mobile, dessiner ou utiliser « Déplacer » pour déplacer la carte agrandie. « Ajuster à la vue » affiche tout le circuit.
Entwürfe werden lokal in diesem Browser gespeichert. Exportiere eine .TRK, um sie im Spiel zu benutzen oder dauerhaft aufzubewahren. Originaldateien werden beim Import nicht verändert. Mehrfeld-Bauteile brauchen den angegebenen Platz.|Drafts are stored locally in this browser. Export a .TRK to use it in the game or keep it permanently. Importing does not modify original files. Multi-cell pieces need the indicated space.|Los borradores se guardan localmente en este navegador. Exporta una .TRK para usarla en el juego o conservarla. La importación no modifica los archivos originales. Las piezas de varias casillas necesitan el espacio indicado.|Le bozze sono salvate localmente in questo browser. Esporta una .TRK per usarla nel gioco o conservarla. L’importazione non modifica i file originali. Gli elementi su più caselle richiedono lo spazio indicato.|Les brouillons sont enregistrés localement dans ce navigateur. Exporter une .TRK pour jouer ou la conserver. L’importation ne modifie pas les fichiers d’origine. Les éléments sur plusieurs cases nécessitent l’espace indiqué.
Die Karte bleibt in fester Draufsicht. Brücke und Rampen zeigen in der Palette eine Seitenansicht; der Pfeil zeigt ihre Richtung auf der Karte. Die Symbole sind als scharfe Vektorgrafiken nach dem Original neu gezeichnet.|The map stays in a fixed top-down view. Bridges and ramps use a side view in the palette; the arrow shows their direction on the map. The symbols are redrawn as sharp vectors based on the original.|El mapa mantiene la vista cenital fija. Puentes y rampas usan una vista lateral en la paleta; la flecha indica su dirección en el mapa. Los símbolos son vectores nítidos redibujados a partir del original.|La mappa rimane in vista dall’alto fissa. Ponti e rampe usano una vista laterale nella tavolozza; la freccia indica la direzione sulla mappa. I simboli sono vettori nitidi ridisegnati dall’originale.|La carte garde une vue de dessus fixe. Ponts et rampes utilisent une vue de côté dans la palette ; la flèche indique leur direction sur la carte. Les symboles sont redessinés en vecteurs nets d’après l’original.
Eine Stunts-TRK-Datei muss genau 1.802 Bytes enthalten.|A Stunts TRK file must contain exactly 1,802 bytes.|Un archivo TRK de Stunts debe tener exactamente 1.802 bytes.|Un file TRK di Stunts deve contenere esattamente 1.802 byte.|Un fichier TRK Stunts doit contenir exactement 1 802 octets.
Koordinaten müssen zwischen 0 und 29 liegen.|Coordinates must be between 0 and 29.|Las coordenadas deben estar entre 0 y 29.|Le coordinate devono essere comprese tra 0 e 29.|Les coordonnées doivent être comprises entre 0 et 29.
Unbekanntes Gelände.|Unknown terrain.|Terreno desconocido.|Terreno sconosciuto.|Terrain inconnu.
Unbekannte Ebene.|Unknown layer.|Capa desconocida.|Livello sconosciuto.|Calque inconnu.
Unbekanntes Bauteil.|Unknown piece.|Pieza desconocida.|Elemento sconosciuto.|Élément inconnu.
{piece} benötigt {width} × {height} Felder und passt hier nicht.|{piece} needs {width} × {height} cells and does not fit here.|{piece} necesita {width} × {height} casillas y no cabe aquí.|{piece} richiede {width} × {height} caselle e non entra qui.|{piece} nécessite {width} × {height} cases et ne tient pas ici.
X {x}, Y {y}: unbekanntes Bauteil {id}.|X {x}, Y {y}: unknown piece {id}.|X {x}, Y {y}: pieza desconocida {id}.|X {x}, Y {y}: elemento sconosciuto {id}.|X {x}, Y {y} : élément inconnu {id}.
X {x}, Y {y}: Bauteil ragt über den Rand.|X {x}, Y {y}: piece extends past the edge.|X {x}, Y {y}: la pieza sale del borde.|X {x}, Y {y}: l’elemento supera il bordo.|X {x}, Y {y} : l’élément dépasse le bord.
X {x}, Y {y}: überlappende Bauteile.|X {x}, Y {y}: overlapping pieces.|X {x}, Y {y}: piezas superpuestas.|X {x}, Y {y}: elementi sovrapposti.|X {x}, Y {y} : éléments superposés.
X {x}, Y {y}: Fortsetzungsfeld fehlt.|X {x}, Y {y}: missing continuation cell.|X {x}, Y {y}: falta una casilla de continuación.|X {x}, Y {y}: manca una casella di continuazione.|X {x}, Y {y} : case de continuation manquante.
X {x}, Y {y}: verwaistes Fortsetzungsfeld.|X {x}, Y {y}: orphan continuation cell.|X {x}, Y {y}: casilla de continuación sin pieza.|X {x}, Y {y}: casella di continuazione senza elemento.|X {x}, Y {y} : case de continuation sans élément.
Unbekanntes Gelände {id} auf Feld {cell}.|Unknown terrain {id} in cell {cell}.|Terreno desconocido {id} en la casilla {cell}.|Terreno sconosciuto {id} nella casella {cell}.|Terrain inconnu {id} dans la case {cell}.
Die Strecke braucht genau eine Start-/Ziellinie (aktuell {count}).|The track needs exactly one start/finish line (currently {count}).|El circuito necesita una sola línea de salida/meta (actualmente {count}).|La pista richiede esattamente una linea di partenza/traguardo (attualmente {count}).|Le circuit nécessite exactement une ligne de départ/arrivée (actuellement {count}).
Unbekannte Gelände-Vorlage.|Unknown terrain preset.|Terreno predefinido desconocido.|Terreno predefinito sconosciuto.|Terrain prédéfini inconnu.
Ungültiger Gelände-Modus.|Invalid terrain mode.|Modo de terreno no válido.|Modalità terreno non valida.|Mode terrain non valide.
Radierer|Eraser|Goma|Gomma|Gomme
Start / Ziel|Start / finish|Salida / meta|Partenza / traguardo|Départ / arrivée
Asphaltgerade|Asphalt straight|Recta de asfalto|Rettilineo asfaltato|Ligne droite en asphalte
Enge Asphaltkurve|Tight asphalt corner|Curva cerrada de asfalto|Curva stretta asfaltata|Virage serré en asphalte
Weite Asphaltkurve|Wide asphalt corner|Curva amplia de asfalto|Curva ampia asfaltata|Virage large en asphalte
Schottergerade|Dirt straight|Recta de tierra|Rettilineo sterrato|Ligne droite en terre
Enge Schotterkurve|Tight dirt corner|Curva cerrada de tierra|Curva stretta sterrata|Virage serré en terre
Weite Schotterkurve|Wide dirt corner|Curva amplia de tierra|Curva ampia sterrata|Virage large en terre
Eisgerade|Ice straight|Recta de hielo|Rettilineo ghiacciato|Ligne droite sur glace
Enge Eiskurve|Tight ice corner|Curva cerrada de hielo|Curva stretta ghiacciata|Virage serré sur glace
Weite Eiskurve|Wide ice corner|Curva amplia de hielo|Curva ampia ghiacciata|Virage large sur glace
Hochstraße|Elevated road|Carretera elevada|Strada sopraelevata|Route surélevée
Brückenrampe|Bridge ramp|Rampa de puente|Rampa del ponte|Rampe de pont
Steilwand-Einfahrt|Banked-road entrance|Entrada peraltada|Ingresso sopraelevato in curva|Entrée de route inclinée
Steilwandgerade|Banked straight|Recta peraltada|Rettilineo inclinato|Ligne droite inclinée
Steilwandkurve|Banked corner|Curva peraltada|Curva sopraelevata|Virage relevé
Brücke|Bridge|Puente|Ponte|Pont
Schikane|Chicane|Chicana|Chicane|Chicane
Looping|Loop|Looping|Giro della morte|Looping
Tunnel|Tunnel|Túnel|Galleria|Tunnel
Röhre|Pipe|Tubo|Tubo|Tube
Röhren-Einfahrt|Pipe entrance|Entrada de tubo|Ingresso del tubo|Entrée de tube
Asphaltkreuzung|Asphalt intersection|Cruce de asfalto|Incrocio asfaltato|Intersection en asphalte
Versatz links|Left offset|Desplazamiento a la izquierda|Spostamento a sinistra|Décalage à gauche
Versatz rechts|Right offset|Desplazamiento a la derecha|Spostamento a destra|Décalage à droite
Halfpipe|Half-pipe|Halfpipe|Halfpipe|Half-pipe
Korkenzieher quer|Crosswise corkscrew|Sacacorchos transversal|Cavatappi trasversale|Vrille transversale
Massive Brückenrampe|Solid bridge ramp|Rampa de puente maciza|Rampa piena del ponte|Rampe de pont pleine
Massive Hochstraße|Solid elevated road|Carretera elevada maciza|Strada sopraelevata piena|Route surélevée pleine
Überführung|Overpass|Paso elevado|Cavalcavia|Passage supérieur
Brückenstück|Bridge section|Tramo de puente|Tratto di ponte|Section de pont
Hochkurve|Elevated corner|Curva elevada|Curva sopraelevata|Virage surélevé
Autobahn|Highway|Autopista|Autostrada|Autoroute
Autobahn-Einfahrt|Highway entrance|Entrada de autopista|Ingresso autostrada|Entrée d’autoroute
Slalom|Slalom|Eslalon|Slalom|Slalom
Korkenzieher längs|Lengthwise corkscrew|Sacacorchos longitudinal|Cavatappi longitudinale|Vrille longitudinale
Schotterkreuzung|Dirt intersection|Cruce de tierra|Incrocio sterrato|Intersection en terre
Eiskreuzung|Ice intersection|Cruce de hielo|Incrocio ghiacciato|Intersection sur glace
Palme|Palm tree|Palmera|Palma|Palmier
Kaktus|Cactus|Cactus|Cactus|Cactus
Baum|Tree|Árbol|Albero|Arbre
Tennisplatz|Tennis court|Pista de tenis|Campo da tennis|Court de tennis
Tankstelle|Gas station|Gasolinera|Distributore|Station-service
Scheune|Barn|Granero|Fienile|Grange
Bürohaus|Office building|Edificio de oficinas|Edificio per uffici|Immeuble de bureaux
Windmühle|Windmill|Molino de viento|Mulino a vento|Moulin à vent
Boot|Boat|Barco|Barca|Bateau
Restaurant|Restaurant|Restaurante|Ristorante|Restaurant
Asphaltstraße am Hang|Asphalt road on slope|Carretera asfaltada en pendiente|Strada asfaltata in pendenza|Route asphaltée en pente
Gras|Grass|Hierba|Erba|Herbe
Wasser|Water|Agua|Acqua|Eau
Ufer Südwest|Southwest shore|Orilla suroeste|Riva sudovest|Rive sud-ouest
Ufer Südost|Southeast shore|Orilla sureste|Riva sudest|Rive sud-est
Ufer Nordost|Northeast shore|Orilla noreste|Riva nordest|Rive nord-est
Ufer Nordwest|Northwest shore|Orilla noroeste|Riva nordovest|Rive nord-ouest
Hochebene|Plateau|Meseta|Altopiano|Plateau
Hang Nord|North slope|Pendiente norte|Pendio nord|Pente nord
Hang West|West slope|Pendiente oeste|Pendio ovest|Pente ouest
Hang Süd|South slope|Pendiente sur|Pendio sud|Pente sud
Hang Ost|East slope|Pendiente este|Pendio est|Pente est
Hügelaußenecke Nordwest|Northwest outer hill corner|Esquina exterior de colina noroeste|Angolo esterno della collina nordovest|Coin extérieur de colline nord-ouest
Hügelaußenecke Südwest|Southwest outer hill corner|Esquina exterior de colina suroeste|Angolo esterno della collina sudovest|Coin extérieur de colline sud-ouest
Hügelaußenecke Südost|Southeast outer hill corner|Esquina exterior de colina sureste|Angolo esterno della collina sudest|Coin extérieur de colline sud-est
Hügelaußenecke Nordost|Northeast outer hill corner|Esquina exterior de colina noreste|Angolo esterno della collina nordest|Coin extérieur de colline nord-est
Hügelinnenecke Nordwest|Northwest inner hill corner|Esquina interior de colina noroeste|Angolo interno della collina nordovest|Coin intérieur de colline nord-ouest
Hügelinnenecke Südwest|Southwest inner hill corner|Esquina interior de colina suroeste|Angolo interno della collina sudovest|Coin intérieur de colline sud-ouest
Hügelinnenecke Südost|Southeast inner hill corner|Esquina interior de colina sureste|Angolo interno della collina sudest|Coin intérieur de colline sud-est
Hügelinnenecke Nordost|Northeast inner hill corner|Esquina interior de colina noreste|Angolo interno della collina nordest|Coin intérieur de colline nord-est
Eigenständiger HD-Streckeneditor für Stunts: scharfe Vektorkarte, Bauteilpalette und lokaler TRK-Import und -Export.|Standalone HD track editor for Stunts: sharp vector map, piece palette and local TRK import and export.|Editor HD independiente para Stunts: mapa vectorial nítido, paleta de piezas e importación y exportación local de TRK.|Editor HD indipendente per Stunts: mappa vettoriale nitida, tavolozza degli elementi e importazione ed esportazione locale TRK.|Éditeur HD autonome pour Stunts : carte vectorielle nette, palette des éléments, import et export local TRK.
Spielansicht|Game view|Vista del juego|Vista di gioco|Vue du jeu
Spielansicht schließen|Close game view|Cerrar vista del juego|Chiudi vista di gioco|Fermer la vue du jeu
LIVE|LIVE|EN VIVO|LIVE|EN DIRECT
Streckenvorschau in originaler Spielgrafik|Track preview with original game graphics|Vista previa del circuito con los gráficos originales|Anteprima della pista con la grafica originale|Aperçu du circuit avec les graphismes d’origine
Originale Streckenvorschau|Original track preview|Vista previa original del circuito|Anteprima originale della pista|Aperçu original du circuit
Die Vorschau folgt deinen Änderungen live.|The preview follows your edits live.|La vista previa refleja tus cambios en vivo.|L’anteprima segue le modifiche in tempo reale.|L’aperçu reflète vos modifications en direct.
Spielgrafik wird geladen…|Loading game graphics…|Cargando gráficos del juego…|Caricamento della grafica di gioco…|Chargement des graphismes du jeu…
Unbekannte oder ungültige Felder werden nur in der Vorschau vereinfacht.|Unknown or invalid tiles are simplified in the preview only.|Las casillas desconocidas o no válidas se simplifican solo en la vista previa.|Le caselle sconosciute o non valide vengono semplificate solo nell’anteprima.|Les cases inconnues ou invalides sont simplifiées uniquement dans l’aperçu.
Spielansicht nicht verfügbar. Bitte einen aktuellen Browser verwenden.|Game view unavailable. Please use a current browser.|Vista del juego no disponible. Usa un navegador actualizado.|Vista di gioco non disponibile. Usa un browser aggiornato.|Vue du jeu indisponible. Veuillez utiliser un navigateur récent.
„Spielansicht“ zeigt deine Strecke mit der Originalgrafik aus der Streckenauswahl. Bauteile, Höhen und Landschaft aktualisieren sich beim Bearbeiten automatisch. Die Vorschau funktioniert auch offline.|“Game view” shows your track with the original track-selection graphics. Pieces, elevations and scenery update automatically as you edit. The preview works offline too.|«Vista del juego» muestra tu circuito con los gráficos originales de la selección de circuitos. Las piezas, alturas y paisajes se actualizan automáticamente al editar. La vista previa también funciona sin conexión.|“Vista di gioco” mostra la pista con la grafica originale della selezione piste. Elementi, altezze e paesaggio si aggiornano automaticamente durante le modifiche. L’anteprima funziona anche offline.|« Vue du jeu » affiche votre circuit avec les graphismes originaux de la sélection des circuits. Éléments, relief et décor se mettent à jour automatiquement pendant l’édition. L’aperçu fonctionne aussi hors ligne.
Spielprüfung bestanden · vollständige Runde.|Game check passed · complete circuit.|Prueba del juego superada · circuito completo.|Verifica del gioco superata · circuito completo.|Vérification du jeu réussie · circuit complet.
Die Strecke kann noch nicht gestartet werden.|The track cannot be started yet.|El circuito aún no puede iniciarse.|La pista non può ancora essere avviata.|Le circuit ne peut pas encore être lancé.
Prüfergebnis|Check result|Resultado|Risultato|Résultat
Fehler anzeigen|Show errors|Mostrar errores|Mostra errori|Afficher les erreurs
Strecke wird geprüft…|Checking track…|Comprobando circuito…|Verifica della pista…|Vérification du circuit…
Als Entwurf im Spiel speichern|Save as a draft in the game|Guardar como borrador en el juego|Salva come bozza nel gioco|Enregistrer comme brouillon dans le jeu
X {x}, Y {y} · {message}|X {x}, Y {y} · {message}|X {x}, Y {y} · {message}|X {x}, Y {y} · {message}|X {x}, Y {y} · {message}
Klicke auf die Koordinaten, um die Fehlerstelle auf der Karte zu zeigen. Die Spielprüfung meldet den ersten Fehler im Streckenverlauf; prüfe nach der Korrektur erneut.|Click the coordinates to show the error on the map. The game check reports the first route error; check again after fixing it.|Pulsa las coordenadas para mostrar el error en el mapa. La prueba informa del primer error del recorrido; comprueba de nuevo tras corregirlo.|Fai clic sulle coordinate per mostrare l’errore sulla mappa. La verifica segnala il primo errore del percorso; ripetila dopo la correzione.|Cliquez sur les coordonnées pour afficher l’erreur sur la carte. La vérification signale la première erreur du parcours ; relancez-la après correction.
Gerade auf einem Gelände-Hang. Die Höhe kommt vom Gelände; gespeichert wird normale Asphaltstraße.|Straight road on sloped terrain. Height comes from the terrain; saved as an ordinary paved road.|Recta sobre terreno inclinado. La altura procede del terreno; se guarda como carretera asfaltada normal.|Rettilineo su terreno in pendenza. L’altezza dipende dal terreno; viene salvato come normale strada asfaltata.|Route droite sur une pente. La hauteur vient du terrain ; enregistrée comme une route asphaltée normale.
Übergang zwischen normaler Straße und Röhre. Zum Ausfahren um 180° drehen.|Transition between ordinary road and pipe. Rotate 180° for an exit.|Transición entre carretera normal y tubo. Gira 180° para una salida.|Transizione tra strada normale e tubo. Ruota di 180° per un’uscita.|Transition entre route normale et tube. Tournez de 180° pour une sortie.
An beiden Enden mit einem Röhren-Übergang anschließen.|Connect a pipe transition at both ends.|Coloca una transición de tubo en ambos extremos.|Collega una transizione per tubo a entrambe le estremità.|Placez une transition pour tube à chaque extrémité.
Hohes Ende zur Hochstraße, niedriges Ende zur normalen Straße.|High end toward elevated road, low end toward ordinary road.|Extremo alto hacia la carretera elevada, extremo bajo hacia la carretera normal.|Estremità alta verso la strada sopraelevata, estremità bassa verso la strada normale.|Extrémité haute vers la route surélevée, extrémité basse vers la route normale.
{count} ältere Hangstücke werden beim Speichern automatisch ins originale TRK-Format umgewandelt.|{count} legacy slope pieces will be converted to the original TRK format when saved.|{count} piezas de pendiente antiguas se convertirán al formato TRK original al guardar.|{count} vecchi elementi in pendenza verranno convertiti nel formato TRK originale al salvataggio.|{count} anciens éléments de pente seront convertis au format TRK original à l’enregistrement.
Wähle eine der fünf Landschaften, bevor du die Strecke im Spiel fährst.|Choose one of the five scenery options before driving the track in the game.|Elige uno de los cinco paisajes antes de conducir en el juego.|Scegli uno dei cinque paesaggi prima di guidare sulla pista nel gioco.|Choisissez l’un des cinq paysages avant de rouler sur le circuit dans le jeu.
Start-/Ziellinie fehlt.|Start/finish line is missing.|Falta la línea de salida/meta.|Manca la linea di partenza/arrivo.|La ligne de départ/arrivée manque.
Das Bauteil ist aus dieser Richtung nicht verbunden.|This piece is not connected from this direction.|Esta pieza no conecta desde esta dirección.|Questo elemento non è collegato da questa direzione.|Cet élément n’est pas relié dans cette direction.
Mehrere Start-/Ziellinien: Verwende genau eine.|Multiple start/finish lines: use exactly one.|Hay varias líneas de salida/meta: utiliza solo una.|Più linee di partenza/arrivo: usane una sola.|Plusieurs lignes de départ/arrivée : utilisez-en une seule.
Die Anschlüsse passen nicht zusammen. Prüfe Höhe und Ausrichtung der Übergangsstücke.|The connections do not match. Check the height and orientation of the transitions.|Las conexiones no coinciden. Revisa la altura y orientación de las transiciones.|I collegamenti non corrispondono. Controlla altezza e orientamento delle transizioni.|Les raccords ne correspondent pas. Vérifiez la hauteur et l’orientation des transitions.
Die Strecke erlaubt eine Fahrt in Gegenrichtung. Prüfe die Verzweigungen.|The track allows travel in the wrong direction. Check the branches.|El circuito permite circular en sentido contrario. Revisa las bifurcaciones.|La pista permette di procedere contromano. Controlla le diramazioni.|Le circuit permet de rouler à contresens. Vérifiez les embranchements.
Zu viele Bauteile im Streckenverlauf.|Too many pieces in the route.|Hay demasiadas piezas en el recorrido.|Troppi elementi nel percorso.|Trop d’éléments dans le parcours.
Die Fahrbahn endet hier. Verbinde sie zu einer vollständigen Runde bis zum Ziel.|The road ends here. Connect a complete circuit back to the finish.|La carretera termina aquí. Conecta un circuito completo hasta la meta.|La strada termina qui. Collega un circuito completo fino al traguardo.|La route s’arrête ici. Reliez un circuit complet jusqu’à l’arrivée.
Zu viele Verzweigungen. Vereinfache den Streckenverlauf.|Too many branches. Simplify the route.|Hay demasiadas bifurcaciones. Simplifica el recorrido.|Troppe diramazioni. Semplifica il percorso.|Trop d’embranchements. Simplifiez le parcours.
Die Gerade vor dem Sprung ist zu kurz.|The straight before the jump is too short.|La recta antes del salto es demasiado corta.|Il rettilineo prima del salto è troppo corto.|La ligne droite avant le saut est trop courte.
Die Sprunglücke ist zu lang. Es darf nur ein Feld übersprungen werden.|The jump gap is too long. Only one tile may be jumped.|El hueco del salto es demasiado largo. Solo se puede saltar una casilla.|Il salto è troppo lungo. Si può saltare una sola casella.|Le saut est trop long. Une seule case peut être franchie.
Benachbarte Geländekanten passen nicht zusammen. Prüfe die angrenzenden Hügel und Hänge.|Adjacent terrain edges do not match. Check neighboring hills and slopes.|Los bordes del terreno no coinciden. Revisa las colinas y pendientes vecinas.|I bordi del terreno non corrispondono. Controlla colline e pendii adiacenti.|Les bords du terrain ne correspondent pas. Vérifiez les collines et pentes voisines.
Die Spielprüfung konnte keinen gültigen Streckenverlauf finden.|The game check could not find a valid route.|La prueba no ha encontrado un recorrido válido.|La verifica non ha trovato un percorso valido.|La vérification n’a pas trouvé de parcours valide.
Röhrenausfahrt fehlt oder ist falsch gedreht. Setze ein Übergangsstück zwischen Röhre und normaler Straße.|Pipe exit is missing or rotated incorrectly. Place a transition between pipe and ordinary road.|La salida del tubo falta o está mal girada. Coloca una transición entre el tubo y la carretera normal.|L’uscita del tubo manca o è ruotata male. Inserisci una transizione tra tubo e strada normale.|La sortie du tube manque ou est mal orientée. Placez une transition entre le tube et la route normale.
Die Brückenrampe ist falsch angeschlossen. Ihr hohes Ende muss zur Hochstraße zeigen; drehe sie bei Bedarf um 180°.|The bridge ramp is connected incorrectly. Its high end must face the elevated road; rotate it 180° if needed.|La rampa del puente está mal conectada. Su extremo alto debe apuntar a la carretera elevada; gírala 180° si hace falta.|La rampa del ponte è collegata male. L’estremità alta deve essere rivolta alla strada sopraelevata; ruotala di 180° se necessario.|La rampe du pont est mal raccordée. Son extrémité haute doit viser la route surélevée ; tournez-la de 180° si nécessaire.
Röhren-Einfahrt fehlt oder ist falsch gedreht. Normale Straße darf nicht direkt an eine geschlossene Röhre anschließen.|Pipe entrance is missing or rotated incorrectly. Ordinary road cannot connect directly to a closed pipe.|La entrada del tubo falta o está mal girada. Una carretera normal no conecta directamente con un tubo cerrado.|L’ingresso del tubo manca o è ruotato male. La strada normale non può collegarsi direttamente a un tubo chiuso.|L’entrée du tube manque ou est mal orientée. Une route normale ne peut pas rejoindre directement un tube fermé.
Ein Landschaftsobjekt unterbricht die Fahrbahn. Setze hier Straße oder baue einen gültigen Sprung darüber.|A scenery object interrupts the road. Place road here or build a valid jump over it.|Un objeto del paisaje interrumpe la carretera. Coloca carretera aquí o construye un salto válido.|Un oggetto del paesaggio interrompe la strada. Inserisci una strada o costruisci un salto valido.|Un objet du décor interrompt la route. Placez une route ici ou construisez un saut valide.
Die Spielprüfung kontrolliert Gelände, Start/Ziel und den vollständigen Streckenverlauf automatisch. Fehler sind rot markiert. Klicke im Prüfergebnis auf die Koordinaten, um zur Stelle zu springen. Unfertige Strecken kannst du als Entwurf speichern.|The game check automatically validates terrain, start/finish and the complete route. Errors are marked red. Click coordinates in the result to jump to the location. Unfinished tracks can be saved as drafts.|La prueba valida automáticamente terreno, salida/meta y recorrido completo. Los errores se marcan en rojo. Pulsa las coordenadas para ir al lugar. Puedes guardar circuitos incompletos como borradores.|La verifica controlla automaticamente terreno, partenza/arrivo e percorso completo. Gli errori sono segnati in rosso. Fai clic sulle coordinate per raggiungere il punto. Puoi salvare piste incomplete come bozze.|La vérification contrôle automatiquement terrain, départ/arrivée et parcours complet. Les erreurs sont marquées en rouge. Cliquez sur les coordonnées pour atteindre le point. Les circuits inachevés peuvent être enregistrés comme brouillons.
Röhren brauchen Übergangsstücke zur normalen Straße. Bei Brückenrampen muss das hohe Ende zur Hochstraße zeigen. Eine Hangstraße erhält ihre Höhe vom Gelände und wird als normale Gerade gespeichert.|Pipes need transitions to ordinary road. A bridge ramp’s high end must face the elevated road. A sloped road gets its height from the terrain and is saved as an ordinary straight.|Los tubos necesitan transiciones a la carretera normal. El extremo alto de una rampa debe apuntar a la carretera elevada. La altura de una carretera inclinada procede del terreno y se guarda como recta normal.|I tubi richiedono transizioni alla strada normale. L’estremità alta delle rampe deve essere rivolta alla strada sopraelevata. L’altezza delle strade in pendenza dipende dal terreno e sono salvate come normali rettilinei.|Les tubes nécessitent des transitions vers la route normale. L’extrémité haute des rampes doit viser la route surélevée. La hauteur d’une route en pente vient du terrain ; elle est enregistrée comme une ligne droite normale.
Dieses Bauteil passt nicht zum Gelände-Hang. Verwende eine Gerade oder passende Rampe entlang der Steigung.|This piece does not fit the terrain slope. Use a straight or suitable ramp along the slope.|Esta pieza no encaja con la pendiente. Usa una recta o rampa adecuada en la dirección de la pendiente.|Questo elemento non si adatta al pendio. Usa un rettilineo o una rampa adatta lungo la pendenza.|Cet élément ne convient pas à la pente. Utilisez une ligne droite ou une rampe adaptée dans le sens de la pente.
Anschlüsse|Connections|Conexiones|Collegamenti|Raccords
Abschnitt wählen|Select section|Seleccionar sección|Seleziona sezione|Sélectionner une section
Höhenansicht|Height profile|Perfil de altura|Profilo altimetrico|Profil d’altitude
Teststart exportieren|Export test start|Exportar salida de prueba|Esporta partenza di prova|Exporter le départ d’essai
Grün: verbunden · Rot: unpassend · Blau: offen · H: hoch · R: Röhre · S: Steilwand|Green: connected · Red: mismatch · Blue: open · H: elevated · R: pipe · S: banked|Verde: conectado · Rojo: incompatible · Azul: abierto · H: elevado · R: tubo · S: peralte|Verde: collegato · Rosso: incompatibile · Blu: aperto · H: sopraelevato · R: tubo · S: sopraelevazione|Vert : relié · Rouge : incompatible · Bleu : ouvert · H : surélevé · R : tube · S : virage relevé
Kopieren|Copy|Copiar|Copia|Copier
Abschnitt verschieben|Move section|Mover sección|Sposta sezione|Déplacer la section
Abschnitt drehen|Rotate section|Girar sección|Ruota sezione|Tourner la section
Gelände mitnehmen|Include terrain|Incluir terreno|Includi terreno|Inclure le terrain
Ziel ersetzen|Replace destination|Reemplazar destino|Sostituisci destinazione|Remplacer la destination
Auswahl aufheben|Clear selection|Quitar selección|Cancella selezione|Effacer la sélection
Weitere Anschlussprobleme|Additional connection problems|Otros problemas de conexión|Altri problemi di collegamento|Autres problèmes de raccordement
Lokale Hinweise prüfen auch unbefahrene Abschnitte. Die Spielprüfung entscheidet, ob der Rundkurs startbar ist.|Local hints also check unused sections. The game check determines whether the circuit can be driven.|Los avisos locales también revisan secciones sin utilizar. La prueba del juego determina si el circuito se puede conducir.|I suggerimenti locali controllano anche sezioni inutilizzate. La verifica del gioco determina se il circuito è percorribile.|Les indications locales vérifient aussi les sections inutilisées. La vérification du jeu détermine si le circuit est praticable.
Abschnitt: {width} × {height} Felder · {count} Bauteile|Section: {width} × {height} cells · {count} pieces|Sección: {width} × {height} casillas · {count} piezas|Sezione: {width} × {height} caselle · {count} elementi|Section : {width} × {height} cases · {count} éléments
Ziehe einen Rahmen um den Abschnitt.|Drag a rectangle around the section.|Arrastra un marco alrededor de la sección.|Trascina un rettangolo intorno alla sezione.|Tracez un rectangle autour de la section.
Ziel auf der Karte wählen · Escape bricht ab.|Choose a destination on the map · Escape cancels.|Elige un destino en el mapa · Escape cancela.|Scegli una destinazione sulla mappa · Escape annulla.|Choisissez une destination sur la carte · Échap annule.
Teststart X {x}, Y {y} exportiert · Originalstrecke bleibt erhalten.|Test start X {x}, Y {y} exported · Original track preserved.|Salida de prueba X {x}, Y {y} exportada · Circuito original conservado.|Partenza di prova X {x}, Y {y} esportata · Pista originale conservata.|Départ d’essai X {x}, Y {y} exporté · Circuit d’origine conservé.
Gerader Schnitt durch die Auswahl oder das markierte Feld. Höhen sind schematisch; eine Testfahrt prüft das Fahrverhalten.|Straight cross-section through the selection or marked cell. Heights are schematic; a test drive checks driving behavior.|Corte recto por la selección o casilla marcada. Las alturas son esquemáticas; una prueba verifica la conducción.|Sezione rettilinea attraverso la selezione o casella indicata. Le altezze sono schematiche; una prova verifica il comportamento di guida.|Coupe droite dans la sélection ou la case indiquée. Les hauteurs sont schématiques ; un essai vérifie le comportement de conduite.
Schnitt|Cross-section|Corte|Sezione|Coupe
West → Ost|West → East|Oeste → Este|Ovest → Est|Ouest → Est
Nord → Süd|North → South|Norte → Sur|Nord → Sud|Nord → Sud
Fahrbahn hell · Gelände grün · Koordinaten X/Y|Light road · Green terrain · X/Y coordinates|Carretera clara · Terreno verde · Coordenadas X/Y|Strada chiara · Terreno verde · Coordinate X/Y|Route claire · Terrain vert · Coordonnées X/Y
Die Fahrbahnhöhen an diesem Anschluss passen nicht zusammen.|Road heights at this connection do not match.|Las alturas de la carretera no coinciden en esta conexión.|Le altezze della strada non corrispondono in questo collegamento.|Les hauteurs de route ne correspondent pas à ce raccord.
Unpassende Anschlüsse: {first} und {second}.|Incompatible connections: {first} and {second}.|Conexiones incompatibles: {first} y {second}.|Collegamenti incompatibili: {first} e {second}.|Raccords incompatibles : {first} et {second}.
Dieser Abschnitt enthält ein fehlerhaftes Mehrfeldteil.|This section contains a malformed multi-cell piece.|Esta sección contiene una pieza multicelda defectuosa.|Questa sezione contiene un elemento multicella difettoso.|Cette section contient un élément multicasse mal formé.
Dieser Abschnitt enthält ein Bauteil ohne passende Drehrichtung.|This section contains a piece without a matching rotation.|Esta sección contiene una pieza sin rotación compatible.|Questa sezione contiene un elemento senza rotazione compatibile.|Cette section contient un élément sans rotation compatible.
Der Abschnitt passt hier nicht auf die Karte.|The section does not fit on the map here.|La sección no cabe aquí en el mapa.|La sezione non entra qui nella mappa.|La section ne tient pas ici sur la carte.
Der ursprüngliche Abschnitt wurde geändert. Wähle ihn erneut aus.|The original section has changed. Select it again.|La sección original ha cambiado. Selecciónala de nuevo.|La sezione originale è cambiata. Selezionala di nuovo.|La section d’origine a changé. Sélectionnez-la à nouveau.
Das Ziel enthält Bauteile. Aktiviere Ersetzen oder wähle eine freie Stelle.|The destination contains pieces. Enable Replace or choose an empty area.|El destino contiene piezas. Activa Reemplazar o elige una zona vacía.|La destinazione contiene elementi. Attiva Sostituisci o scegli un’area libera.|La destination contient des éléments. Activez Remplacer ou choisissez une zone libre.
Korrigiere die Strecke vor dem Teststart.|Fix the track before starting a test drive.|Corrige el circuito antes de la prueba.|Correggi la pista prima della prova.|Corrigez le circuit avant l’essai.
Vor dieser Stelle wurde keine geeignete Gerade für den Teststart gefunden.|No suitable straight for a test start was found before this location.|No se encontró una recta adecuada para la salida de prueba antes de este punto.|Non è stato trovato un rettilineo adatto alla partenza di prova prima di questo punto.|Aucune ligne droite adaptée au départ d’essai n’a été trouvée avant cet endroit.
Abschnitt eingesetzt.|Section placed.|Sección colocada.|Sezione inserita.|Section placée.
Testfahrt ab hier|Test drive from here|Probar desde aquí|Prova da qui|Essai depuis ici
Temporärer Start auf einer geeigneten Geraden vor der markierten Stelle: X {x}, Y {y}. Die Originalstrecke wird nicht überschrieben.|Temporary start on a suitable straight before the marked location: X {x}, Y {y}. The original track is preserved.|Salida temporal en una recta adecuada antes del punto marcado: X {x}, Y {y}. Se conserva el circuito original.|Partenza temporanea su un rettilineo adatto prima del punto indicato: X {x}, Y {y}. La pista originale è conservata.|Départ temporaire sur une ligne droite adaptée avant le point indiqué : X {x}, Y {y}. Le circuit d’origine est conservé.
Testfahrt starten|Start test drive|Iniciar prueba|Avvia prova|Démarrer l’essai
Zeile / Spalte|Row / column|Fila / columna|Riga / colonna|Ligne / colonne
Die Steilwand liegt auf unterschiedlichen Fahrbahnseiten.|The banking is on opposite sides of the road.|El peralte está en lados opuestos de la carretera.|La sopraelevazione è su lati opposti della strada.|Le relevé se trouve sur des côtés opposés de la route.
`;
export const MESSAGES = Object.freeze(Object.fromEntries(rows.trim().split('\n').map(row=>{
 const [key,...values]=row.split('|');
 if(values.length!==4||values.some(v=>!v))throw Error(`Incomplete translation: ${key}`);
 return [key,Object.freeze(Object.fromEntries(['de','en','es','it','fr'].map((code,i)=>[code,i===0?key:values[i-1]])))];
})));
export function t(key,values={}) {
 const text=MESSAGES[key]?.[language]??key;
 return text.replace(/\{(\w+)\}/g,(match,name)=>Object.hasOwn(values,name)?String(values[name]):match);
}
export function pieceName(piece){return piece?.name.split(' · ').map(name=>t(name)).join(' · ')??'';}

export const tr=t;

export function translatedError(key,values={}){const error=new Error(tr(key,values));error.translation={key,values};return error;}
