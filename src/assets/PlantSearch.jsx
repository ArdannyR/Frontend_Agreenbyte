import React, { useState } from "react";
import { Leaf, Search, Droplets, Sun, Sprout, X, CloudRain, Calendar, Info } from "lucide-react";

// =========================================
// COMPONENTE: PlantModal (Ventana Emergente)
// =========================================
const PlantModal = ({ plant, onClose }) => {
  if (!plant) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full overflow-hidden flex flex-col md:flex-row animate-scale-up relative">
        
        {/* Botón Cerrar */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-white/80 rounded-full hover:bg-gray-100 transition-colors z-10"
        >
          <X size={24} className="text-gray-600" />
        </button>

        {/* Imagen en grande */}
        <div className="w-full md:w-2/5 h-64 md:h-auto relative bg-gray-100">
          {plant.default_image?.original_url ? (
            <img 
                src={plant.default_image.original_url} 
                alt={plant.common_name} 
                className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
                <Leaf size={64} className="text-green-300" />
            </div>
          )}
        </div>

        {/* Información Detallada */}
        <div className="w-full md:w-3/5 p-8 flex flex-col">
          <h2 className="text-3xl font-bold text-green-800 capitalize mb-1">
            {plant.common_name}
          </h2>
          <p className="text-gray-500 italic mb-6 text-lg border-b border-gray-100 pb-4">
            {plant.scientific_name?.[0]}
          </p>

          <div className="space-y-4 flex-1">
            
            {/* Ciclo de Vida */}
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-green-100 rounded-xl text-green-600">
                <Calendar size={20} />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 text-sm">Ciclo de Vida</h4>
                <p className="text-gray-600 capitalize text-sm">{plant.cycle || 'No especificado'}</p>
              </div>
            </div>

            {/* Riego */}
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-blue-100 rounded-xl text-blue-600">
                <CloudRain size={20} />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 text-sm">Riego</h4>
                <p className="text-gray-600 capitalize text-sm">{plant.watering || 'No especificado'}</p>
              </div>
            </div>

            {/* Luz Solar */}
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-yellow-100 rounded-xl text-yellow-600">
                <Sun size={20} />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 text-sm">Luz Solar</h4>
                <p className="text-gray-600 capitalize text-sm">
                  {plant.sunlight ? plant.sunlight.join(', ') : 'No especificado'}
                </p>
              </div>
            </div>
            
            {/* Otros nombres (si existen) */}
            {plant.other_name && plant.other_name.length > 0 && (
                <div className="mt-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <p className="text-xs text-gray-500 font-semibold mb-1">Otros nombres conocidos:</p>
                    <p className="text-xs text-gray-600 italic">
                        {plant.other_name.slice(0, 3).join(", ")}
                    </p>
                </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

// =========================================
// COMPONENTE PRINCIPAL
// =========================================
function PlantSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Estado para el modal de detalles
  const [selectedPlant, setSelectedPlant] = useState(null);

  // 1. API KEY (Con fallback por si la variable de entorno falla)
  const API_KEY = import.meta.env.VITE_PERENUAL_API_KEY || 'sk-N5sO6910bc312749c13382';

  const searchPlants = async (e) => {
    e.preventDefault();
    if (!searchTerm) return;

    if (!API_KEY) {
      setError("Falta la API Key. Revisa tu configuración.");
      return;
    }

    setLoading(true);
    setError(null);
    setPlants([]);

    try {
      const response = await fetch(
        `https://perenual.com/api/species-list?key=${API_KEY}&q=${searchTerm}`
      );

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error("Límite de API excedido. Intenta más tarde.");
        }
        throw new Error(`Error: ${response.statusText}`);
      }
      
      const data = await response.json();

      // Filtramos datos basura del plan gratuito (Upgrade Plans...)
      const filteredPlants = (data.data || []).map((plant) => ({
        ...plant,
        watering: plant.watering && !plant.watering.includes("Upgrade Plans") ? plant.watering : "No disponible",
        sunlight: plant.sunlight?.[0] && !plant.sunlight[0].includes("Upgrade Plans") ? plant.sunlight : [],
        cycle: plant.cycle && !plant.cycle.includes("Upgrade Plans") ? plant.cycle : "No disponible",
      }));

      setPlants(filteredPlants);
    } catch (err) {
      setError(err.message);
      // Datos dummy por si falla la API (para pruebas)
      setPlants([
        {
          id: 1,
          common_name: "Tomato (Demo)",
          scientific_name: ["Solanum lycopersicum"],
          cycle: "Annual",
          watering: "Frequent",
          sunlight: ["Full sun"],
          default_image: {
            original_url: "https://perenual.com/storage/species_image/1_abies_alba/og/1536px-Abies_alba_SkalitC3A9.jpg",
          },
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 p-4 md:p-6">
      
      {/* --- MODAL EMERGENTE --- */}
      {selectedPlant && (
        <PlantModal 
            plant={selectedPlant} 
            onClose={() => setSelectedPlant(null)} 
        />
      )}

      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Search className="text-green-600" /> Buscar en Perenual
        </h2>

        {/* Buscador */}
        <form onSubmit={searchPlants} className="flex gap-2 mb-8">
          <input
            type="text"
            placeholder="Ej. tomato, beet, corn..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? "..." : "Buscar"}
          </button>
        </form>

        {error && (
          <div className="p-4 mb-6 bg-red-50 text-red-700 rounded-xl border border-red-200 text-sm">
            {error}
          </div>
        )}

        {/* Resultados */}
        <div className="space-y-4">
          {plants.map((plant) => (
            <div
              key={plant.id}
              className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-4 hover:border-green-300 transition-all items-center"
            >
              {/* Imagen de la planta */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center border border-gray-200">
                {plant.default_image?.original_url && plant.default_image.original_url !== "" ? (
                  <img
                    src={plant.default_image.original_url}
                    alt={plant.common_name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = "none"; 
                      e.target.parentElement.classList.add("bg-green-50");
                      // Fallback visual simple
                      e.target.parentElement.innerHTML = '<svg ... class="text-green-300" ...></svg>'; 
                    }}
                  />
                ) : (
                  <Leaf className="text-green-300" size={32} />
                )}
              </div>

              {/* Info de la planta */}
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg text-gray-800 capitalize leading-tight truncate">
                  {plant.common_name}
                </h3>
                <p className="text-sm text-gray-500 italic truncate">
                  {plant.scientific_name?.[0]}
                </p>

                <div className="flex flex-wrap gap-2 mt-2">
                  {plant.cycle && (
                    <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full font-medium">
                      {plant.cycle}
                    </span>
                  )}
                  {plant.watering && (
                    <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full font-medium flex items-center gap-1">
                      <Droplets size={12} /> {plant.watering}
                    </span>
                  )}
                </div>
              </div>

              {/* Botón de acción (ABRE EL MODAL) */}
              <div className="pl-2">
                <button
                  onClick={() => setSelectedPlant(plant)} 
                  className="bg-green-600 text-white hover:bg-green-700 p-3 rounded-xl transition-colors shadow-sm active:scale-95"
                  title="Ver detalles completos"
                >
                  <Sprout size={20} />
                </button>
              </div>
            </div>
          ))}
          
          {plants.length === 0 && !loading && !error && (
            <div className="text-center text-gray-400 py-12 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
              <Leaf size={48} className="mx-auto mb-3 opacity-20" />
              <p>Busca un cultivo para ver sus detalles.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PlantSearch;