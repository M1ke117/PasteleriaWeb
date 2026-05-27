const fs = require('fs');
const path = require('path');

const galleryPath = path.join(__dirname, '../public/images/gallery');
const outputPath = path.join(__dirname, '../public/gallery.json');

const gallery = {};

if (fs.existsSync(galleryPath)) {
  const folders = fs.readdirSync(galleryPath, { withFileTypes: true });
  for (const folder of folders) {
    if (folder.isDirectory()) {
      const category = folder.name;
      const files = fs.readdirSync(path.join(galleryPath, category));
      const images = files.filter(f => f.match(/\.(png|jpe?g|gif|webp)$/i));
      gallery[category.toLowerCase()] = images.map(img => `/images/gallery/${category}/${img}`);
    }
  }
}

fs.writeFileSync(outputPath, JSON.stringify(gallery, null, 2));
console.log('Gallery JSON generated successfully at', outputPath);
