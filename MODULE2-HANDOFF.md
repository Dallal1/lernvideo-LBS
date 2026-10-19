# Modul 2 – Übergabe für Jellyfin

Die acht Einträge und lokal gespeicherten Vorschaubilder sind bereits eingebunden. Modul 1 (`webapp/videos`) bleibt unverändert.

## Dateien

- `webapp/module2/models/catalog.json`: einzige Datenquelle; Titel, Beschreibung, Thema, Sprache, Jahr, Thumbnail, Originalvideo, Quelle und Lizenz.
- `webapp/module2/controllers/Module2.controller.ts`: Suche, Filter und Platzhalter für Ansehen.
- `webapp/module2/views/Module2.view.xml`: Oberfläche.
- `webapp/module2/images/`: lokale Original-Thumbnails.

## Videolinks

### Course Overview + The Shell

- ID: `course-shell`
- Video: https://www.youtube.com/watch?v=Z56Jmr9Z34Q
- Quelle: https://missing.csail.mit.edu/2020/course-shell/
- Thumbnail: `webapp/module2/images/course-shell.jpg`
- Bildquelle: https://i.ytimg.com/vi/Z56Jmr9Z34Q/hqdefault.jpg

### Shell Tools and Scripting

- ID: `shell-tools`
- Video: https://www.youtube.com/watch?v=kgII-YWo3Zw
- Quelle: https://missing.csail.mit.edu/2020/shell-tools/
- Thumbnail: `webapp/module2/images/shell-tools.jpg`
- Bildquelle: https://i.ytimg.com/vi/kgII-YWo3Zw/hqdefault.jpg

### Version Control (Git)

- ID: `version-control`
- Video: https://www.youtube.com/watch?v=2sjqTHE0zok
- Quelle: https://missing.csail.mit.edu/2020/version-control/
- Thumbnail: `webapp/module2/images/version-control.jpg`
- Bildquelle: https://i.ytimg.com/vi/2sjqTHE0zok/hqdefault.jpg

### Debugging and Profiling

- ID: `debugging-profiling`
- Video: https://www.youtube.com/watch?v=l812pUnKxME
- Quelle: https://missing.csail.mit.edu/2020/debugging-profiling/
- Thumbnail: `webapp/module2/images/debugging-profiling.jpg`
- Bildquelle: https://i.ytimg.com/vi/l812pUnKxME/hqdefault.jpg

### Security and Cryptography

- ID: `security`
- Video: https://www.youtube.com/watch?v=tjwobAmnKTo
- Quelle: https://missing.csail.mit.edu/2020/security/
- Thumbnail: `webapp/module2/images/security.jpg`
- Bildquelle: https://i.ytimg.com/vi/tjwobAmnKTo/hqdefault.jpg

## Nächster Schritt für Jellyfin

`videoUrl` ist der Original-Link auf YouTube, kein direkter Stream und keine Jellyfin-ID. `jellyfinUrl` ist absichtlich leer. Der Ansehen-Handler öffnet derzeit keinen Player und keinen externen Link; er zeigt nur eine kurze Nachricht. Der Freund übernimmt Import/Zuordnung in Jellyfin und implementiert danach den Handler mit der passenden Jellyfin-Adresse. Das bloße Ausfüllen von jellyfinUrl aktiviert noch keine Wiedergabe.

Neue Katalogeinträge können in catalog.json ergänzt werden; Thema-Filter entstehen automatisch. Bilder unter images ablegen und den relativen Pfad angeben. Keine Videodateien hochladen.

## Lizenz und Bildnachweise der fünf englischen Videos

Urheber/Quelle: Missing Semester. Englisch, Kursjahr 2020. Die offizielle Lizenzseite schließt Vorlesungsvideos ausdrücklich ein: https://missing.csail.mit.edu/license/ . Lizenz: CC BY-NC-SA 4.0, https://creativecommons.org/licenses/by-nc-sa/4.0/ . Nur nichtkommerziell verwenden, Urheber, Quelle und Lizenz beibehalten, Änderungen kennzeichnen und Bearbeitungen unter derselben Lizenz weitergeben. Die Vorschaubilder stammen von den verlinkten Originalvideos; die Dateien wurden unverändert übernommen. Die Oberfläche schneidet sie lediglich auf das Kartenformat zu.

