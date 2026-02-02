import React, { useState } from "react";
import {
    Droplets,
    Thermometer,
    Wind,
    Sun,
    FlaskConical,
    MapPin,
    TrendingUp,
    Sprout,
    Info,
} from "lucide-react";

// --- IMPORTACIONES DE CHART.JS ---
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";

// --- REGISTRO DE COMPONENTES DE CHART.JS ---
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

// ===========================================
// DATOS POR PROVINCIA
// ===========================================
const datosSimulados = {
    PICHINCHA: {
    temp: { valor: 11.3, unidad: "°C", estado: "Muy Nuboso", tendencia: -0.8 },
    humedad: {
        valor: 88,
        unidad: "%",
        estado: "Baja Evaporación",
        tendencia: 1.2,
    },
    viento: { valor: 2.1, unidad: "m/s", estado: "Exterior", tendencia: 0.5 },
    suelo: { n: 45, p: 30, k: 60, ph: 6.5, ppm: 850, estado: "Fértil" },
    recomendacion: {
        nombre: "Papa (Solanum tuberosum)",
        motivo:
        "El clima frío de la sierra y el suelo franco-arenoso favorecen el desarrollo de tubérculos de calidad.",
        imagen:
        "https://images.pexels.com/photos/144248/potatoes-vegetables-erdfrucht-bio-144248.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    },
    GUAYAS: {
    temp: { valor: 31.5, unidad: "°C", estado: "Despejado", tendencia: 2.5 },
    humedad: {
        valor: 65,
        unidad: "%",
        estado: "Alta Evaporación",
        tendencia: -2.1,
    },
    viento: { valor: 4.8, unidad: "m/s", estado: "Costero", tendencia: 1.1 },
    suelo: { n: 70, p: 80, k: 40, ph: 7.2, ppm: 1200, estado: "Salino" },
    recomendacion: {
        nombre: "Arroz (Oryza sativa)",
        motivo:
        "Las altas temperaturas y la capacidad de retención de agua de los suelos del Guayas son ideales para el cultivo por inundación.",
        imagen:
        "https://images.pexels.com/photos/4110251/pexels-photo-4110251.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    },
    AZUAY: {
    temp: { valor: 18.0, unidad: "°C", estado: "Llovizna", tendencia: 0.1 },
    humedad: { valor: 95, unidad: "%", estado: "Saturado", tendencia: 3.5 },
    viento: { valor: 0.5, unidad: "m/s", estado: "Calma", tendencia: -0.3 },
    suelo: { n: 55, p: 50, k: 55, ph: 6.0, ppm: 920, estado: "Ácido" },
    recomendacion: {
        nombre: "Maíz (Zea mays)",
        motivo:
        "La humedad constante y las temperaturas moderadas del austro permiten un ciclo de crecimiento estable.",
        imagen:
        "https://images.pexels.com/photos/547263/pexels-photo-547263.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    },
    MANABI: {
    temp: { valor: 29.2, unidad: "°C", estado: "Nublado", tendencia: 1.5 },
    humedad: { valor: 70, unidad: "%", estado: "Húmedo", tendencia: -0.5 },
    viento: { valor: 3.5, unidad: "m/s", estado: "Moderado", tendencia: 0.8 },
    suelo: { n: 60, p: 75, k: 50, ph: 7.0, ppm: 1100, estado: "Neutro" },
    recomendacion: {
        nombre: "Plátano (Musa x paradisiaca)",
        motivo:
        "El clima tropical seco y los suelos ricos en potasio de Manabí maximizan la producción de racimos.",
        imagen:
        "https://images.pexels.com/photos/2872755/pexels-photo-2872755.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    },
    LOJA: {
    temp: { valor: 22.4, unidad: "°C", estado: "Soleado", tendencia: 0.4 },
    humedad: { valor: 55, unidad: "%", estado: "Seco", tendencia: -1.2 },
    viento: { valor: 5.2, unidad: "m/s", estado: "Fuerte", tendencia: 2.0 },
    suelo: { n: 30, p: 40, k: 80, ph: 6.8, ppm: 780, estado: "Seco" },
    recomendacion: {
        nombre: "Café de Altura (Coffea arabica)",
        motivo:
        "La altitud y los microclimas de Loja crean las condiciones perfectas para un café de especialidad.",
        imagen:
        "https://images.pexels.com/photos/894695/pexels-photo-894695.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    },
    IMBABURA: {
    temp: { valor: 15.6, unidad: "°C", estado: "Nublado", tendencia: -1.0 },
    humedad: { valor: 82, unidad: "%", estado: "Húmedo", tendencia: 0.9 },
    viento: { valor: 1.8, unidad: "m/s", estado: "Suave", tendencia: 0.2 },
    suelo: { n: 80, p: 60, k: 70, ph: 6.2, ppm: 1050, estado: "Volcánico" },
    recomendacion: {
      nombre: "Fréjol (Phaseolus vulgaris)",
      motivo:
        "Los suelos volcánicos negros del norte son ricos en nutrientes esenciales para las leguminosas.",
      imagen:
        "https://images.pexels.com/photos/6316514/pexels-photo-6316514.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
  },
  EL_ORO: {
    temp: { valor: 30.1, unidad: "°C", estado: "Caluroso", tendencia: 3.0 },
    humedad: { valor: 75, unidad: "%", estado: "Bochornoso", tendencia: 1.5 },
    viento: { valor: 2.9, unidad: "m/s", estado: "Brisa", tendencia: 0.4 },
    suelo: { n: 65, p: 85, k: 45, ph: 7.5, ppm: 1150, estado: "Alcalino" },
    recomendacion: {
      nombre: "Cacao (Theobroma cacao)",
      motivo:
        "El calor constante y la humedad ambiental favorecen la floración continua del cacao.",
      imagen:
        "https://images.pexels.com/photos/6545542/pexels-photo-6545542.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
  },
  TUNGURAHUA: {
    temp: { valor: 14.8, unidad: "°C", estado: "Lluvia", tendencia: -2.5 },
    humedad: { valor: 92, unidad: "%", estado: "Muy Húmedo", tendencia: 4.0 },
    viento: { valor: 3.0, unidad: "m/s", estado: "Rachas", tendencia: 1.2 },
    suelo: { n: 50, p: 55, k: 60, ph: 6.4, ppm: 980, estado: "Húmedo" },
    recomendacion: {
      nombre: "Mora (Rubus glaucus)",
      motivo:
        "Resistencia a la lluvia y preferencia por los suelos andinos húmedos.",
      imagen:
        "https://images.pexels.com/photos/87818/background-berries-berry-blackberries-87818.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
  },
};

// ===========================================
// COMPONENTES AUXILIARES
// ===========================================
function SelectorProvincia({ provincia, setProvincia }) {
  const provinciasEcuador = [
    { id: "PICHINCHA", nombre: "Pichincha (Sierra)" },
    { id: "GUAYAS", nombre: "Guayas (Costa)" },
    { id: "AZUAY", nombre: "Azuay (Andes Sur)" },
    { id: "MANABI", nombre: "Manabí (Costa)" },
    { id: "LOJA", nombre: "Loja (Sierra Sur)" },
    { id: "IMBABURA", nombre: "Imbabura (Sierra Norte)" },
    { id: "EL_ORO", nombre: "El Oro (Costa Sur)" },
    { id: "TUNGURAHUA", nombre: "Tungurahua (Sierra Centro)" },
  ];

  return (
    <div className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
      <MapPin size={20} className="text-green-600 shrink-0" />
      <span className="text-sm font-medium text-gray-700 hidden sm:inline">
        Ubicación de Referencia:
      </span>
      <select
        value={provincia}
        onChange={(e) => setProvincia(e.target.value)}
        className="flex-1 min-w-0 p-2 text-sm border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 transition-colors cursor-pointer bg-white"
      >
        {provinciasEcuador.map((p) => (
          <option key={p.id} value={p.id}>
            {p.nombre}
          </option>
        ))}
      </select>
    </div>
  );
}

function MetricCard({
  title,
  value,
  unit,
  statusText,
  change,
  isPositive,
  icon,
}) {
  let positive = isPositive;
  if (positive === undefined && change !== undefined) {
    if (typeof change === "number") positive = change >= 0;
    else positive = !String(change).startsWith("-");
  }
  const changeColor = positive ? "text-green-600" : "text-red-500";
  const dotColor = positive ? "bg-green-500" : "bg-red-500";

  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-3 min-h-[140px] transition-all hover:shadow-md">
      <div className="flex items-center justify-between text-gray-500">
        <p className="text-sm font-medium">{title}</p>
        <span className="text-gray-400">{icon}</span>
      </div>
      <p className="text-2xl font-bold text-gray-900 leading-none">
        {value}
        <span className="text-lg font-normal ml-1">{unit}</span>
      </p>
      {statusText && (
        <p className="text-xs text-gray-500 font-medium leading-normal">
          {statusText}
        </p>
      )}
      {change !== undefined && (
        <div className="flex items-center gap-1 text-xs font-medium mt-auto">
          <span className={changeColor}>
            {change > 0 ? `+${change}` : change}%
          </span>
          <div className={`w-1.5 h-1.5 rounded-full ${dotColor}`}></div>
        </div>
      )}
    </div>
  );
}

function RecommendationCard({ recomendacion }) {
  if (!recomendacion) return null;
  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl shadow-sm border border-green-100 flex flex-col md:flex-row gap-6 items-center animate-fade-in">
      <div className="w-full md:w-1/3">
        <div className="relative aspect-video md:aspect-square rounded-xl overflow-hidden shadow-md group">
          <img
            src={recomendacion.imagen}
            alt={recomendacion.nombre}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-green-700 flex items-center gap-1 shadow-sm">
            <Sprout size={12} /> Recomendado
          </div>
        </div>
      </div>
      <div className="w-full md:w-2/3 flex flex-col justify-center">
        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-xl font-bold text-gray-900">
            Cultivo del Día: {recomendacion.nombre}
          </h3>
        </div>
        <div className="bg-white p-4 rounded-xl border border-green-100 flex items-start gap-3 shadow-sm">
          <div className="bg-blue-50 p-2 rounded-full text-blue-600 shrink-0 mt-0.5">
            <Info size={20} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
              Análisis Agronómico
            </p>
            <p className="text-gray-700 text-sm leading-relaxed">
              {recomendacion.motivo}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===========================================
// DASHBOARD PRINCIPAL 
// ===========================================
function Dashboard() {
  const [provinciaSeleccionada, setProvinciaSeleccionada] =
    useState("PICHINCHA");
  const datosApi =
    datosSimulados[provinciaSeleccionada] || datosSimulados["PICHINCHA"];

  const datosIoT = {
    humedadSuelo: {
      valor: 62,
      unit: "%",
      change: 1.2,
      isPositive: true,
      icon: <Droplets size={20} />,
    },
    luz: {
      valor: 50,
      unit: "k Lux",
      change: 5.0,
      isPositive: true,
      icon: <Sun size={20} />,
    },
  };

  // --- CONFIGURACIÓN GRÁFICO 1: LÍNEA DE TENDENCIA (CLIMA) ---

  const generarDatosCurva = (base) => {
    return [base - 2, base - 1, base - 3, base, base + 2, base + 4, base + 1];
  };

  const dataClima = {
    labels: ["06:00", "09:00", "12:00", "15:00", "18:00", "21:00", "00:00"],
    datasets: [
      {
        label: "Temperatura (°C)",
        data: generarDatosCurva(datosApi.temp.valor),
        borderColor: "rgb(59, 130, 246)", 
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        fill: true,
        tension: 0.4, 
      },
    ],
  };

  const optionsClima = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { mode: "index", intersect: false },
    },
    scales: {
      y: { grid: { display: true, borderDash: [5, 5] } },
      x: { grid: { display: false } },
    },
  };

  // --- CONFIGURACIÓN GRÁFICO 2 ---
  const dataSuelo = {
    labels: ["Nitrógeno (N)", "Fósforo (P)", "Potasio (K)", "pH (x10)"],
    datasets: [
      {
        label: "Nivel",
        data: [
          datosApi.suelo.n,
          datosApi.suelo.p,
          datosApi.suelo.k,
          datosApi.suelo.ph * 10,
        ],
        backgroundColor: [
          "rgba(239, 68, 68, 0.7)", // Rojo (N)
          "rgba(34, 197, 94, 0.7)", // Verde (P)
          "rgba(234, 179, 8, 0.7)", // Amarillo (K)
          "rgba(59, 130, 246, 0.7)", // Azul (pH)
        ],
        borderRadius: 6,
      },
    ],
  };

  const optionsSuelo = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: { beginAtZero: true, max: 100 },
    },
  };

  return (
    <div className="flex-1 p-4 md:p-6 space-y-6">
      <SelectorProvincia
        provincia={provinciaSeleccionada}
        setProvincia={setProvinciaSeleccionada}
      />

      <div className="flex gap-2 p-1 overflow-x-auto">
        <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full bg-green-100 text-green-700 px-4 text-sm font-medium">
          Live
        </button>
        <button className="h-9 px-4 text-gray-500 hover:bg-gray-100 rounded-full text-sm font-medium transition-colors">
          24H
        </button>
        <button className="h-9 px-4 text-gray-500 hover:bg-gray-100 rounded-full text-sm font-medium transition-colors">
          7D
        </button>
      </div>

      {/* METRICAS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <MetricCard
          title="Temp. Aire"
          value={datosApi.temp.valor}
          unit={datosApi.temp.unidad}
          statusText={datosApi.temp.estado}
          change={datosApi.temp.tendencia}
          icon={<Thermometer size={20} />}
        />
        <MetricCard
          title="Humedad Aire"
          value={datosApi.humedad.valor}
          unit={datosApi.humedad.unidad}
          statusText={datosApi.humedad.estado}
          change={datosApi.humedad.tendencia}
          icon={<Droplets size={20} />}
        />
        <MetricCard
          title="Viento"
          value={datosApi.viento.valor}
          unit={datosApi.viento.unidad}
          statusText={datosApi.viento.estado}
          change={datosApi.viento.tendencia}
          icon={<Wind size={20} />}
        />
        <MetricCard
          title="Humedad Suelo"
          value={datosIoT.humedadSuelo.valor}
          unit={datosIoT.humedadSuelo.unit}
          change={datosIoT.humedadSuelo.change}
          icon={datosIoT.humedadSuelo.icon}
        />
        <MetricCard
          title="Luz"
          value={datosIoT.luz.valor}
          unit={datosIoT.luz.unit}
          change={datosIoT.luz.change}
          icon={datosIoT.luz.icon}
        />
        <MetricCard
          title="Nutrientes"
          value={datosApi.suelo.ppm}
          unit="PPM"
          statusText={datosApi.suelo.estado}
          icon={<FlaskConical size={20} />}
        />
      </div>

      {/* --- SECCIÓN DE GRÁFICOS INTERACTIVOS CHART.JS --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico 1: Tendencia Lineal */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between min-h-[300px]">
          <div>
            <h3 className="text-gray-500 font-medium mb-1 flex items-center gap-2">
              <TrendingUp size={18} className="text-blue-500" /> Tendencias
              Climáticas ({provinciaSeleccionada})
            </h3>
            <p className="text-3xl font-bold text-gray-800">
              {datosApi.temp.valor}°C
              <span className="text-sm font-normal text-gray-500 ml-2">
                {datosApi.temp.estado}
              </span>
            </p>
          </div>
          <div className="h-64 mt-4 w-full">
            <Line data={dataClima} options={optionsClima} />
          </div>
        </div>

        {/* Gráfico 2: Barras de Suelo */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between min-h-[300px]">
          <div>
            <h3 className="text-gray-500 font-medium mb-1 flex items-center gap-2">
              <FlaskConical size={18} className="text-red-500" /> Composición
              del Suelo
            </h3>
            <p className="text-3xl font-bold text-gray-800">
              {datosApi.suelo.ppm} PPM
              <span className="text-sm font-normal text-gray-500 ml-2">
                {datosApi.suelo.estado}
              </span>
            </p>
          </div>
          <div className="h-64 mt-4 w-full">
            <Bar data={dataSuelo} options={optionsSuelo} />
          </div>
        </div>
      </div>

      {/* RECOMENDACIÓN */}
      <RecommendationCard recomendacion={datosApi.recomendacion} />
    </div>
  );
}

export default Dashboard;
