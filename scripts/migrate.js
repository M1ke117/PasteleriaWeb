import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { fileURLToPath } from 'url';

// Configuraciones (obtenidas de tu .env.local)
const supabaseUrl = 'https://vnjsxuzcnnelwovqadnj.supabase.co';
const supabaseAnonKey = 'sb_publishable_S2FSNMneJoH0f1rPH067og_umQ81wMd';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const galleryJsonPath = path.join(__dirname, '../public/gallery.json');
const publicDir = path.join(__dirname, '../public');

async function migrate() {
  console.log('Iniciando migración de fotos a Supabase...');
  
  if (!fs.existsSync(galleryJsonPath)) {
    console.error('No se encontró gallery.json');
    return;
  }

  const galleryData = JSON.parse(fs.readFileSync(galleryJsonPath, 'utf8'));
  let totalUploaded = 0;

  for (const category of Object.keys(galleryData)) {
    const images = galleryData[category];
    
    for (const imagePath of images) {
      try {
        const fullLocalPath = path.join(publicDir, imagePath); // Ej: /images/gallery/pastel/foto.jpg
        
        if (!fs.existsSync(fullLocalPath)) {
          console.warn(`Archivo no encontrado localmente: ${fullLocalPath}`);
          continue;
        }

        const fileName = path.basename(imagePath);
        const storagePath = `${category}/${fileName}`;

        console.log(`Subiendo ${storagePath}...`);

        // Leer el archivo
        const fileBuffer = fs.readFileSync(fullLocalPath);

        // 1. Subir al Storage
        const { error: uploadError } = await supabase.storage
          .from('gallery')
          .upload(storagePath, fileBuffer, {
            contentType: 'image/jpeg', // Asumimos jpg/jpeg basado en tus extensiones
            upsert: true
          });

        if (uploadError) {
          console.error(`Error al subir ${fileName} al storage:`, uploadError);
          continue;
        }

        // 2. Obtener la URL Pública
        const { data: { publicUrl } } = supabase.storage
          .from('gallery')
          .getPublicUrl(storagePath);

        // 3. Insertar en Base de Datos
        const { error: dbError } = await supabase
          .from('gallery_images')
          .insert([
            { category: category, image_url: publicUrl }
          ]);

        if (dbError) {
          console.error(`Error al insertar ${fileName} en DB:`, dbError);
        } else {
          totalUploaded++;
        }

      } catch (e) {
        console.error(`Error general con la foto ${imagePath}:`, e);
      }
    }
  }

  console.log(`\n¡Migración Completada! Se subieron ${totalUploaded} fotos exitosamente.`);
}

migrate();
