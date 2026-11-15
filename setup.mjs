// Runs once after "npm install": copies the engine and downloads the face model.
// After this, the app needs no internet.
import fs from 'node:fs';
const src = 'node_modules/@mediapipe/tasks-vision', dst = 'public/vendor';
fs.mkdirSync(dst, { recursive: true });
fs.copyFileSync(src + '/vision_bundle.mjs', dst + '/vision_bundle.mjs');
fs.cpSync(src + '/wasm', dst + '/wasm', { recursive: true });
const model = dst + '/face_landmarker.task';
if (!fs.existsSync(model)) {
  const r = await fetch('https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task');
  if (!r.ok) throw new Error('Model download failed (' + r.status + ')');
  fs.writeFileSync(model, Buffer.from(await r.arrayBuffer()));
}
console.log('Ready. Run: npm start');
