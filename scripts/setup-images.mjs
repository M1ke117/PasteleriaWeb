import fs from 'fs';
import path from 'path';

const publicImagesDir = path.join(process.cwd(), 'public', 'images');
if (!fs.existsSync(publicImagesDir)) {
  fs.mkdirSync(publicImagesDir, { recursive: true });
}

const imagesToCopy = [
  { src: "C:/Users/AVH-COM-330/.gemini/antigravity/brain/adacf84f-06ac-4e01-bc1e-3553a5b4b551/cake_promo_1779207895286.png", dest: "cake.png" },
  { src: "C:/Users/AVH-COM-330/.gemini/antigravity/brain/adacf84f-06ac-4e01-bc1e-3553a5b4b551/pizza_promo_1779207908451.png", dest: "pizza.png" },
  { src: "C:/Users/AVH-COM-330/.gemini/antigravity/brain/adacf84f-06ac-4e01-bc1e-3553a5b4b551/fresas_crema_1779207922932.png", dest: "fresas.png" },
  { src: "C:/Users/AVH-COM-330/.gemini/antigravity/brain/adacf84f-06ac-4e01-bc1e-3553a5b4b551/flan_promo_1779207940555.png", dest: "flan.png" },
  { src: "C:/Users/AVH-COM-330/.gemini/antigravity/brain/adacf84f-06ac-4e01-bc1e-3553a5b4b551/chocoflan_promo_1779207953779.png", dest: "chocoflan.png" },
  { src: "C:/Users/AVH-COM-330/.gemini/antigravity/brain/adacf84f-06ac-4e01-bc1e-3553a5b4b551/hamburguesa_promo_1779208921250.png", dest: "hamburguesa.png" },
  { src: "C:/Users/AVH-COM-330/.gemini/antigravity/brain/adacf84f-06ac-4e01-bc1e-3553a5b4b551/quinceanera_cake_1779208936684.png", dest: "quinceanera.png" }
];

imagesToCopy.forEach(img => {
  if (fs.existsSync(img.src)) {
    fs.copyFileSync(img.src, path.join(publicImagesDir, img.dest));
    console.log(`Copiada: ${img.dest}`);
  } else {
    console.log(`No encontrada: ${img.src}`);
  }
});
console.log("¡Imágenes movidas exitosamente a public/images!");
