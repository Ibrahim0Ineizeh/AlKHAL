import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import QRCode from 'qrcode';

const [input, directory = 'qr'] = process.argv.slice(2);
let url;
try {
  url = new URL(input);
  if (url.protocol !== 'https:' || url.username || url.password) throw new Error();
} catch {
  console.error('Usage: npm run qr -- https://your-menu.vercel.app [output-directory]');
  console.error('Use the final public HTTPS address that customers should open.');
  process.exit(1);
}

const output = path.resolve(directory);
await mkdir(output, { recursive: true });
const options = { errorCorrectionLevel: 'M', margin: 4, color: { dark: '#352820', light: '#ffffff' } };
await QRCode.toFile(path.join(output, 'khal-menu-qr.png'), url.href, { ...options, width: 1200 });
await writeFile(path.join(output, 'khal-menu-qr.svg'), await QRCode.toString(url.href, { ...options, type: 'svg' }));
await writeFile(path.join(output, 'destination.txt'), `${url.href}\n`);
console.log(`QR code for ${url.href}\nSaved PNG and print-ready SVG to ${output}`);
