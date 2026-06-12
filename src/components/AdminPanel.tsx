import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Loader2, Trash2, Upload, Lock, X } from 'lucide-react';
import './AdminPanel.css'; // Crearemos este archivo de estilos también

interface AdminPanelProps {
  onClose: () => void;
}

interface GalleryImage {
  id: string;
  category: string;
  image_url: string;
  created_at: string;
}

const CATEGORIES = [
  'pastel', 'pastel xv', 'chocoflan', 'gelatina', 'pan',
  'pizza', 'roscas', 'fresas', 'flan', 'donas',
  'cupcake', 'chessecake', 'hamburguesas', 'meritos'
];

export default function AdminPanel({ onClose }: AdminPanelProps) {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  // Estado para el filtro de la galería
  const [filterCategory, setFilterCategory] = useState<string>('todas');

  // === CONTRASEÑA SECRETA ===
  // contraseña 
  const ADMIN_PASSWORD = 'celes212002';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      fetchImages();
    } else {
      alert('Contraseña incorrecta');
    }
  };

  const fetchImages = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('gallery_images')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching images:', error);
    } else {
      setImages(data || []);
    }
    setLoading(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setUploading(true);
    try {
      // 1. Subir archivo a Supabase Storage
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${selectedCategory}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(filePath, selectedFile);

      if (uploadError) throw uploadError;

      // 2. Obtener URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('gallery')
        .getPublicUrl(filePath);

      // 3. Guardar en Base de Datos
      const { error: dbError } = await supabase
        .from('gallery_images')
        .insert([
          { category: selectedCategory, image_url: publicUrl }
        ]);

      if (dbError) throw dbError;

      alert('Imagen subida exitosamente!');
      setSelectedFile(null);
      setPreviewUrl(null);
      fetchImages(); // Recargar imágenes
    } catch (error: any) {
      console.error('Error uploading:', error);
      alert('Error al subir imagen: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string, imageUrl: string) => {
    if (!confirm('¿Estás seguro de eliminar esta foto?')) return;

    try {
      // 1. Extraer la ruta del archivo de la URL
      // La URL típica de supabase es: .../storage/v1/object/public/gallery/categoria/archivo.jpg
      const urlParts = imageUrl.split('/gallery/');
      if (urlParts.length > 1) {
        const filePath = urlParts[1];

        // 2. Eliminar de Storage
        const { error: storageError } = await supabase.storage
          .from('gallery')
          .remove([filePath]);

        if (storageError) console.error('Storage delete error:', storageError);
      }

      // 3. Eliminar de Base de Datos
      const { error: dbError } = await supabase
        .from('gallery_images')
        .delete()
        .eq('id', id);

      if (dbError) throw dbError;

      fetchImages(); // Recargar
    } catch (error: any) {
      console.error('Error deleting:', error);
      alert('Error al eliminar: ' + error.message);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-overlay">
        <div className="admin-login glass-panel animate-fade-in">
          <button className="close-btn" onClick={onClose}><X /></button>
          <Lock size={48} className="text-primary mx-auto mb-4" />
          <h2 className="text-center mb-4">Acceso Administrativo</h2>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="admin-input"
              autoFocus
            />
            <button type="submit" className="btn-primary w-full">Ingresar</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-overlay">
      <div className="admin-panel glass-panel animate-fade-in">
        <div className="admin-header">
          <h2>Administrador de Galería</h2>
          <button className="close-btn" onClick={onClose}><X /></button>
        </div>

        <div className="admin-content">
          {/* Zona de Subida */}
          <div className="upload-section">
            <h3>Subir Nueva Foto</h3>
            <form onSubmit={handleUpload} className="upload-form">
              <div className="form-group">
                <label>Categoría</label>
                <select 
                  value={selectedCategory} 
                  onChange={e => {
                    setSelectedCategory(e.target.value);
                    setFilterCategory(e.target.value);
                  }}
                  className="admin-input"
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label>Foto</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="admin-input"
                />
              </div>

              {previewUrl && (
                <div className="preview-container">
                  <img src={previewUrl} alt="Vista previa" className="image-preview" />
                </div>
              )}

              <button
                type="submit"
                className="btn-primary"
                disabled={!selectedFile || uploading}
              >
                {uploading ? <Loader2 className="spin" /> : <Upload />}
                {uploading ? 'Subiendo...' : 'Subir Imagen'}
              </button>
            </form>
          </div>

          {/* Zona de Galería (Eliminar) */}
          <div className="gallery-section">
            <div className="flex justify-between items-center mb-4" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3>Fotos Actuales</h3>
              <div className="filter-group">
                <select 
                  value={filterCategory} 
                  onChange={e => setFilterCategory(e.target.value)}
                  className="admin-input"
                  style={{ padding: '0.5rem', fontSize: '0.9rem' }}
                >
                  <option value="todas">Todas las fotos</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)}
                </select>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center p-8"><Loader2 className="spin text-primary" size={32} /></div>
            ) : (
              <div className="admin-gallery-grid">
                {images
                  .filter(img => filterCategory === 'todas' || img.category === filterCategory)
                  .map(img => (
                  <div key={img.id} className="admin-image-card">
                    <img src={img.image_url} alt={img.category} loading="lazy" />
                    <div className="admin-image-overlay">
                      <span className="badge">{img.category}</span>
                      <button
                        onClick={() => handleDelete(img.id, img.image_url)}
                        className="btn-danger"
                        title="Eliminar"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                ))}
                {images.filter(img => filterCategory === 'todas' || img.category === filterCategory).length === 0 && (
                  <p>No hay fotos en esta categoría.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
