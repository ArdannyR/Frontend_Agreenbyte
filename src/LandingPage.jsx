import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, Activity, Bell, Droplets, Loader2 } from 'lucide-react';

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
      <div className="relative w-full overflow-hidden">
        <div className="flex animate-pulse" style={{ paddingLeft: 'calc(50% - 32rem)' }}>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex-shrink-0 w-64 h-80 bg-gray-200 rounded-2xl mx-4"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!plants.length) {
    return (
      <div className="text-center text-gray-500 px-6">
        No se pudieron cargar las imágenes de la galería.
        <br />
        (Asegúrate de que tu API Key de Perenual sea correcta y tenga usos disponibles).
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden group">
      <style>{scrollKeyframes}</style>
      
      <div 
        className="flex w-max motion-safe:animate-scroll group-hover:pause"
        style={{ animation: 'scroll 40s linear infinite' }}
      >
        {[...plants, ...plants].map((plant, index) => (
          <figure key={index} className="flex-shrink-0 w-64 h-80 mx-4 shadow-xl rounded-3xl overflow-hidden group-hover:scale-[1.02] transition-transform duration-500">
            <img
              src={plant.default_image?.original_url}
              alt={plant.common_name}
              className="w-full h-full object-cover"
            />
            <figcaption className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 flex items-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <h3 className="text-white text-lg font-bold capitalize">
                {plant.common_name}
              </h3>
            </figcaption>
          </figure>
        ))}
      </div>

      <div className="absolute top-0 left-0 w-1/4 h-full bg-gradient-to-r from-gray-50 to-transparent z-10"></div>
      <div className="absolute top-0 right-0 w-1/4 h-full bg-gradient-to-l from-gray-50 to-transparent z-10"></div>
    </div>
  );
};


