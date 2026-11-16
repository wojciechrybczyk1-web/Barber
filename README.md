# Scroolu – strona wizytówka

Strona barbera i stylisty fryzur i brody: jedna strona (HTML + CSS + JS), bez frameworków i bez zależności.
Działa na każdym zwykłym hostingu (np. Netlify, GitHub Pages, Cloudflare Pages, hosting z FTP).

## Struktura

```
index.html            treść strony
assets/styles.css     wygląd
assets/script.js      menu mobilne, filmy, galeria (powiększanie zdjęć)
assets/img/           zdjęcia (WebP w dwóch rozmiarach: -640 i -1280) + og.jpg (podgląd linku)
assets/video/         filmy MP4 (720p, bez dźwięku) + plakaty .webp
assets/fonts/         czcionki Anton i Inter (hostowane lokalnie, licencja OFL)
```

## Do uzupełnienia

W `index.html` miejsca z przykładowymi danymi są oznaczone komentarzem `TODO`:

- ceny usług,
- adres, godziny otwarcia, numer telefonu,
- adres `og:image` po podpięciu domeny.

## Dodawanie nowych zdjęć i filmów

Zdjęcia: WebP o szerokości 640 i 1280 px, np. `nazwa-640.webp` i `nazwa-1280.webp`.
Filmy z iPhone'a są nagrywane w HDR, więc przed wrzuceniem na stronę trzeba je przekonwertować do SDR,
inaczej będą wyglądać na wyblakłe:

```bash
ffmpeg -i film.mov -map 0:v:0 -an -map_metadata -1 \
  -vf "zscale=t=linear:npl=203,format=gbrpf32le,zscale=p=bt709,tonemap=tonemap=mobius:desat=0,zscale=t=bt709:m=bt709:r=tv,eq=saturation=0.94,scale=720:1280:flags=lanczos,format=yuv420p" \
  -c:v libx264 -preset slow -crf 27 -profile:v high -pix_fmt yuv420p \
  -color_primaries bt709 -color_trc bt709 -colorspace bt709 -movflags +faststart film.mp4
```

`-map_metadata -1` usuwa metadane, w tym lokalizację GPS z telefonu.

## Podgląd lokalny

```bash
python3 -m http.server 8000
# otwórz http://localhost:8000
```