## Start

`npm start`, dann http://localhost:8081/index.html#/module2 . Für Modul 2 wird kein Backend benötigt.

## Anzeigename und ausgeblendetes Modul

Modul 2 heißt in der Oberfläche jetzt Videos und verwendet dieselben Video-Icons wie Modul 1. Die alte Home-Karte und der alte Navigationseintrag haben `visible="false"` (UI5-Ausblendung). Modul 1 wurde nicht gelöscht; seine Dateien und Route `#/videos` bleiben erhalten. Der sichtbare Videos-Eintrag öffnet weiterhin `#/module2`.

## Drei deutsche Videos (ergänzt)

Die englischen Einträge bleiben erhalten. Sprache über `Deutsch` bzw. `Englisch` filtern. Diese deutschen Aufzeichnungen tragen in den offiziellen Veranstaltungsmetadaten ausdrücklich CC BY 4.0. Urheber, Quelle und Lizenz nennen und Änderungen kennzeichnen. Anders als bei den englischen Videos besteht hier keine NC-/SA-Bedingung. Die Original-Vorschaubilder wurden unverändert gespeichert.

### Grundlagen der Netzwerkverwaltung in Linux

- Sprache: Deutsch; Jahr: 2025
- Urheber: Joshua Kobschätzki · Chemnitzer Linux-Tage
- Video/Quelle: https://media.ccc.de/v/clt25-275-grundlagen-der-netzwerkverwaltung-in-linux
- Direkte MP4-Datei für Jellyfin: https://cdn.media.ccc.de/events/clt/2025/h264-hd/clt25-12-deu-Grundlagen_der_Netzwerkverwaltung_in_Linux_hd.mp4
- Thumbnail: `webapp/module2/images/linux-netzwerke-de.jpg`
- Bildquelle: https://static.media.ccc.de/media/events/clt/2025/12-cedd8e6d-cb06-5382-baa6-bd7245869ba6_preview.jpg
- Lizenz: https://creativecommons.org/licenses/by/4.0/
- Lizenznachweis (description): https://api.media.ccc.de/public/events/cedd8e6d-cb06-5382-baa6-bd7245869ba6

### Programmiersprache Golang: Langweilig und produktiv

- Sprache: Deutsch; Jahr: 2025
- Urheber: Thomas Güttler · Chemnitzer Linux-Tage
- Video/Quelle: https://media.ccc.de/v/clt25-281-programmiersprache-golang-langweilig-und-produktiv
- Direkte MP4-Datei für Jellyfin: https://cdn.media.ccc.de/events/clt/2025/h264-hd/clt25-45-deu-Programmiersprache_Golang_Langweilig_und_produktiv_hd.mp4
- Thumbnail: `webapp/module2/images/golang-de.jpg`
- Bildquelle: https://static.media.ccc.de/media/events/clt/2025/45-d80d5381-821f-5c7a-98fb-38a8b31da94e_preview.jpg
- Lizenz: https://creativecommons.org/licenses/by/4.0/
- Lizenznachweis (description): https://api.media.ccc.de/public/events/d80d5381-821f-5c7a-98fb-38a8b31da94e

### SIMD-Programmierung: Eine Einführung

- Sprache: Deutsch; Jahr: 2025
- Urheber: Robert Clausecker · Chemnitzer Linux-Tage
- Video/Quelle: https://media.ccc.de/v/clt25-215-simd-programmierung-eine-einfuhrung
- Direkte MP4-Datei für Jellyfin: https://cdn.media.ccc.de/events/clt/2025/h264-hd/clt25-49-deu-SIMD-Programmierung_Eine_Einfuehrung_hd.mp4
- Thumbnail: `webapp/module2/images/simd-de.jpg`
- Bildquelle: https://static.media.ccc.de/media/events/clt/2025/49-706d8b4e-1d93-5409-9ab7-d27b8e724237_preview.jpg
- Lizenz: https://creativecommons.org/licenses/by/4.0/
- Lizenznachweis (description): https://api.media.ccc.de/public/events/706d8b4e-1d93-5409-9ab7-d27b8e724237

