import React, { useState, useEffect } from "react";
import {
    Droplets, Thermometer, Wind, Sun, FlaskConical, MapPin,
    TrendingUp, Sprout, Info, LogOut, Loader2, ArrowLeft
} from "lucide-react";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler } from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import clienteAxios from '../config/clienteAxios';
import useAuth from '../hooks/useAuth';
import io from 'socket.io-client';

// Registro de ChartJS
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler);

// ===========================================
// COMPONENTES AUXILIARES
// ===========================================

function SelectorHuerto({ huertos, seleccionado, setSeleccionado }) {
    if (!huertos.length) return <div className="text-gray-500 mb-4 font-medium p-4 bg-white rounded-xl border border-gray-200">No tienes huertos asignados.</div>;

    return (
        <div className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
            <MapPin size={20} className="text-green-600 shrink-0" />
            <span className="text-sm font-medium text-gray-700 hidden sm:inline">
                Huerto Activo:
            </span>
            <select
                value={seleccionado}
                onChange={(e) => setSeleccionado(e.target.value)}
                className="flex-1 min-w-0 p-2 text-sm border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 transition-colors cursor-pointer bg-white outline-none"
            >
                {huertos.map((h) => (
                    <option key={h._id} value={h._id}>
                        {h.nombre} ({h.tipoCultivo}) - {h.ubicacion}
                    </option>
                ))}
            </select>
        </div>
    );
}

