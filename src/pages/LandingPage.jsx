import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, Activity, Bell, Droplets, ArrowRight } from 'lucide-react';

// IMPORTANTE: Asegúrate de que el video esté en esta ruta
import heroVideo from '../assets/hero-video.mp4'; 

// =========================================
// COMPONENTE DE GALERÍA (CARRUSEL)
// =========================================
const PlantGallery = ({ plants, loading }) => {
  const scrollKeyframes = `
    @keyframes scroll {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); } 
    }
  `;

  if (loading) {
    return (
      <div className="relative w-full overflow-hidden py-10">
        <div className="flex animate-pulse justify-center gap-4">
            <div className="w-64 h-80 bg-gray-200 rounded-lg"></div>
            <div className="hidden md:block w-64 h-80 bg-gray-200 rounded-lg"></div>
            <div className="hidden lg:block w-64 h-80 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (!plants.length) {
    return (
      <div className="text-center text-gray-500 px-6 py-10 font-space">
        No se pudieron cargar las imágenes de la galería.
        <br />
        (Verifica tu conexión o API Key).
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden group py-10">
      <style>{scrollKeyframes}</style>
      
      <div 
        className="flex w-max motion-safe:animate-scroll group-hover:pause"
        style={{ animation: 'scroll 40s linear infinite' }}
      >
        {[...plants, ...plants].map((plant, index) => (
          <figure key={index} className="flex-shrink-0 w-64 h-80 mx-4 shadow-lg rounded-xl overflow-hidden group-hover:scale-[1.01] transition-transform duration-500 relative cursor-pointer">
            <img
              src={plant.default_image?.original_url}
              alt={plant.common_name}
              className="w-full h-full object-cover"
            />
            <figcaption className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 flex items-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <h3 className="text-white text-lg font-bold font-space capitalize tracking-wide">
                {plant.common_name}
              </h3>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
};

// =========================================
// COMPONENTE PRINCIPAL: LandingPage
// =========================================
function LandingPage() {
  const navigate = useNavigate();
  const handleStart = () => navigate('/login');

  const [galleryPlants, setGalleryPlants] = useState([]);
  const [loadingGallery, setLoadingGallery] = useState(true);


  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  useEffect(() => {
    const fetchGallery = async () => {
    
      const API_KEY = 'sk-dRrc697fd6845c5f813382'; // Tu API Key original
      const searchTerm = 'beet'; // Cambiado a 'tree' para coincidir con el tema, pero la lógica es la misma
      
      try {
        const response = await fetch(`https://perenual.com/api/species-list?key=${API_KEY}&q=${searchTerm}`);
        if (!response.ok) throw new Error('Error al cargar la galería');
        
        const data = await response.json();
        
        // Verificación simple como en tu código original
        const plantsWithImages = data.data.filter(plant => 
          plant.default_image && plant.default_image.original_url
        );

        // Usamos slice(0, 10) para tener suficientes imágenes en el carrusel infinito
        setGalleryPlants(plantsWithImages.slice(0, 10));

      } catch (error) {
        console.error("Error al cargar la galería:", error);
      } finally {
        setLoadingGallery(false);
      }
    };

    fetchGallery();
  }, []);
  
  return (
    <div className="min-h-screen w-full bg-white text-gray-900 font-sans flex flex-col overflow-x-hidden">
      

      <style>{`
        .font-space { font-family: 'Space Grotesk', sans-serif; }
      `}</style>

      {/* --- Header Transparente --- */}
      <header className="absolute top-0 left-0 w-full z-50 px-6 py-6 md:py-8">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            
            <h1 className="text-2xl font-bold text-white tracking-tighter font-space">
              Agreenbyte
            </h1>
            <Leaf className="text-[#BEF035]" size={28} strokeWidth={2.5} />
          </div>
          <button 
            onClick={handleStart} 
            className="hidden sm:inline-flex items-center text-white border border-white/30 px-6 py-2.5 rounded-full text-sm font-medium hover:bg-white hover:text-black transition-all font-space tracking-wide backdrop-blur-sm"
          >
            Acceder a la plataforma
          </button>
        </div>
      </header>

      {/* --- Hero Section Full Screen --- */}
      <div className="relative w-full h-screen flex flex-col justify-center items-center overflow-hidden">
        
        {/* Video de Fondo */}
        <video 
            className="absolute top-0 left-0 w-full h-full object-cover"
            autoPlay 
            loop 
            muted 
            playsInline
        >
            <source src={heroVideo} type="video/mp4" />
        </video>

        {/* Overlay Oscuro (Ajustado para legibilidad elegante) */}
        <div className="absolute inset-0 bg-black/50 z-10"></div>

        {/* Contenido Central */}
        <div className="relative z-20 text-center px-6 max-w-5xl mx-auto mt-10">
            
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white font-space tracking-tighter leading-[0.95] mb-8">
              El futuro de tu huerto empieza con <br/>
              <span className="text-[#BEF035]">datos inteligentes</span>
            </h2>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
              <a href="#features" className="w-full sm:w-auto bg-[#BEF035]/30 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white/20 transition-all shadow-lg hover:shadow-white/20 hover:-translate-y-1"
              >
                Saber más
              </a>
            </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 animate-bounce text-white/50">
            <ArrowRight className="rotate-90" size={24} />
        </div>
      </div>

      {/* --- Features Section --- */}
      <section id="features" className="w-full relative py-32 px-6 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=1600&q=80" 
            alt="Plant growing from soil"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/10"></div>
        </div>

        {/* Content Card */}
        <div className="max-w-[1400px] mx-auto relative z-10">
          <div className="bg-[#BEF035] rounded-[2.5rem] p-12 md:p-16 lg:p-20 max-w-4xl ml-auto shadow-2xl">
            
            {/* Feature 1 - Visualiza */}
            <div className="mb-12">
              <h3 className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#324C1C] font-space tracking-tight mb-4">
                Visualiza
              </h3>
              <p className="text-white text-xl md:text-2xl font-space font-medium leading-relaxed">
                datos críticos de tus cultivos gracias a los sensores<br/>
                que captan datos y los envían a tiempo real.
              </p>
            </div>

            {/* Feature 2 - Optimiza */}
            <div className="mb-12">
              <h3 className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#324C1C] font-space tracking-tight mb-4">
                Optimiza
              </h3>
              <p className="text-white text-xl md:text-2xl font-space font-bold leading-relaxed">
                recursos y procesos con<br/>
                automatizaciones.
              </p>
            </div>

            {/* Feature 3 - Previene */}
            <div>
              <h3 className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#324C1C] font-space tracking-tight mb-4">
                Previene
              </h3>
              <p className="text-white text-xl md:text-2xl font-space font-bold leading-relaxed">
                factores de riesgo con<br/>
                notificaciones y alertas.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* --- Gallery Section --- */}
      <section id="gallery" className="w-full relative py-24 overflow-hidden bg-gradient-to-b from-gray-50 to-white">
        {/* Decorative Trees on Sides */}
        <div className="absolute left-0 top-0 h-full w-48 md:w-64 z-10 pointer-events-none">
          <img 
            src="https://static.vecteezy.com/system/resources/previews/024/544/274/non_2x/tree-on-transparent-background-free-png.png" 
            alt="Tree decoration"
            className="h-full w-full object-cover object-right"
          />
        </div>
        <div className="absolute right-0 top-0 h-full w-48 md:w-64 z-10 pointer-events-none">
          <img 
            src="https://static.vecteezy.com/system/resources/previews/024/544/274/non_2x/tree-on-transparent-background-free-png.png" 
            alt="Tree decoration"
            className="h-full w-full object-cover object-left"
          />
        </div>

        {/* Content */}
        <div className="relative z-20 max-w-[1400px] mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-12">
            <h3 className="text-5xl md:text-6xl lg:text-7xl font-bold font-space tracking-tight mb-4 text-[#BEF035]">
              Galería de Cultivos Populares
            </h3>
            <p className="text-xl md:text-2xl text-gray-700 font-space">
              Explora algunas de las plantas que puedes<br className="hidden sm:block"/>
              monitorear en tu huerto.
            </p>
          </div>

          {/* Gallery Container with Lime Background */}
          <div className="bg-[#BEF035] rounded-3xl py-12 px-6 shadow-2xl">
            <PlantGallery plants={galleryPlants} loading={loadingGallery} />
          </div>
        </div>
      </section>

      {/* --- Footer Minimalista --- */}
      <footer className="w-full bg-[#324C1C] text-black py-12 px-6 border-t border-gray-200">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
                <span className="font-bold font-space text-xl tracking-tighter text-white">AGREENBYTE</span>
                <Leaf className="text-[#BEF035]" size={24} />
            </div>

            <p className="text-sm text-gray-400 font-space">
              © 2026 Juan Lucero, Brandon Huera, Ardanny Romero - Desarrollo de Aplicaciones Web
            </p>
            
        </div>
        <div className="text-[15px] mt-6 pt-6 border-t border-white text-center font-space">
          <p>Imagenes y videos de Vecteezy.com</p>
        </div>
        
      </footer>
    </div>
  );
}

export default LandingPage;