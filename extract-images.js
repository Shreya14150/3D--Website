import fs from 'fs';
import path from 'path';

const pdfPath = 'C:/Users/Asus/.gemini/antigravity/brain/9d11d7b4-5004-41d7-8673-0f28ae656b27/.user_uploaded/media_1795430895943_104b368c.pdf';
const outDir = 'c:/Users/Asus/Desktop/3Dwebsite/public/images';

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const buf = fs.readFileSync(pdfPath);
console.log('PDF byte size:', buf.length);

let count = 0;
let pos = 0;

while (pos < buf.length - 4) {
  // Check JPEG SOI (FF D8 FF)
  if (buf[pos] === 0xFF && buf[pos + 1] === 0xD8 && buf[pos + 2] === 0xFF) {
    let end = pos + 2;
    while (end < buf.length - 1) {
      if (buf[end] === 0xFF && buf[end + 1] === 0xD9) {
        end += 2;
        break;
      }
      end++;
    }
    const imgBuf = buf.subarray(pos, end);
    if (imgBuf.length > 40000) {
      count++;
      const outPath = path.join(outDir, `aesthetic_${count}.jpg`);
      fs.writeFileSync(outPath, imgBuf);
      console.log(`Extracted image ${count}: ${(imgBuf.length / 1024).toFixed(1)} KB -> ${outPath}`);
    }
    pos = end;
  } else {
    pos++;
  }
}

console.log(`Total images extracted: ${count}`);