function MetricCard({ title, value, unit, statusText, change, isPositive, icon }) {
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
                <span className="text-gray-400 bg-gray-50 p-2 rounded-lg">{icon}</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 leading-none">
                {value}
                <span className="text-lg font-normal ml-1 text-gray-500">{unit}</span>
            </p>
            {statusText && (
                <p className="text-xs text-gray-500 font-medium leading-normal bg-gray-50 inline-block px-2 py-1 rounded">
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

function RecommendationCard({ tipoCultivo }) {
    const recomendaciones = {
        "Tomate": {
            motivo: "El tomate requiere temperaturas constantes entre 20-24°C. Vigila la humedad para evitar hongos.",
            imagen: "https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg?auto=compress&cs=tinysrgb&w=600"
        },
        "Maiz": {
            motivo: "El maíz es exigente en nitrógeno. Asegura una buena fertilización en esta etapa.",
            imagen: "https://images.pexels.com/photos/547263/pexels-photo-547263.jpeg?auto=compress&cs=tinysrgb&w=600"
        },
        "Papa": {
            motivo: "Suelo franco-arenoso es ideal. Mantén la humedad pero evita encharcamientos.",
            imagen: "https://images.pexels.com/photos/144248/potatoes-vegetables-erdfrucht-bio-144248.jpeg?auto=compress&cs=tinysrgb&w=600"
        }
    };

    const data = recomendaciones[tipoCultivo] || {
        motivo: `Mantén las condiciones estables para tu cultivo de ${tipoCultivo || 'plantas'}. Revisa los sensores periódicamente.`,
        imagen: "https://images.pexels.com/photos/2132227/pexels-photo-2132227.jpeg?auto=compress&cs=tinysrgb&w=600"
    };

    return (
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl shadow-sm border border-green-100 flex flex-col md:flex-row gap-6 items-center animate-fade-in mt-6">
            <div className="w-full md:w-1/3">
                <div className="relative aspect-video md:aspect-square rounded-xl overflow-hidden shadow-md group">
                    <img
                        src={data.imagen}
                        alt="Cultivo"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-green-700 flex items-center gap-1 shadow-sm">
                        <Sprout size={12} /> {tipoCultivo || "General"}
                    </div>
                </div>
            </div>
            <div className="w-full md:w-2/3 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">
                        Estado del Cultivo
                    </h3>
                </div>
                <div className="bg-white p-4 rounded-xl border border-green-100 flex items-start gap-3 shadow-sm">
                    <div className="bg-blue-50 p-2 rounded-full text-blue-600 shrink-0 mt-0.5">
                        <Info size={20} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
                            Recomendación Agronómica
                        </p>
                        <p className="text-gray-700 text-sm leading-relaxed">
                            {data.motivo}
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

// Aceptamos props nuevas: initialHuertoId (para preseleccionar) y onBack (para volver al admin)
function AgricultorDashboard({ initialHuertoId, onBack }) {
    const { auth } = useAuth();
    const [huertos, setHuertos] = useState([]);
    const [huertoId, setHuertoId] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const obtenerMisHuertos = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;
            const config = { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` } };

            try {
                // Obtenemos huertos (si es admin trae todos los suyos, si es agricultor los asignados)
                const { data } = await clienteAxios.get('/api/huertos', config);
                
                setHuertos(data);
                if (data.length > 0) {
                    // Si se pasó un ID inicial (desde Admin), úsalo. Si no, usa el primero.
                    if (initialHuertoId && data.some(h => h._id === initialHuertoId)) {
                        setHuertoId(initialHuertoId);
                    } else {
                        setHuertoId(data[0]._id);
                    }
                }
            } catch (error) {
                console.error("Error cargando huertos:", error);
            } finally {
                setLoading(false);
            }
        };
        obtenerMisHuertos();

        const socket = io(import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000');
        socket.on('connect', () => console.log('🔌 Conectado a Socket.io'));
        socket.on('sensor:data', (newData) => {
            setHuertos(prevHuertos => {
                return prevHuertos.map(h => {
                    if (h._id === newData.huertoId) {
                        return { ...h, temperatura: newData.temperatura, humedad: newData.humedad };
                    }
                    return h;
                });
            });
        });
        return () => socket.disconnect();
    }, [initialHuertoId]); // Añadimos initialHuertoId a dependencias

    // Simulación
    useEffect(() => {
        const simulationInterval = setInterval(() => {
            setHuertos(currentHuertos => {
                return currentHuertos.map(h => {
                    const baseTemp = parseFloat(h.temperatura) || 20;
                    const baseHum = parseFloat(h.humedad) || 50;
                    const variacionTemp = (Math.random() * 0.8) - 0.4;
                    const variacionHum = Math.floor((Math.random() * 5) - 2);
                    let newTemp = (baseTemp + variacionTemp).toFixed(1);
                    let newHum = baseHum + variacionHum;
                    if (newHum > 100) newHum = 100; if (newHum < 0) newHum = 0;
                    return { ...h, temperatura: newTemp, humedad: newHum };
                });
            });
        }, 5000); 
        return () => clearInterval(simulationInterval);
    }, []);

    const huertoActual = huertos.find(h => h._id === huertoId) || {};

    const generarDatosCurva = (base) => {
        const val = Number(base) || 0;
        if (val === 0) return [0, 0, 0, 0, 0, 0, 0];
        return [val - 1.5, val - 0.5, val + 0.5, val, val + 1.2, val - 0.8, val];
    };

    const dataClima = {
        labels: ["06:00", "09:00", "12:00", "15:00", "18:00", "21:00", "Actual"],
        datasets: [{
            label: "Temperatura (°C)",
            data: generarDatosCurva(huertoActual.temperatura),
            borderColor: "rgb(59, 130, 246)",
            backgroundColor: "rgba(59, 130, 246, 0.2)",
            fill: true,
            tension: 0.4,
        }],
    };

    const optionsClima = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { mode: "index", intersect: false } },
        scales: { y: { grid: { display: true, borderDash: [5, 5] } }, x: { grid: { display: false } } },
    };

    const dataSuelo = {
        labels: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"],
        datasets: [{
            label: "Humedad (%)",
            data: generarDatosCurva(huertoActual.humedad),
            backgroundColor: [
                "rgba(34, 197, 94, 0.7)",
                "rgba(34, 197, 94, 0.7)",
                "rgba(34, 197, 94, 0.7)",
                "rgba(34, 197, 94, 0.7)",
                "rgba(34, 197, 94, 0.7)",
                "rgba(34, 197, 94, 0.7)",
                "rgba(34, 197, 94, 1)", 
            ],
            borderRadius: 6,
        }],
    };

    const optionsSuelo = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true, max: 100 } },
    };

    if (loading) return <div className="flex justify-center items-center h-screen bg-gray-50"><Loader2 className="animate-spin text-green-600" size={50} /></div>;

    return (
        <div className="bg-gray-50 min-h-screen font-sans flex flex-col">
            {/* Header Agricultor (Adaptado para Admin si es necesario) */}
            <div className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-10 px-4 py-3 md:px-8 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    {/* Botón Volver solo si se provee onBack */}
                    {onBack && (
                        <button 
                            onClick={onBack}
                            className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 text-gray-600 transition-colors"
                            title="Volver al Panel"
                        >
                            <ArrowLeft size={20} />
                        </button>
                    )}
                    
                    <div className="flex items-center gap-2">
                        <div className="bg-green-100 p-2 rounded-lg"><Sprout className="text-green-600" size={20}/></div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900 leading-none">Monitor de Cultivos</h1>
                            <p className="text-xs text-gray-500">{auth.role === 'admin' ? 'Vista Admin' : 'Agricultor'}: <span className="font-semibold text-green-600">{auth.nombre}</span></p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 p-4 md:p-6 space-y-6 max-w-7xl mx-auto w-full">
                
                <SelectorHuerto 
                    huertos={huertos} 
                    seleccionado={huertoId} 
                    setSeleccionado={setHuertoId} 
                />

                {huertoActual._id ? (
                    <>
                        <div className="flex gap-2 p-1 overflow-x-auto mb-4">
                            <span className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-green-100 text-green-700 px-3 text-xs font-bold border border-green-200 animate-pulse">
                                En Vivo
                            </span>
                            <span className="text-xs text-gray-400 flex items-center">Sincronizado vía Socket.IO</span>
                        </div>

                        {/* METRICAS */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                            <MetricCard title="Temp. Aire" value={huertoActual.temperatura !== undefined ? huertoActual.temperatura : '--'} unit="°C" statusText={huertoActual.temperatura > 30 ? "Alta" : "Normal"} change={0.5} icon={<Thermometer size={20} />} />
                            <MetricCard title="Humedad" value={huertoActual.humedad !== undefined ? huertoActual.humedad : '--'} unit="%" statusText={huertoActual.humedad < 40 ? "Baja" : "Óptima"} change={-1.2} icon={<Droplets size={20} />} />
                            <MetricCard title="Viento" value="3.5" unit="m/s" statusText="Moderado" icon={<Wind size={20} />} />
                            <MetricCard title="Nutrientes" value="850" unit="PPM" statusText="Fértil" icon={<FlaskConical size={20} />} />
                        </div>

                        {/* GRÁFICOS */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between min-h-[320px]">
                                <div>
                                    <h3 className="text-gray-500 font-medium mb-1 flex items-center gap-2">
                                        <TrendingUp size={18} className="text-blue-500" /> Tendencia Térmica
                                    </h3>
                                    <p className="text-3xl font-bold text-gray-800">{huertoActual.temperatura !== undefined ? huertoActual.temperatura : '--'}°C</p>
                                </div>
                                <div className="h-64 mt-4 w-full"><Line data={dataClima} options={optionsClima} /></div>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between min-h-[320px]">
                                <div>
                                    <h3 className="text-gray-500 font-medium mb-1 flex items-center gap-2">
                                        <FlaskConical size={18} className="text-green-500" /> Historial Humedad
                                    </h3>
                                    <p className="text-3xl font-bold text-gray-800">{huertoActual.humedad !== undefined ? huertoActual.humedad : '--'}%</p>
                                </div>
                                <div className="h-64 mt-4 w-full"><Bar data={dataSuelo} options={optionsSuelo} /></div>
                            </div>
                        </div>

                        <RecommendationCard tipoCultivo={huertoActual.tipoCultivo} />
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
                        <div className="bg-gray-100 p-6 rounded-full mb-4"><Sprout className="text-gray-400" size={48} /></div>
                        <h3 className="text-xl font-bold text-gray-800">No hay datos para mostrar</h3>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AgricultorDashboard;