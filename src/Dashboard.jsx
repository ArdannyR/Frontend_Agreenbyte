import React, { useState } from 'react';
import { Droplets, Thermometer, Wind, Sun, FlaskConical, MapPin, TrendingUp } from 'lucide-react';

// ===========================================
// DATOS SIMULADOS POR PROVINCIA (CLIMA + SUELO)
// ===========================================
const datosSimulados = {
    PICHINCHA: {
        temp: { valor: 11.3, unidad: '°C', estado: 'Muy Nuboso', tendencia: -0.8 },
        humedad: { valor: 88, unidad: '%', estado: 'Baja Evaporación', tendencia: 1.2 },
        viento: { valor: 2.1, unidad: 'm/s', estado: 'Exterior', tendencia: 0.5 },
        // Nuevos datos de suelo simulados
        suelo: { n: 45, p: 30, k: 60, ph: 6.5, ppm: 850, estado: 'Fértil' }
    },
    GUAYAS: {
        temp: { valor: 31.5, unidad: '°C', estado: 'Despejado', tendencia: 2.5 },
        humedad: { valor: 65, unidad: '%', estado: 'Alta Evaporación', tendencia: -2.1 },
        viento: { valor: 4.8, unidad: 'm/s', estado: 'Costero', tendencia: 1.1 },
        suelo: { n: 70, p: 80, k: 40, ph: 7.2, ppm: 1200, estado: 'Salino' }
    },
    AZUAY: {
        temp: { valor: 18.0, unidad: '°C', estado: 'Llovizna', tendencia: 0.1 },
        humedad: { valor: 95, unidad: '%', estado: 'Saturado', tendencia: 3.5 },
        viento: { valor: 0.5, unidad: 'm/s', estado: 'Calma', tendencia: -0.3 },
        suelo: { n: 55, p: 50, k: 55, ph: 6.0, ppm: 920, estado: 'Ácido' }
    },
    MANABI: {
        temp: { valor: 29.2, unidad: '°C', estado: 'Nublado', tendencia: 1.5 },
        humedad: { valor: 70, unidad: '%', estado: 'Húmedo', tendencia: -0.5 },
        viento: { valor: 3.5, unidad: 'm/s', estado: 'Moderado', tendencia: 0.8 },
        suelo: { n: 60, p: 75, k: 50, ph: 7.0, ppm: 1100, estado: 'Neutro' }
    },
    LOJA: {
        temp: { valor: 22.4, unidad: '°C', estado: 'Soleado', tendencia: 0.4 },
        humedad: { valor: 55, unidad: '%', estado: 'Seco', tendencia: -1.2 },
        viento: { valor: 5.2, unidad: 'm/s', estado: 'Fuerte', tendencia: 2.0 },
        suelo: { n: 30, p: 40, k: 80, ph: 6.8, ppm: 780, estado: 'Seco' }
    },
    IMBABURA: {
        temp: { valor: 15.6, unidad: '°C', estado: 'Nublado', tendencia: -1.0 },
        humedad: { valor: 82, unidad: '%', estado: 'Húmedo', tendencia: 0.9 },
        viento: { valor: 1.8, unidad: 'm/s', estado: 'Suave', tendencia: 0.2 },
        suelo: { n: 80, p: 60, k: 70, ph: 6.2, ppm: 1050, estado: 'Volcánico' }
    },
    EL_ORO: {
        temp: { valor: 30.1, unidad: '°C', estado: 'Caluroso', tendencia: 3.0 },
        humedad: { valor: 75, unidad: '%', estado: 'Bochornoso', tendencia: 1.5 },
        viento: { valor: 2.9, unidad: 'm/s', estado: 'Brisa', tendencia: 0.4 },
        suelo: { n: 65, p: 85, k: 45, ph: 7.5, ppm: 1150, estado: 'Alcalino' }
    },
    TUNGURAHUA: {
        temp: { valor: 14.8, unidad: '°C', estado: 'Lluvia', tendencia: -2.5 },
        humedad: { valor: 92, unidad: '%', estado: 'Muy Húmedo', tendencia: 4.0 },
        viento: { valor: 3.0, unidad: 'm/s', estado: 'Rachas', tendencia: 1.2 },
        suelo: { n: 50, p: 55, k: 60, ph: 6.4, ppm: 980, estado: 'Húmedo' }
    },
};

