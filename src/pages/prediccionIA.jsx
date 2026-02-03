import React, { useState, useEffect } from 'react';
import { 
    Calculator, ArrowRight, BrainCircuit, Thermometer, Sun 
} from "lucide-react";
// 1. IMPORTAR YUP
import * as yup from 'yup';
import { obtenerAlertaHelada, predecirTemperatura } from '../services/iaService';

// --- DEFINICIÓN DEL ESQUEMA YUP (LÓGICA) ---
const validationSchema = yup.object().shape({
    temp_max: yup.number()
        .typeError('Debe ser un número')
        .required('Campo obligatorio'),
    temp_min: yup.number()
        .typeError('Debe ser un número')
        .required('Campo obligatorio')
        .lessThan(yup.ref('temp_max'), 'Debe ser menor a la Máxima'), // Validación cruzada
    lluvia: yup.number()
        .typeError('Debe ser un número')
        .min(0, 'No puede ser negativo')
        .required('Campo obligatorio'),
    mes: yup.number()
        .typeError('Debe ser un número')
        .integer('Debe ser entero')
        .min(1, 'Entre 1 y 12')
        .max(12, 'Entre 1 y 12')
        .required('Campo obligatorio')
});

// --- COMPONENTE 1: TARJETA DE ALERTA AUTOMÁTICA (INTACTO) ---
function AlertaIACard({ data, loading }) {
    if (loading) {
        return (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-pulse flex items-center gap-4">
                <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
            </div>
        );
    }
    if (!data) return null;

    const esPeligroso = data.alerta_helada;
    const colorBg = esPeligroso ? "bg-red-50" : "bg-blue-50";
    const colorBorder = esPeligroso ? "border-red-200" : "border-blue-200";
    const colorText = esPeligroso ? "text-red-800" : "text-blue-800";

    return (
        <div className={`${colorBg} border ${colorBorder} p-6 rounded-2xl shadow-sm mb-6 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden`}>
            <div className="absolute -right-10 -top-10 opacity-10">
                <BrainCircuit size={150} />
            </div>
            <div className="flex items-start gap-4 z-10">
                <div className={`p-3 rounded-full ${esPeligroso ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                    {esPeligroso ? <Thermometer size={32} /> : <Sun size={32} />}
                </div>
                <div>
                    <h3 className={`text-lg font-bold ${colorText} flex items-center gap-2`}>
                        IA: Análisis en Tiempo Real
                        <span className="text-xs px-2 py-0.5 bg-white/50 rounded-full border border-black/5 uppercase tracking-wider">Live API</span>
                    </h3>
                    <p className="text-gray-700 font-medium text-xl mt-1">{data.mensaje}</p>
                    <p className="text-sm text-gray-500 mt-1">Ubicación detectada: {data.ubicacion}</p>
                </div>
            </div>
            <div className="flex gap-8 z-10 text-center md:text-right">
                <div><p className="text-xs text-gray-500 uppercase font-bold">Máxima</p><p className="text-xl font-bold text-gray-800">{data.condiciones_hoy?.max}°C</p></div>
                <div><p className="text-xs text-gray-500 uppercase font-bold">Mínima</p><p className="text-xl font-bold text-gray-800">{data.condiciones_hoy?.min}°C</p></div>
                <div><p className="text-xs text-gray-500 uppercase font-bold">Lluvia</p><p className="text-xl font-bold text-gray-800">{data.condiciones_hoy?.lluvia}mm</p></div>
            </div>
        </div>
    );
}

// --- COMPONENTE 2: WIDGET SIMULADOR (CON YUP, MISMO DISEÑO) ---
function SimuladorWidget() {
    const [inputs, setInputs] = useState({
        temp_max: '', temp_min: '', lluvia: '', mes: ''
    });
    const [resultado, setResultado] = useState(null);
    const [loading, setLoading] = useState(false);
    
    // Estados para manejo de errores YUP
    const [errors, setErrors] = useState({}); 
    const [apiError, setApiError] = useState(""); 

    const handleChange = (e) => {
        setErrors({ ...errors, [e.target.name]: null }); // Limpiar error al escribir
        setApiError(""); 
        setInputs({ ...inputs, [e.target.name]: e.target.value });
    };

    const handleSimular = async (e) => {
        e.preventDefault();
        setApiError("");
        setErrors({}); 

        try {
            // 2. EJECUCIÓN DE YUP
            await validationSchema.validate(inputs, { abortEarly: false });

            setLoading(true);
            const payload = {
                temp_max: parseFloat(inputs.temp_max),
                temp_min: parseFloat(inputs.temp_min),
                lluvia: parseFloat(inputs.lluvia),
                mes: parseInt(inputs.mes)
            };
            const data = await predecirTemperatura(payload);
            setResultado(data);

        } catch (err) {
            if (err.inner) { // Errores de validación
                const newErrors = {};
                err.inner.forEach((error) => newErrors[error.path] = error.message);
                setErrors(newErrors);
            } else { // Errores de API
                console.error(err);
                setApiError("Error de conexión con la IA.");
            }
        } finally {
            if (!errors) setLoading(false); // Solo apagar loading si no fue error de validación inmediato
            setLoading(false);
        }
    };

    const obtenerEstiloResultado = (temp) => {
        if (!temp && temp !== 0) return { bg: "bg-gray-50", text: "text-gray-500", border: "border-gray-200", icon: "text-gray-400" };
        if (temp < 10) return { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", icon: "text-blue-500", label: "Frío" };
        if (temp < 24) return { bg: "bg-green-50", text: "text-green-700", border: "border-green-200", icon: "text-green-500", label: "Templado" };
        return { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200", icon: "text-orange-500", label: "Caluroso" };
    };

    const valorPredicho = resultado?.prediccion_temperatura;
    const estilos = obtenerEstiloResultado(valorPredicho);

    // Helper para mantener tus clases originales + borde rojo si hay error
    const getInputClass = (fieldName) => `w-full mt-1 p-2 bg-gray-50 border rounded-lg outline-none transition-all ${errors[fieldName] ? 'border-red-300 focus:ring-2 focus:ring-red-200' : 'border-gray-200 focus:ring-2 focus:ring-purple-500'}`;

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
            <div className="flex items-center gap-2 mb-4">
                <div className="bg-[#128762] p-2 rounded-lg text-white">
                    <Calculator size={20} />
                </div>
                <h3 className="text-lg font-bold text-gray-800">Simulador de Escenarios (IA)</h3>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                <form onSubmit={handleSimular} className="flex-1 grid grid-cols-2 gap-4">
                    {/* INPUTS CON ESTRUCTURA ORIGINAL */}
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">T. Máxima (°C)</label>
                        <input type="number" step="0.1" name="temp_max" 
                            className={getInputClass('temp_max')} 
                            placeholder="Ej: 22.5" onChange={handleChange} />
                        {errors.temp_max && <p className="text-red-500 text-xs mt-1 font-medium">{errors.temp_max}</p>}
                    </div>

                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">T. Mínima (°C)</label>
                        <input type="number" step="0.1" name="temp_min" 
                            className={getInputClass('temp_min')} 
                            placeholder="Ej: 10.2" onChange={handleChange} />
                        {errors.temp_min && <p className="text-red-500 text-xs mt-1 font-medium">{errors.temp_min}</p>}
                    </div>

                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">Lluvia (mm)</label>
                        <input type="number" step="0.1" name="lluvia" 
                            className={getInputClass('lluvia')} 
                            placeholder="Ej: 3.5" onChange={handleChange} />
                        {errors.lluvia && <p className="text-red-500 text-xs mt-1 font-medium">{errors.lluvia}</p>}
                    </div>

                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">Mes (1-12)</label>
                        <input type="number" name="mes" 
                            className={getInputClass('mes')} 
                            placeholder="Ej: 2" onChange={handleChange} />
                        {errors.mes && <p className="text-red-500 text-xs mt-1 font-medium">{errors.mes}</p>}
                    </div>

                    {/* ERROR GENERAL DE API (Mantiene tu diseño de alerta) */}
                    {apiError && (
                        <div className="col-span-2 bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-200 font-medium animate-pulse">
                            {apiError}
                        </div>
                    )}

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="col-span-2 bg-[#16A34A] hover:bg-green-700 text-white font-bold py-2 rounded-lg transition-colors flex justify-center items-center gap-2 disabled:bg-gray-400"
                    >
                        {loading ? 'Calculando...' : <>Simular Predicción <ArrowRight size={16} /></>}
                    </button>
                </form>

                {/* TARJETA RESULTADO (DISEÑO ORIGINAL) */}
                <div className={`flex-1 rounded-xl border ${estilos.border} ${estilos.bg} p-4 flex flex-col justify-center items-center text-center min-h-[150px] transition-all duration-500`}>
                    {!resultado ? (
                        <div className="text-gray-400">
                            <Calculator size={40} className="mx-auto mb-2 opacity-20" />
                            <p className="text-sm">Ingresa los datos para obtener una predicción.</p>
                        </div>
                    ) : (
                        <div className="w-full animate-fade-in">
                            <p className="text-xs font-bold text-gray-500 uppercase mb-4 tracking-wider">Resultado del Modelo</p>
                            <div className="flex flex-col items-center justify-center">
                                <Thermometer size={48} className={`mb-2 ${estilos.icon}`} />
                                <div className="flex items-end justify-center gap-1">
                                    <span className={`text-5xl font-extrabold ${estilos.text}`}>
                                        {valorPredicho.toFixed(1)}
                                    </span>
                                    <span className={`text-xl font-medium ${estilos.text} mb-2`}>
                                        {resultado.unidad}
                                    </span>
                                </div>
                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mt-2 bg-white/50 border ${estilos.border} ${estilos.text}`}>
                                    {estilos.label}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// --- PÁGINA PRINCIPAL (INTACTO) ---
const PrediccionIA = () => {
    const [datosIA, setDatosIA] = useState(null);
    const [loadingIA, setLoadingIA] = useState(true);

    useEffect(() => {
        const cargarDatosIA = async () => {
            try {
                const data = await obtenerAlertaHelada();
                setDatosIA(data);
            } catch (error) {
                console.error("Error cargando IA", error);
            } finally {
                setLoadingIA(false);
            }
        };
        cargarDatosIA();
    }, []);

    return (
        <div className="flex-1 p-4 md:p-6 space-y-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="bg-[#128762] p-2 rounded-xl shadow-lg shadow-purple-200">
                    <BrainCircuit className="text-white" size={24} />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 leading-tight">Centro de Inteligencia (IA)</h1>
                    <p className="text-gray-500 text-sm">Predicciones climáticas y análisis de riesgos en tiempo real.</p>
                </div>
            </div>

            <AlertaIACard data={datosIA} loading={loadingIA} />
            <SimuladorWidget />
        </div>
    );
};

export default PrediccionIA;