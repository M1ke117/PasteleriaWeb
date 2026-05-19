import fs from 'fs';
import path from 'path';

const publicImagesDir = path.join(process.cwd(), 'public', 'images');
if (!fs.existsSync(publicImagesDir)) {
  fs.mkdirSync(publicImagesDir, { recursive: true });
}

const imagesToCopy = [
  { src: "C:/Users/AVH-COM-330/.gemini/antigravity/brain/adacf84f-06ac-4e01-bc1e-3553a5b4b551/rosca_reyes_1779214703666.png", dest: "rosca.png" },
  { src: "C:/Users/AVH-COM-330/.gemini/antigravity/brain/adacf84f-06ac-4e01-bc1e-3553a5b4b551/gelatina_mosaico_1779214717539.png", dest: "gelatina.png" }
];

imagesToCopy.forEach(img => {
  if (fs.existsSync(img.src)) {
    fs.copyFileSync(img.src, path.join(publicImagesDir, img.dest));
    console.log(`Copiada: ${img.dest}`);
  } else {
    console.log(`No encontrada: ${img.src}`);
  }
});
console.log("¡Nuevas imágenes movidas exitosamente a public/images!");