// ===========================================
// COMPONENTE: SelectorProvincia
// ===========================================
function SelectorProvincia({ provincia, setProvincia }) {
    const provinciasEcuador = [
        { id: 'PICHINCHA', nombre: 'Pichincha (Sierra)' },
        { id: 'GUAYAS', nombre: 'Guayas (Costa)' },
        { id: 'AZUAY', nombre: 'Azuay (Andes Sur)' },
        { id: 'MANABI', nombre: 'Manabí (Costa)' },
        { id: 'LOJA', nombre: 'Loja (Sierra Sur)' },
        { id: 'IMBABURA', nombre: 'Imbabura (Sierra Norte)' },
        { id: 'EL_ORO', nombre: 'El Oro (Costa Sur)' },
        { id: 'TUNGURAHUA', nombre: 'Tungurahua (Sierra Centro)' },
    ];

    return (
        <div className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
            <MapPin size={20} className="text-green-600 shrink-0" />
            <span className="text-sm font-medium text-gray-700 hidden sm:inline">Ubicación de Referencia:</span>
            <select
                value={provincia}
                onChange={(e) => setProvincia(e.target.value)}
                className="flex-1 min-w-0 p-2 text-sm border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 transition-colors cursor-pointer bg-white"
            >
                {provinciasEcuador.map(p => (
                    <option key={p.id} value={p.id}>{p.nombre}</option>
                ))}
            </select>
        </div>
    );
}

// ===========================================
// COMPONENTE: MetricCard
// ===========================================
function MetricCard({ title, value, unit, statusText, change, isPositive, icon }) {
    // CORRECCIÓN AQUÍ: Validamos si 'change' es un número
    let positive = isPositive;
    
    if (positive === undefined && change !== undefined) {
        // Si es número, es positivo si es mayor o igual a 0
        if (typeof change === 'number') {
            positive = change >= 0;
        } else {
            // Si fuera string (código antiguo), chequeamos si no empieza con '-'
            positive = !String(change).startsWith('-');
        }
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
            
            {statusText && <p className="text-xs text-gray-500 font-medium leading-normal">{statusText}</p>}

            {change !== undefined && (
                <div className="flex items-center gap-1 text-xs font-medium mt-auto">
                    <span className={changeColor}>{change > 0 ? `+${change}` : change}%</span>
                    <div className={`w-1.5 h-1.5 rounded-full ${dotColor}`}></div>
                </div>
            )}
        </div>
    );
}

