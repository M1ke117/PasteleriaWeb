import { useEffect, useState } from 'react';
import { Cake, Facebook, ChevronRight, ChevronLeft, Heart, Star, Pizza, Coffee, Sandwich, Crown, Loader2, Menu, X, Gift, Sparkles, Search, Settings } from 'lucide-react';
import { supabase } from './lib/supabase';
import AdminPanel from './components/AdminPanel';
import './App.css';

interface Product {
  id: number;
  name: string;
  description: string;
  image: string;
  icon: string;
}

const iconMap: Record<string, JSX.Element> = {
  'Cake': <Cake className="text-primary" />,
  'Pizza': <Pizza className="text-primary" />,
  'Sandwich': <Sandwich className="text-primary" />,
  'Crown': <Crown className="text-primary" />,
  'Heart': <Heart className="text-primary" />,
  'Star': <Star className="text-primary" />,
  'Coffee': <Coffee className="text-primary" />,
  'Gift': <Gift className="text-primary" />,
  'Sparkles': <Sparkles className="text-primary" />
};

function App() {
  const getGalleryKey = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('chocoflan') || n.includes('imposible')) return 'chocoflan';
    if (n.includes('15 años')) return 'pastel xv';
    if (n.includes('gelatina')) return 'gelatina';
    if (n.includes('pan')) return 'pan';
    if (n.includes('pizza')) return 'pizza';
    if (n.includes('rosca')) return 'roscas';
    if (n.includes('fresa')) return 'fresas';
    if (n.includes('flan')) return 'flan';
    if (n.includes('dona')) return 'donas';
    if (n.includes('cupcake')) return 'cupcake';
    if (n.includes('cheese')) return 'chessecake';
    if (n.includes('hamburguesa')) return 'hamburguesas';
    if (n.includes('pastel')) return 'pastel';
    return null;
  };

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedGalleryItem, setSelectedGalleryItem] = useState<{ name: string, image: string } | null>(null);
  const [expandedImageIndex, setExpandedImageIndex] = useState<number | null>(null);
  const [galleryData, setGalleryData] = useState<Record<string, string[]>>({});
  const [supabaseGalleryData, setSupabaseGalleryData] = useState<Record<string, string[]>>({});
  const [currentMeritoIndex, setCurrentMeritoIndex] = useState(0);
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  useEffect(() => {
    const combinedMeritos = [...(galleryData['meritos'] || []), ...(supabaseGalleryData['meritos'] || [])];
    if (combinedMeritos.length > 0) {
      const interval = setInterval(() => {
        setCurrentMeritoIndex(prev => (prev + 1) % combinedMeritos.length);
      }, 3500);
      return () => clearInterval(interval);
    }
  }, [galleryData, supabaseGalleryData]);

  const fetchSupabaseGallery = async () => {
    const { data, error } = await supabase.from('gallery_images').select('*');
    if (data && !error) {
      const grouped: Record<string, string[]> = {};
      data.forEach((img: any) => {
        if (!grouped[img.category]) grouped[img.category] = [];
        grouped[img.category].push(img.image_url);
      });
      setSupabaseGalleryData(grouped);
    }
  };

  useEffect(() => {
    fetch('/gallery.json')
      .then(res => res.json())
      .then(data => setGalleryData(data))
      .catch(err => console.error('Error loading gallery:', err));

    // Fetch inicial from Supabase
    fetchSupabaseGallery();
  }, []);

  const handleCloseAdminPanel = () => {
    setShowAdminPanel(false);
    fetchSupabaseGallery();
  };

  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('id');

        if (error) throw error;

        const modifiedData = (data || []).map(p =>
          p.name === 'Pastel de Ensueño' ? { ...p, name: 'Pasteles' } : p
        );

        setProducts(modifiedData);
      } catch (err) {
        console.error("Error al cargar los productos de Supabase:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  useEffect(() => {
    if (selectedGalleryItem || isMenuOpen || expandedImageIndex !== null || showAdminPanel) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedGalleryItem, isMenuOpen, expandedImageIndex, showAdminPanel]);
  
  // Helper to combine local and supabase images
  const getCombinedGallery = (key: string | null) => {
    if (!key) return [];
    return [...(galleryData[key] || []), ...(supabaseGalleryData[key] || [])];
  };

  return (
    <div className="app-container">
      {/* Navbar */}
      <nav className="navbar glass-panel">
        <div className="container nav-content">
          <div className="logo">
            <button className="menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
            <Cake size={32} color="var(--color-primary)" className="logo-icon" />
            <h1>Mis Dulces Ideas</h1>
          </div>
          <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
            <li><a href="#inicio" onClick={() => setIsMenuOpen(false)}>Inicio</a></li>
            <li><a href="#galeria" onClick={() => setIsMenuOpen(false)}>Galería</a></li>
            <li><a href="#especialidades" onClick={() => setIsMenuOpen(false)}>Especialidades</a></li>
            <li><a href="#nosotros" onClick={() => setIsMenuOpen(false)}>Nosotros</a></li>
          </ul>
          <a href="https://www.facebook.com/share/17jtbifXp2/" target="_blank" rel="noreferrer" className="btn-primary nav-btn">
            <Facebook size={20} /> Contactar
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="inicio" className="hero">
        <div className="container hero-content animate-fade-in">
          <div className="hero-text">
            <h2>Hacemos tus momentos <span className="text-highlight">más dulces</span></h2>
            <p>Descubre nuestra increíble selección de pasteles, pizzas, postres y más. Elaborados con los mejores ingredientes y mucho amor, para hacer de cada celebración algo inolvidable.</p>
            <div className="hero-buttons">
              <a href="#galeria" className="btn-primary">Ver Productos <ChevronRight size={20} /></a>
              <a href="#nosotros" className="btn-secondary">Conócenos</a>
            </div>
          </div>
          <div className="hero-image-wrapper">
            {getCombinedGallery('meritos').length > 0 ? (
              <img 
                src={getCombinedGallery('meritos')[currentMeritoIndex]} 
                alt="Méritos y reconocimientos" 
                className="hero-image" 
                style={{ objectFit: 'cover' }}
              />
            ) : (
              <img src="/images/cake.png" alt="Pastel decorado" className="hero-image" />
            )}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="galeria" className="gallery">
        <div className="container">
          <div className="section-title">
            <h3>Nuestras Delicias</h3>
            <p>Explora la variedad de opciones que tenemos para ti</p>
          </div>
          <div className="product-grid">
            {loading ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem' }}>
                <Loader2 className="text-primary" size={48} style={{ animation: 'spin 2s linear infinite', margin: '0 auto' }} />
                <p style={{ marginTop: '1rem', color: 'var(--color-text-light)' }}>Cargando delicias...</p>
                <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
              </div>
            ) : products.length === 0 ? (
              <p style={{ gridColumn: '1 / -1', textAlign: 'center' }}>Aún no hay productos, asegúrate de conectarte a Supabase y agregar datos.</p>
            ) : (
              products.map((product) => {
                const key = getGalleryKey(product.name);
                const combinedImages = getCombinedGallery(key);
                const idx = (key === 'cupcake' || key === 'pastel xv') ? 1 : 0;
                const coverImage = combinedImages.length > idx 
                  ? combinedImages[idx] 
                  : (combinedImages.length > 0 ? combinedImages[0] : product.image);
                return (
                  <div key={product.id} className="product-card glass-panel">
                    <div className="card-image-container">
                      <img src={coverImage} alt={product.name} loading="lazy" />
                      <div className="card-overlay">
                        <button className="btn-primary btn-gallery" onClick={() => setSelectedGalleryItem({ name: product.name, image: coverImage })}>
                          <Search size={20} /> Ver galería
                        </button>
                      </div>
                    </div>
                  <div className="card-content">
                    <div className="card-header">
                      <h4>{product.name}</h4>
                      {iconMap[product.icon] || <Cake className="text-primary" />}
                    </div>
                    <p>{product.description}</p>
                  </div>
                </div>
              )})
            )}
          </div>
        </div>
      </section>

      {/* Specialties Section */}
      <section id="especialidades" className="specialties">
        <div className="container">
          <div className="section-title">
            <h3>Nuestras Especialidades</h3>
            <p>También ofrecemos una deliciosa selección de panadería y repostería</p>
          </div>
          <div className="specialties-grid">

            <div className="specialty-card glass-panel">
              <div className="card-image-container">
                <img src={getCombinedGallery('pan')?.[0] || "/images/pan_dulce.png"} alt="Pan de Dulce" loading="lazy" />
                <div className="card-overlay">
                  <button className="btn-primary btn-gallery" onClick={() => setSelectedGalleryItem({ name: 'Pan de Dulce', image: getCombinedGallery('pan')?.[0] || '/images/pan_dulce.png' })}>
                    <Search size={20} /> Ver galería
                  </button>
                </div>
              </div>
              <div className="specialty-content">
                <div className="specialty-header">
                  <h4>Pan de Dulce</h4>
                  <Coffee className="text-primary" />
                </div>
                <p>Conchas, cuernos, orejas y más. El acompañamiento perfecto para tu café o chocolate caliente.</p>
              </div>
            </div>

            <div className="specialty-card glass-panel">
              <div className="card-image-container">
                <img src={getCombinedGallery('donas')?.[0] || "/images/donuts.png"} alt="Donas" loading="lazy" />
                <div className="card-overlay">
                  <button className="btn-primary btn-gallery" onClick={() => setSelectedGalleryItem({ name: 'Donas', image: getCombinedGallery('donas')?.[0] || '/images/donuts.png' })}>
                    <Search size={20} /> Ver galería
                  </button>
                </div>
              </div>
              <div className="specialty-content">
                <div className="specialty-header">
                  <h4>Donas</h4>
                  <Sparkles className="text-primary" />
                </div>
                <p>Esponjosas y deliciosas, con una gran variedad de glaseados y toppings para todos los gustos.</p>
              </div>
            </div>

            <div className="specialty-card glass-panel">
              <div className="card-image-container">
                <img src={getCombinedGallery('chessecake')?.[0] || "/images/cheesecake.png"} alt="Cheesecake" loading="lazy" />
                <div className="card-overlay">
                  <button className="btn-primary btn-gallery" onClick={() => setSelectedGalleryItem({ name: 'Cheesecake', image: getCombinedGallery('chessecake')?.[0] || '/images/cheesecake.png' })}>
                    <Search size={20} /> Ver galería
                  </button>
                </div>
              </div>
              <div className="specialty-content">
                <div className="specialty-header">
                  <h4>Cheesecake</h4>
                  <Cake className="text-primary" />
                </div>
                <p>Un clásico cremoso y suave al estilo New York, coronado con frutas frescas o dulces salsas.</p>
              </div>
            </div>

            <div className="specialty-card glass-panel">
              <div className="card-image-container">
                <img src={getCombinedGallery('cupcake')?.[1] || getCombinedGallery('cupcake')?.[0] || "/images/cupcake.png"} alt="Cupcakes" loading="lazy" />
                <div className="card-overlay">
                  <button className="btn-primary btn-gallery" onClick={() => setSelectedGalleryItem({ name: 'Cupcakes', image: getCombinedGallery('cupcake')?.[1] || getCombinedGallery('cupcake')?.[0] || '/images/cupcake.png' })}>
                    <Search size={20} /> Ver galería
                  </button>
                </div>
              </div>
              <div className="specialty-content">
                <div className="specialty-header">
                  <h4>Cupcakes</h4>
                  <Gift className="text-primary" />
                </div>
                <p>Pequeños bocados de felicidad decorados con coberturas exquisitas y diseños muy especiales.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="nosotros" className="about glass-panel">
        <div className="container about-content">
          <div className="about-text">
            <h3>Hecho con <span className="text-highlight">Amor</span></h3>
            <p>En <strong>Mis Dulces Ideas</strong>, creemos que cada postre cuenta una historia. Desde nuestra famosa receta de fresas con crema hasta los sofisticados chocoflanes, todo lo preparamos de forma artesanal, cuidando cada detalle para asegurar que cada bocado sea una experiencia mágica. ¡Tu sonrisa es nuestra mejor receta!</p>
          </div>
        </div>
      </section>

      {/* Footer / Contact */}
      <footer className="footer">
        <div className="container footer-content">
          <div className="footer-brand">
            <Cake size={40} color="var(--color-primary-light)" />
            <h2>Mis Dulces Ideas</h2>
            <p>Haciendo la vida más dulce, un postre a la vez.</p>
          </div>
          <div className="footer-contact">
            <h3>Haz tu pedido</h3>
            <p>¡Contáctanos en Facebook para realizar tus pedidos, cotizaciones y más!</p>
            <a href="https://www.facebook.com/share/17jtbifXp2/" target="_blank" rel="noreferrer" className="btn-primary facebook-btn">
              <Facebook size={24} /> Ir a nuestro Facebook
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Mis Dulces Ideas. Con Mucho Amoor Para Mi Celees.</p>
          <button 
            onClick={() => setShowAdminPanel(true)} 
            style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '1rem auto 0' }}
          >
            <Settings size={14} /> Administrar
          </button>
        </div>
      </footer>

      {/* Gallery Modal */}
      {selectedGalleryItem && (
        <div className="modal-overlay" onClick={() => setSelectedGalleryItem(null)}>
          <div className="modal-content glass-panel animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedGalleryItem(null)}>
              <X size={24} />
            </button>
            <h3>Galería de {selectedGalleryItem.name}</h3>
            <p>Aquí mostramos todos los trabajos reales que hemos entregado.</p>
            <div className="modal-gallery-grid">
              {(() => {
                const getGalleryKey = (name: string) => {
                  const n = name.toLowerCase();
                  if (n.includes('chocoflan') || n.includes('imposible')) return 'chocoflan';
                  if (n.includes('15 años')) return 'pastel xv';
                  if (n.includes('gelatina')) return 'gelatina';
                  if (n.includes('pan')) return 'pan';
                  if (n.includes('pizza')) return 'pizza';
                  if (n.includes('rosca')) return 'roscas';
                  if (n.includes('fresa')) return 'fresas';
                  if (n.includes('flan')) return 'flan';
                  if (n.includes('dona')) return 'donas';
                  if (n.includes('cupcake')) return 'cupcake';
                  if (n.includes('cheese')) return 'chessecake';
                  if (n.includes('hamburguesa')) return 'hamburguesas';
                  if (n.includes('pastel')) return 'pastel';
                  return null;
                };

                const key = getGalleryKey(selectedGalleryItem.name);
                const images = getCombinedGallery(key);

                if (images.length > 0) {
                  return images.map((img, idx) => (
                    <img 
                      key={idx} 
                      src={img} 
                      alt={`${selectedGalleryItem.name} ${idx + 1}`} 
                      loading="lazy" 
                      onClick={() => setExpandedImageIndex(idx)}
                      style={{ cursor: 'pointer' }}
                    />
                  ));
                }

                return (
                  <>
                    <img src={selectedGalleryItem.image} alt={`${selectedGalleryItem.name} 1`} />
                    <img src={selectedGalleryItem.image} alt={`${selectedGalleryItem.name} 2`} style={{ filter: 'saturate(1.2) hue-rotate(5deg)' }} />
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Overlay */}
      {expandedImageIndex !== null && selectedGalleryItem && (
        <div className="lightbox-overlay" onClick={() => setExpandedImageIndex(null)}>
          <button className="lightbox-close" onClick={() => setExpandedImageIndex(null)}>
            <X size={32} color="white" />
          </button>
          {(() => {
            const key = getGalleryKey(selectedGalleryItem.name);
            const images = getCombinedGallery(key);
            
            if (images.length === 0) return null;

            const handlePrev = (e: React.MouseEvent) => {
              e.stopPropagation();
              setExpandedImageIndex(prev => prev === 0 ? images.length - 1 : prev! - 1);
            };

            const handleNext = (e: React.MouseEvent) => {
              e.stopPropagation();
              setExpandedImageIndex(prev => prev === images.length - 1 ? 0 : prev! + 1);
            };

            return (
              <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
                {images.length > 1 && (
                  <button className="lightbox-nav prev" onClick={handlePrev}>
                    <ChevronLeft size={32} color="white" />
                  </button>
                )}
                <img src={images[expandedImageIndex]} alt="Vista expandida" className="lightbox-img" />
                {images.length > 1 && (
                  <button className="lightbox-nav next" onClick={handleNext}>
                    <ChevronRight size={32} color="white" />
                  </button>
                )}
              </div>
            );
          })()}
        </div>
      )}

      {/* Admin Panel Modal */}
      {showAdminPanel && (
        <AdminPanel onClose={handleCloseAdminPanel} />
      )}
    </div>
  );
}

export default App;
