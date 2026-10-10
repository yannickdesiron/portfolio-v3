/**
 * Genereert de volledige iconenset uit één bron.
 *
 *   npm run icons            → bouwt het actieve merk (zie ACTIEF hieronder)
 *   npm run icons -- yd-getypt
 *   npm run icons -- yd-pixels
 *
 * Alles komt hier vandaan: favicon.svg, favicon.ico (16/32/48),
 * apple-touch-icon, de twee manifest-iconen en site.webmanifest. Een
 * wijziging aan het merk is dus één regel hier, niet zes bestanden met de
 * hand.
 */
import sharp from 'sharp';
import { writeFile } from 'node:fs/promises';

const ACTIEF = 'y'; // 'y' | 'yd-getypt' | 'yd-pixels'

const INK = '#1c1917';
const PAPER = '#fafaf9';
const ACCENT = '#ea580c';

/**
 * De lijndikte loopt mee met het formaat. Op 16 pixels vervaagt een dunne
 * diagonaal tot grijs; op 512 wordt een dikke lijn juist plomp. Vergeleken
 * op ware grootte: 3.4 te licht, 5.0 slibt de vork dicht, 4.2 klopt.
 */
const lijndikte = (size) => (size <= 16 ? 4.2 : size <= 48 ? 3.7 : 3.4);

/** 5×7 pixelletters, zoals een bitmapfont. */
const Y5 = ['X...X', 'X...X', '.X.X.', '..X..', '..X..', '..X..', '..X..'];
const D5 = ['XXXX.', 'X...X', 'X...X', 'X...X', 'X...X', 'X...X', 'XXXX.'];

const pixels = (glyph, x0, y0, cel = 2, gap = 0) =>
  glyph
    .flatMap((regel, r) =>
      [...regel].map((teken, c) =>
        teken === 'X'
          ? `<rect x="${x0 + c * cel}" y="${y0 + r * cel}" width="${cel - gap}" height="${cel - gap}" fill="${PAPER}"/>`
          : '',
      ),
    )
    .join('');

/**
 * De drie uitgewerkte richtingen. Elke tekening vult een vierkant van 32,
 * zodat ze onderling inwisselbaar zijn.
 *
 * Let op bij 'yd-getypt': die gebruikt een <text>-element, dus de letters
 * worden getekend met het lettertype van de machine die dit script draait.
 * Wordt dat ooit het actieve merk, zet de letters dan eerst om naar paden —
 * anders ziet het icoon er op een andere computer anders uit.
 */
const MERKEN = {
  y: {
    label: 'Alleen de Y',
    teken: (size) =>
      `<path d="M8 8l8 9 8-9M16 17v8" stroke="${PAPER}" stroke-width="${lijndikte(size)}" fill="none" stroke-linecap="square"/>`,
  },
  'yd-getypt': {
    label: 'YD getypt, met ronde punt',
    teken: () =>
      `<text x="14" y="22" font-family="Verdana, system-ui, sans-serif" font-size="14" font-weight="bold" fill="${PAPER}" text-anchor="middle" letter-spacing="-1">YD</text>` +
      `<circle cx="26" cy="21" r="2.6" fill="${ACCENT}"/>`,
  },
  'yd-pixels': {
    label: 'YD uit pixels, dicht aaneen',
    teken: () =>
      pixels(Y5, 3, 9) + pixels(D5, 15, 9) + `<rect x="27" y="21" width="2" height="2" fill="${ACCENT}"/>`,
  },
};

const keuze = process.argv[2] ?? ACTIEF;
const merk = MERKEN[keuze];
if (!merk) {
  console.error(`Onbekend merk "${keuze}". Keuzes: ${Object.keys(MERKEN).join(', ')}`);
  process.exit(1);
}

/**
 * rx=7 geeft de afronding die een browser-tab verwacht. De apple-touch-icon
 * krijgt vierkante hoeken, want iOS legt er zelf een masker overheen — rond
 * je zelf af, dan rond je twee keer af.
 */
const svg = (size, { rx = 7 } = {}) =>
  `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">` +
  `<rect width="32" height="32" rx="${rx}" fill="${INK}"/>${merk.teken(size)}</svg>`;

const png = (size, opts) =>
  sharp(Buffer.from(svg(size, opts)), { density: 512 })
    .resize(size, size)
    .png({ compressionLevel: 9 })
    .toBuffer();

/** Een ico is een simpele container; sinds Vista mogen er PNG's in. */
function ico(entries) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(1, 2); // type 1 = icoon
  header.writeUInt16LE(entries.length, 4);

  const dir = Buffer.alloc(16 * entries.length);
  let offset = header.length + dir.length;
  entries.forEach(({ size, data }, i) => {
    const p = i * 16;
    dir.writeUInt8(size >= 256 ? 0 : size, p); // breedte (0 betekent 256)
    dir.writeUInt8(size >= 256 ? 0 : size, p + 1); // hoogte
    dir.writeUInt16LE(1, p + 4); // kleurvlakken
    dir.writeUInt16LE(32, p + 6); // bits per pixel
    dir.writeUInt32LE(data.length, p + 8);
    dir.writeUInt32LE(offset, p + 12);
    offset += data.length;
  });

  return Buffer.concat([header, dir, ...entries.map((e) => e.data)]);
}

const out = 'public';

// De svg in de tab wordt vooral klein getoond, dus de middelste lijndikte.
await writeFile(`${out}/favicon.svg`, svg(32));

const entries = [];
for (const size of [16, 32, 48]) entries.push({ size, data: await png(size) });
await writeFile(`${out}/favicon.ico`, ico(entries));

await writeFile(`${out}/apple-touch-icon.png`, await png(180, { rx: 0 }));
await writeFile(`${out}/icon-192.png`, await png(192));
await writeFile(`${out}/icon-512.png`, await png(512));

await writeFile(
  `${out}/site.webmanifest`,
  JSON.stringify(
    {
      name: 'Yannick Desiron — Full-stack Developer',
      short_name: 'Yannick Desiron',
      icons: [
        { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      ],
      theme_color: INK,
      background_color: INK,
      display: 'standalone',
      start_url: '/',
    },
    null,
    2,
  ) + '\n',
);

console.log(`Iconen gebouwd met "${keuze}" — ${merk.label}`);
console.log('favicon.svg, favicon.ico, apple-touch-icon.png, icon-192.png, icon-512.png, site.webmanifest');
