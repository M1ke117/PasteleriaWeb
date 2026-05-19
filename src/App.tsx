import { Cake, Facebook, ChevronRight, Heart, Star, Pizza, Coffee, Sandwich, Crown } from 'lucide-react';
import './App.css';

// Using absolute path for Vite /@fs/ local file system serving
const IMAGE_CAKE = "/@fs/C:/Users/AVH-COM-330/.gemini/antigravity/brain/adacf84f-06ac-4e01-bc1e-3553a5b4b551/cake_promo_1779207895286.png";
const IMAGE_PIZZA = "/@fs/C:/Users/AVH-COM-330/.gemini/antigravity/brain/adacf84f-06ac-4e01-bc1e-3553a5b4b551/pizza_promo_1779207908451.png";
const IMAGE_FRESAS = "/@fs/C:/Users/AVH-COM-330/.gemini/antigravity/brain/adacf84f-06ac-4e01-bc1e-3553a5b4b551/fresas_crema_1779207922932.png";
const IMAGE_FLAN = "/@fs/C:/Users/AVH-COM-330/.gemini/antigravity/brain/adacf84f-06ac-4e01-bc1e-3553a5b4b551/flan_promo_1779207940555.png";
const IMAGE_CHOCOFLAN = "/@fs/C:/Users/AVH-COM-330/.gemini/antigravity/brain/adacf84f-06ac-4e01-bc1e-3553a5b4b551/chocoflan_promo_1779207953779.png";
const IMAGE_BURGER = "/@fs/C:/Users/AVH-COM-330/.gemini/antigravity/brain/adacf84f-06ac-4e01-bc1e-3553a5b4b551/hamburguesa_promo_1779208921250.png";
const IMAGE_XV = "/@fs/C:/Users/AVH-COM-330/.gemini/antigravity/brain/adacf84f-06ac-4e01-bc1e-3553a5b4b551/quinceanera_cake_1779208936684.png";

function App() {
  const products = [
    { id: 1, name: 'Pastel de Ensueño', description: 'Nuestros pasteles decorados, perfectos para tus eventos más dulces.', image: IMAGE_CAKE, icon: <Cake className="text-primary" /> },
    { id: 2, name: 'Pizzas Artesanales', description: 'El contraste perfecto: Pizzas calientes con ingredientes frescos.', image: IMAGE_PIZZA, icon: <Pizza className="text-primary" /> },
    { id: 3, name: 'Hamburguesas Gourmet', description: 'Jugosas hamburguesas con ingredientes premium para satisfacer tu antojo.', image: IMAGE_BURGER, icon: <Sandwich className="text-primary" /> },
    { id: 4, name: 'Pasteles de 15 Años', description: 'Creaciones majestuosas y elegantes para hacer de tus XV años un día inolvidable.', image: IMAGE_XV, icon: <Crown className="text-primary" /> },
    { id: 5, name: 'Fresas con Crema', description: 'Clásico y delicioso. Fresas frescas con nuestra receta secreta de crema.', image: IMAGE_FRESAS, icon: <Heart className="text-primary" /> },
    { id: 6, name: 'Flan Napolitano', description: 'Suave, cremoso y bañado en el más rico caramelo.', image: IMAGE_FLAN, icon: <Star className="text-primary" /> },
    { id: 7, name: 'Chocoflan (Pastel Imposible)', description: 'Lo mejor de dos mundos: bizcocho de chocolate y flan cremoso.', image: IMAGE_CHOCOFLAN, icon: <Coffee className="text-primary" /> },
  ];

  return (
    <div className="app-container">
      {/* Navbar */}
      <nav className="navbar glass-panel">
        <div className="container nav-content">
          <div className="logo">
            <Cake size={32} color="var(--color-primary)" />
            <h1>Mis Dulces Ideas</h1>
          </div>
          <ul className="nav-links">
            <li><a href="#inicio">Inicio</a></li>
            <li><a href="#galeria">Galería</a></li>
            <li><a href="#nosotros">Nosotros</a></li>
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
            <img src={IMAGE_CAKE} alt="Pastel decorado" className="hero-image" />
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
            {products.map((product) => (
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
                    {product.icon}
                  </div>
                  <p>{product.description}</p>
                </div>
              </div>
            ))}
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
