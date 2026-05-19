import { useEffect, useState } from 'react';
import { Cake, Facebook, ChevronRight, Heart, Star, Pizza, Coffee, Sandwich, Crown, Loader2, Menu, X } from 'lucide-react';
import { supabase } from './lib/supabase';
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
  'Coffee': <Coffee className="text-primary" />
};

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('id');
        
        if (error) throw error;
        setProducts(data || []);
      } catch (err) {
        console.error("Error al cargar los productos de Supabase:", err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchProducts();
  }, []);

  return (
    <div className="app-container">
      {/* Navbar */}
      <nav className="navbar glass-panel">
        <div className="container nav-content">
          <div className="logo">
            <Cake size={32} color="var(--color-primary)" />
            <h1>Mis Dulces Ideas</h1>
          </div>
          <button className="menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
          <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
            <li><a href="#inicio" onClick={() => setIsMenuOpen(false)}>Inicio</a></li>
            <li><a href="#galeria" onClick={() => setIsMenuOpen(false)}>Galería</a></li>
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
            <img src="/images/cake.png" alt="Pastel decorado" className="hero-image" />
            <div className="floating-badge glass-panel">
              <Star className="badge-icon" fill="var(--color-secondary)" color="var(--color-secondary)" />
              <span>Calidad y Sabor</span>
            </div>
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
              products.map((product) => (
                <div key={product.id} className="product-card glass-panel">
                  <div className="card-image-container">
                    <img src={product.image} alt={product.name} loading="lazy" />
                    <div className="card-overlay">
                      <button className="btn-primary btn-icon"><Heart size={20} /></button>
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
              ))
            )}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="nosotros" className="about glass-panel">
        <div className="container about-content">
          <div className="about-text">
            <h3>Hecho con <span className="text-highlight">Amor</span></h3>
            <p>En <strong>Mis Dulces Ideas</strong>, nuestra repostera <strong>Celeste Avalos Landa</strong> se encarga de preparar cada postre de forma artesanal. Desde nuestras fresas con crema hasta los pasteles de 15 años, Celeste elabora todos nuestros productos con mucho cuidado y cariño para ofrecerte un postre delicioso.</p>
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
          <p>&copy; {new Date().getFullYear()} Mis Dulces Ideas. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