// =========================================
// COMPONENTE: LandingPage (Modificado)
// =========================================
function LandingPage() {
  const navigate = useNavigate();
  const handleStart = () => navigate('/login');

  const [galleryPlants, setGalleryPlants] = useState([]);
  const [loadingGallery, setLoadingGallery] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
    
      const API_KEY = 'sk-N5sO6910bc312749c13382'; // Tu API Key
      const searchTerm = 'beet';
      
      try {
        const response = await fetch(`https://perenual.com/api/species-list?key=${API_KEY}&q=${searchTerm}`);
        if (!response.ok) throw new Error('Error al cargar la galería');
        
        const data = await response.json();
        
        const plantsWithImages = data.data.filter(plant => 
          plant.default_image && plant.default_image.original_url
        );

        setGalleryPlants(plantsWithImages.slice(0, 4));

      } catch (error) {
        console.error("Error al cargar la galería:", error);
      } finally {
        setLoadingGallery(false);
      }
    };

    fetchGallery();
  }, []);
  
  return (
    <div className="min-h-screen w-full bg-gray-50 text-gray-800 font-sans flex flex-col">
      
      {/* --- Header --- */}
      <header className="w-full px-6 py-6 bg-green-400 shadow-lg">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-green-600 p-2 rounded-xl shadow-sm">
              <Leaf className="text-white" size={24} />
            </div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">
              Agreenbyte
            </h1>
          </div>
          <button 
            onClick={handleStart} 
            className="hidden sm:inline-flex items-center bg-white text-green-700 px-6 py-2.5 rounded-xl text-sm font-semibold border border-green-100 hover:border-green-300 hover:shadow-sm transition-all"
          >
            Acceder a la Plataforma
          </button>
        </div>
      </header>

      {/* --- Hero Section --- */}
      <main className="flex-1 w-full">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-12 px-6 py-24">
        
          {/* --- Columna de Texto --- */}
          <div className="text-center md:text-left animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-green-400 border border-green-100 px-4 py-1.5 rounded-full mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
              </span>
              <span className="text-sm font-medium text-white-700">
                Proyecto de Desarrollo de Aplicaciones Web
              </span>
            </div>
            
            <h2 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight mb-8">
              El futuro de tu huerto empieza con <span className="text-green-600 relative inline-block">
                datos inteligentes
                <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 100 8" preserveAspectRatio="none">
                  <path d="M0 5c30-5 70-5 100 0" stroke="#22c55e" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.3" />
                </svg>
              </span>.
            </h2>
            
            <p className="text-xl text-gray-600 max-w-2xl md:max-w-none mx-auto mb-12 leading-relaxed">
              Monitorea, analiza y optimiza el crecimiento de tus cultivos con nuestra plataforma de gestión agrícola de precisión.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
              <button 
                onClick={handleStart} 
                className="w-full sm:w-auto bg-green-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-green-700 transition-all shadow-lg hover:shadow-green-200 hover:-translate-y-1"
              >
                Comenzar Ahora
              </button>
              <a href="#features" className="w-full sm:w-auto px-8 py-4 rounded-xl text-lg font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-200 transition-all">
                Saber más
              </a>
            </div>
          </div>

          {/* --- Columna de Imagen --- */}
          <div className="hidden md:block animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <img 
              src="https://iat.es/wp-content/uploads/2020/06/iot-agricultura.jpg"
              alt="Campo de cultivo inteligente"
              className="w-full h-auto rounded-3xl shadow-2xl shadow-green-400/30"
            />
          </div>

        </div>
      </main>
      {/* --- Fin del Hero Section --- */}

      {/* --- Features Section --- */}
      <section id="features" className="w-full bg-green-400 py-24 px-6 border-t border-green-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Todo lo que tu huerto necesita
            </h3>
            <p className="text-gray-900 max-w-xl mx-auto">
              Nuestra plataforma integra hardware y software para darte el control total.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            
            {/* Feature 1 */}
            <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100 hover:border-green-200 transition-colors group">
              <div className="bg-white w-14 h-14 flex items-center justify-center rounded-2xl shadow-sm mb-6 group-hover:scale-110 transition-transform">
                <Activity className="text-green-600" size={28} />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Sensores en Tiempo Real</h4>
              <p className="text-gray-600 leading-relaxed">
                Visualiza datos críticos de humedad del suelo, temperatura ambiental y niveles de luz al instante.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100 hover:border-blue-200 transition-colors group">
              <div className="bg-white w-14 h-14 flex items-center justify-center rounded-2xl shadow-sm mb-6 group-hover:scale-110 transition-transform">
                <Droplets className="text-blue-500" size={28} />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Gestión de Riego</h4>
              <p className="text-gray-600 leading-relaxed">
                Optimiza el uso del agua obteniendo metricas del entorno en tiempo real.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100 hover:border-yellow-200 transition-colors group">
              <div className="bg-white w-14 h-14 flex items-center justify-center rounded-2xl shadow-sm mb-6 group-hover:scale-110 transition-transform">
                <Bell className="text-yellow-500" size={28} />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Alertas Preventivas</h4>
              <p className="text-gray-600 leading-relaxed">
                Recibe notificaciones inmediatas si las condiciones ambientales salen del rango ideal para tu cultivo.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* --- Gallery Section --- */}
      <section id="gallery" className="w-full bg-gray-50 py-24 overflow-hidden">
        <div className="max-w-full mx-auto">
          <div className="text-center mb-16 px-6">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Galería de Cultivos Populares
            </h3>
            <p className="text-gray-600 max-w-xl mx-auto">
              Explora algunas de las plantas que puedes monitorear en tu huerto.
            </p>
          </div>
          
          <PlantGallery plants={galleryPlants} loading={loadingGallery} />

        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="w-full bg-gray-900 text-gray-400 py-12 px-6">
        <div className="max-w-6xl mx-auto text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <Leaf className=" text-white" size={35} />
              <span className="text-[25px] text-white font-bold text-lg">Agreenbyte</span>
            </div>
            <p className="text-[15px]">
              © 2025 Juan Lucero, Brandon Huera, Ardanny Romero - Desarrollo de Aplicaciones Web
            </p>
          </div>
          <div className="text-[15px] mt-6 pt-6 border-t border-gray-700/50 text-center text-xs">
            <p>Icono de la aplicación por <a href="https://lucide.dev/icons/leaf" title="verde iconos" target="_blank" rel="noopener noreferrer" className="underline hover:text-white transition-colors">Lucide</a>.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;