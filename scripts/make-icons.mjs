import sharp from 'sharp';
import { writeFile } from 'node:fs/promises';

const INK = '#1c1917';
const PAPER = '#fafaf9';

// De Y zoals gekozen: geen punt, vierkante uiteinden, op een donkere tegel.
// De lijndikte loopt mee met het formaat: op 16 pixels vervagen dunne
// diagonalen tot grijs, op 512 wordt een dikke lijn juist plomp.
// Vergeleken op 16px: 3.4 te licht, 5.0 slibt de vork dicht, 4.2 klopt.
const weightFor = (size) => (size <= 16 ? 4.2 : size <= 48 ? 3.7 : 3.4);

const y = (stroke, width) =>
  `<path d="M8 8l8 9 8-9M16 17v8" stroke="${stroke}" stroke-width="${width}" fill="none" stroke-linecap="square"/>`;

// rx=7 voor de browser-tab; apple-touch krijgt vierkante hoeken omdat iOS
// er zelf een masker overheen legt — anders rond je twee keer af.
const svg = ({ rx = 7, bg = INK, width = 3.7 } = {}) =>
  `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">` +
  `<rect width="32" height="32" rx="${rx}" fill="${bg}"/>${y(PAPER, width)}</svg>`;

const png = (size, opts = {}) =>
  sharp(Buffer.from(svg({ width: weightFor(size), ...opts })), { density: 384 })
    .resize(size, size).png({ compressionLevel: 9 }).toBuffer();

// ---- ICO: een container met meerdere PNG's erin -------------------------
function ico(entries) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);            // reserved
  header.writeUInt16LE(1, 2);            // type 1 = icoon
  header.writeUInt16LE(entries.length, 4);
  const dir = Buffer.alloc(16 * entries.length);
  let offset = header.length + dir.length;
  entries.forEach(({ size, data }, i) => {
    const p = i * 16;
    dir.writeUInt8(size >= 256 ? 0 : size, p);      // breedte (0 = 256)
    dir.writeUInt8(size >= 256 ? 0 : size, p + 1);  // hoogte
    dir.writeUInt8(0, p + 2);                       // kleuren in palet
    dir.writeUInt8(0, p + 3);                       // reserved
    dir.writeUInt16LE(1, p + 4);                    // kleurvlakken
    dir.writeUInt16LE(32, p + 6);                   // bits per pixel
    dir.writeUInt32LE(data.length, p + 8);
    dir.writeUInt32LE(offset, p + 12);
    offset += data.length;
  });
  return Buffer.concat([header, dir, ...entries.map((e) => e.data)]);
}

const out = 'public';
await writeFile(`${out}/favicon.svg`, svg({ width: 3.7 }));

const icoSizes = [16, 32, 48];
const icoEntries = [];
for (const size of icoSizes) icoEntries.push({ size, data: await png(size) });
await writeFile(`${out}/favicon.ico`, ico(icoEntries));

await writeFile(`${out}/apple-touch-icon.png`, await png(180, { rx: 0 }));
await writeFile(`${out}/icon-192.png`, await png(192));
await writeFile(`${out}/icon-512.png`, await png(512));

await writeFile(`${out}/site.webmanifest`, JSON.stringify({
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
}, null, 2) + '\n');

console.log('geschreven: favicon.svg, favicon.ico, apple-touch-icon.png, icon-192.png, icon-512.png, site.webmanifest');