// ===========================================
// COMPONENTE PRINCIPAL: Dashboard
// ===========================================
function Dashboard() {
    const [provinciaSeleccionada, setProvinciaSeleccionada] = useState('PICHINCHA');
    
    // Obtener datos según selección (fallback a Pichincha si no existe)
    const datosApi = datosSimulados[provinciaSeleccionada] || datosSimulados['PICHINCHA'];

    // Datos fijos IoT (Humedad Suelo y Luz siguen fijos por ahora, pero Nutrientes ya no)
    const datosIoT = {
        humedadSuelo: { valor: 62, unit: '%', change: 1.2, isPositive: true, icon: <Droplets size={20} /> },
        luz: { valor: 50, unit: 'k Lux', change: 5.0, isPositive: true, icon: <Sun size={20} /> },
    };

    // Función auxiliar para generar el path del SVG de temperatura
    const getPathD = (temp) => {
        const baseHeight = 50; 
        const peak = Math.max(10, baseHeight - temp); 
        return `M0,40 Q25,${peak + 10} 50,${peak} T100,${peak - 5}`;
    };

    const getAreaPathD = (temp) => {
        const d = getPathD(temp);
        return `${d} V50 H0 Z`;
    };

    return (
        <div className="flex-1 p-4 md:p-6 space-y-6">
            
            <SelectorProvincia 
                provincia={provinciaSeleccionada} 
                setProvincia={setProvinciaSeleccionada} 
            />

            <div className="flex gap-2 p-1 overflow-x-auto">
                <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full bg-green-100 text-green-700 px-4 text-sm font-medium">Live</button>
                <button className="h-9 px-4 text-gray-500 hover:bg-gray-100 rounded-full text-sm font-medium transition-colors">24H</button>
                <button className="h-9 px-4 text-gray-500 hover:bg-gray-100 rounded-full text-sm font-medium transition-colors">7D</button>
                <button className="h-9 px-4 text-gray-500 hover:bg-gray-100 rounded-full text-sm font-medium transition-colors">1M</button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                <MetricCard title="Temp. Aire" value={datosApi.temp.valor} unit={datosApi.temp.unidad} statusText={datosApi.temp.estado} change={datosApi.temp.tendencia} icon={<Thermometer size={20} />} />
                <MetricCard title="Humedad Aire" value={datosApi.humedad.valor} unit={datosApi.humedad.unidad} statusText={datosApi.humedad.estado} change={datosApi.humedad.tendencia} icon={<Droplets size={20} />} />
                <MetricCard title="Viento" value={datosApi.viento.valor} unit={datosApi.viento.unidad} statusText={datosApi.viento.estado} change={datosApi.viento.tendencia} icon={<Wind size={20} />} />
                
                <MetricCard title="Humedad Suelo" value={datosIoT.humedadSuelo.valor} unit={datosIoT.humedadSuelo.unit} change={datosIoT.humedadSuelo.change} icon={datosIoT.humedadSuelo.icon} />
                <MetricCard title="Luz" value={datosIoT.luz.valor} unit={datosIoT.luz.unit} change={datosIoT.luz.change} icon={datosIoT.luz.icon} />
                
                {/* Métricas de Nutrientes ahora son DINÁMICAS */}
                <MetricCard title="Nutrientes" value={datosApi.suelo.ppm} unit="PPM" statusText={datosApi.suelo.estado} icon={<FlaskConical size={20} />} />
            </div>

            {/* GRÁFICOS VISUALES */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 py-4">

                {/* Gráfico 1: Tendencias Climáticas */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between min-h-[300px]">
                   <div>
                      <h3 className="text-gray-500 font-medium mb-1 flex items-center gap-2">
                        <TrendingUp size={18} className="text-blue-500" /> Tendencias Climáticas ({provinciaSeleccionada})
                      </h3>
                      <p className="text-3xl font-bold text-gray-800">
                        {datosApi.temp.valor}°C
                        <span className="text-sm font-normal text-gray-500 ml-2">{datosApi.temp.estado}</span>
                      </p>
                   </div>
                   
                   <div className="h-48 mt-4 w-full relative">
                        <svg className="w-full h-full overflow-visible" viewBox="0 0 100 50" preserveAspectRatio="none">
                            <line x1="0" y1="10" x2="100" y2="10" stroke="#f3f4f6" strokeWidth="0.5" />
                            <line x1="0" y1="25" x2="100" y2="25" stroke="#e5e7eb" strokeWidth="0.5" strokeDasharray="2" />
                            <line x1="0" y1="40" x2="100" y2="40" stroke="#f3f4f6" strokeWidth="0.5" />
                            
                            <path 
                                d={getAreaPathD(datosApi.temp.valor)} 
                                fill="url(#gradientBlue)" 
                                opacity="0.3" 
                                className="transition-all duration-1000 ease-in-out"
                            />
                            
                            <path 
                                d={getPathD(datosApi.temp.valor)} 
                                fill="none" 
                                stroke="#3b82f6" 
                                strokeWidth="2" 
                                strokeLinecap="round" 
                                className="drop-shadow-sm transition-all duration-1000 ease-in-out"
                            />
                            
                            <defs>
                                <linearGradient id="gradientBlue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#3b82f6" />
                                    <stop offset="100%" stopColor="white" stopOpacity="0" />
                                </linearGradient>
                            </defs>
                        </svg>
                        <div className="flex justify-between text-xs text-gray-400 mt-2">
                            <span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>24:00</span>
                        </div>
                   </div>
                </div>

                {/* Gráfico 2: Nivel de Nutrientes (DINÁMICO) */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between min-h-[300px]">
                    <div>
                      <h3 className="text-gray-500 font-medium mb-1 flex items-center gap-2">
                         <FlaskConical size={18} className="text-red-500" /> Composición del Suelo ({provinciaSeleccionada})
                      </h3>
                      <p className="text-3xl font-bold text-gray-800">
                         {datosApi.suelo.ppm} PPM
                         <span className="text-sm font-normal text-gray-500 ml-2">{datosApi.suelo.estado}</span>
                      </p>
                   </div>
                   
                   {/* Gráfico de Barras Dinámico */}
                   <div className="h-48 mt-4 w-full flex items-end justify-around gap-4 px-4">
                        {/* Barra N */}
                        <div className="flex flex-col items-center gap-2 w-1/4 h-full justify-end group">
                            <div className="text-xs font-bold text-gray-600 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">{datosApi.suelo.n}%</div>
                            <div className="w-full bg-red-100 rounded-t-lg relative overflow-hidden transition-all duration-700 ease-out" style={{ height: `${datosApi.suelo.n}%` }}>
                                <div className="absolute bottom-0 w-full h-1 bg-red-400"></div>
                            </div>
                            <span className="text-xs font-medium text-gray-500">Nitrogeno (N)</span>
                        </div>
                        {/* Barra P */}
                        <div className="flex flex-col items-center gap-2 w-1/4 h-full justify-end group">
                            <div className="text-xs font-bold text-gray-600 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">{datosApi.suelo.p}%</div>
                            <div className="w-full bg-green-100 rounded-t-lg relative overflow-hidden transition-all duration-700 ease-out" style={{ height: `${datosApi.suelo.p}%` }}>
                                <div className="absolute bottom-0 w-full h-1 bg-green-400"></div>
                            </div>
                            <span className="text-xs font-medium text-gray-500">Fósforo (P)</span>
                        </div>
                        {/* Barra K */}
                        <div className="flex flex-col items-center gap-2 w-1/4 h-full justify-end group">
                            <div className="text-xs font-bold text-gray-600 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">{datosApi.suelo.k}%</div>
                            <div className="w-full bg-yellow-100 rounded-t-lg relative overflow-hidden transition-all duration-700 ease-out" style={{ height: `${datosApi.suelo.k}%` }}>
                                <div className="absolute bottom-0 w-full h-1 bg-yellow-400"></div>
                            </div>
                            <span className="text-xs font-medium text-gray-500">Potasio (K)</span>
                        </div>
                        {/* Barra pH */}
                        <div className="flex flex-col items-center gap-2 w-1/4 h-full justify-end group">
                            <div className="text-xs font-bold text-gray-600 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">{datosApi.suelo.ph}</div>
                            {/* Ajustamos la altura visual del pH multiplicando por 10 para que sea visible (7.0 -> 70%) */}
                            <div className="w-full bg-blue-100 rounded-t-lg relative overflow-hidden transition-all duration-700 ease-out" style={{ height: `${datosApi.suelo.ph * 10}%` }}>
                                <div className="absolute bottom-0 w-full h-1 bg-blue-400"></div>
                            </div>
                            <span className="text-xs font-medium text-gray-500">pH</span>
                        </div>
                   </div>
                </div>

            </div>
        </div>
    );
}

export default Dashboard;