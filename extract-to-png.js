import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

const pdfPath = 'C:/Users/Asus/.gemini/antigravity/brain/9d11d7b4-5004-41d7-8673-0f28ae656b27/.user_uploaded/media_1795430895943_104b368c.pdf';
const outDir = 'c:/Users/Asus/Desktop/3Dwebsite/public/images';
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

// CRC32 table
const crcTable = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let k = 0; k < 8; k++) {
    c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
  }
  crcTable[i] = c;
}

function crc32(buf) {
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xFF] ^ (crc >>> 8);
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

function makePngChunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length, 0);

  const crcBuf = Buffer.alloc(4);
  const typeAndData = Buffer.concat([typeBuf, data]);
  crcBuf.writeUInt32BE(crc32(typeAndData), 0);

  return Buffer.concat([lenBuf, typeAndData, crcBuf]);
}

function rawRgbToPng(width, height, rgbBuf) {
  const sig = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);

  // IHDR: 13 bytes
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // 8 bits per channel
  ihdrData[9] = 2; // RGB color
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace
  const ihdrChunk = makePngChunk('IHDR', ihdrData);

  // Scanlines with filter byte 0
  const rowBytes = width * 3;
  const filtered = Buffer.alloc(height * (rowBytes + 1));
  for (let y = 0; y < height; y++) {
    filtered[y * (rowBytes + 1)] = 0; // None filter
    rgbBuf.copy(filtered, y * (rowBytes + 1) + 1, y * rowBytes, (y + 1) * rowBytes);
  }

  const compressed = zlib.deflateSync(filtered, { level: 9 });
  const idatChunk = makePngChunk('IDAT', compressed);
  const iendChunk = makePngChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([sig, ihdrChunk, idatChunk, iendChunk]);
}

const fileBuf = fs.readFileSync(pdfPath);
const str = fileBuf.toString('latin1');
const re = /<<([^>]+)>>\s*stream\r?\n/g;

const names = [
  '01_kiko_style_tube.png',
  '02_model_holding_gloss.png',
  '03_wand_applicator_lips.png',
  '04_prismatic_ruby_lips.png',
  '05_holographic_sparkle_pout.png',
  '06_lip_bite_duochrome.png',
  '07_five_shades_collection.png'
];

let match;
let count = 0;

while ((match = re.exec(str)) !== null) {
  const dict = match[1];
  if (!dict.includes('/Subtype /Image')) continue;

  const wMatch = dict.match(/\/Width\s+(\d+)/);
  const hMatch = dict.match(/\/Height\s+(\d+)/);
  if (!wMatch || !hMatch) continue;

  const width = parseInt(wMatch[1], 10);
  const height = parseInt(hMatch[1], 10);

  const streamStart = match.index + match[0].length;
  const streamEnd = str.indexOf('endstream', streamStart);
  const rawStream = fileBuf.subarray(streamStart, streamEnd);

  try {
    const decompressed = zlib.inflateSync(rawStream);
    console.log(`Image ${count + 1}: ${width}x${height}, uncompressed bytes: ${decompressed.length}`);

    // If decompressed has width*height*3 bytes, it is RGB
    if (decompressed.length >= width * height * 3) {
      const pngBuf = rawRgbToPng(width, height, decompressed.subarray(0, width * height * 3));
      const filename = names[count] || `image_${count + 1}.png`;
      const outPath = path.join(outDir, filename);
      fs.writeFileSync(outPath, pngBuf);
      console.log(`✓ Saved pristine PNG: ${filename} (${(pngBuf.length / 1024).toFixed(1)} KB)`);
      count++;
    }
  } catch (err) {
    console.warn(`Failed decompressing image ${count + 1}:`, err.message);
  }
}

console.log(`Successfully extracted ${count} images from PDF!`);
