import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envContent = fs.readFileSync('.env.local', 'utf-8');
let supabaseUrl = '';
let supabaseAnonKey = '';

envContent.split('\n').forEach(line => {
  if (line.startsWith('VITE_SUPABASE_URL=')) supabaseUrl = line.split('=')[1].trim();
  if (line.startsWith('VITE_SUPABASE_ANON_KEY=')) supabaseAnonKey = line.split('=')[1].trim();
});

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkDuplicates() {
  const { data, error } = await supabase.from('gallery_images').select('*').eq('category', 'frappes');
  if (error) {
    console.error("Error:", error);
    return;
  }
  console.log("Images in 'frappes' category:", data.length);
  data.forEach((img, i) => console.log(`[${i}] ${img.image_url}`));
}

checkDuplicates();
