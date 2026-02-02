// src/pages/ModuloIA.jsx
import React, { useState, useEffect } from 'react';
import { obtenerAlertaHelada, predecirTemperatura } from '../services/iaService';

const ModuloIA = () => {
    // --- ESTADO PARA LA ALERTA AUTOMÁTICA ---
    const [alertaAuto, setAlertaAuto] = useState(null);
    const [loadingAuto, setLoadingAuto] = useState(true);

    // --- ESTADO PARA EL SIMULADOR MANUAL ---
    const [datosManual, setDatosManual] = useState({
        temp_max: '',
        temp_min: '',
        lluvia: '',
        mes: ''
    });
    const [resultadoManual, setResultadoManual] = useState(null);
    const [loadingManual, setLoadingManual] = useState(false);

    // 1. Cargar la alerta automática al iniciar la página
    useEffect(() => {
        const cargarAlerta = async () => {
            try {
                const data = await obtenerAlertaHelada();
                setAlertaAuto(data);
            } catch (error) {
                console.error("No se pudo cargar la alerta");
            } finally {
                setLoadingAuto(false);
            }
        };
        cargarAlerta();
    }, []);

    // 2. Manejar el envío del formulario manual
    const handleSimulacion = async (e) => {
        e.preventDefault();
        setLoadingManual(true);
        
        // Convertimos a números porque los inputs suelen ser strings
        const payload = {
            temp_max: parseFloat(datosManual.temp_max),
            temp_min: parseFloat(datosManual.temp_min),
            lluvia: parseFloat(datosManual.lluvia),
            mes: parseInt(datosManual.mes)
        };

        try {
            const respuesta = await predecirTemperatura(payload);
            setResultadoManual(respuesta);
        } catch (error) {
            alert("Error al realizar la simulación. Revisa la conexión.");
        } finally {
            setLoadingManual(false);
        }
    };

    const handleChange = (e) => {
        setDatosManual({
            ...datosManual,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold text-green-800 text-center">Inteligencia Artificial Agrícola</h1>

            {/* --- SECCIÓN 1: ALERTA AUTOMÁTICA --- */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h2 className="text-xl font-semibold mb-4 text-gray-700">📍 Estado Actual (Latacunga)</h2>
                
                {loadingAuto ? (
                    <p className="text-gray-500 animate-pulse">Analizando clima en tiempo real...</p>
                ) : alertaAuto ? (
                    <div className={`p-4 rounded-md ${alertaAuto.alerta_helada ? 'bg-red-100 border-red-400' : 'bg-green-100 border-green-400'} border`}>
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">{alertaAuto.alerta_helada ? '❄️' : '✅'}</span>
                            <div>
                                <h3 className="font-bold text-lg">{alertaAuto.mensaje}</h3>
                                <p className="text-sm text-gray-600 mt-1">
                                    Datos: Máx {alertaAuto.condiciones_hoy?.max}°C | 
                                    Mín {alertaAuto.condiciones_hoy?.min}°C | 
                                    Lluvia {alertaAuto.condiciones_hoy?.lluvia}mm
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p className="text-red-500">No se pudo conectar con el servidor de clima.</p>
                )}
            </div>

            {/* --- SECCIÓN 2: SIMULADOR MANUAL --- */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h2 className="text-xl font-semibold mb-4 text-gray-700">🧪 Simulador de Predicciones</h2>
                <p className="text-sm text-gray-500 mb-4">Ingresa datos hipotéticos para probar el modelo.</p>

                <form onSubmit={handleSimulacion} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Temperatura Máxima (°C)</label>
                        <input type="number" name="temp_max" required step="0.1"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                            value={datosManual.temp_max} onChange={handleChange} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Temperatura Mínima (°C)</label>
                        <input type="number" name="temp_min" required step="0.1"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                            value={datosManual.temp_min} onChange={handleChange} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Lluvia (mm)</label>
                        <input type="number" name="lluvia" required step="0.1"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                            value={datosManual.lluvia} onChange={handleChange} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Mes (1-12)</label>
                        <input type="number" name="mes" required min="1" max="12"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                            value={datosManual.mes} onChange={handleChange} />
                    </div>

                    <div className="md:col-span-2">
                        <button type="submit" disabled={loadingManual}
                            className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition disabled:bg-gray-400">
                            {loadingManual ? 'Calculando...' : 'Predecir Escenario'}
                        </button>
                    </div>
                </form>

                {/* RESULTADO MANUAL */}
                {resultadoManual && (
                    <div className="mt-6 p-4 bg-gray-50 rounded border border-gray-200">
                        <h3 className="font-bold text-gray-800">Resultados de la Simulación:</h3>
                        <pre className="mt-2 text-sm text-gray-600 overflow-auto bg-gray-100 p-2 rounded">
                            {JSON.stringify(resultadoManual, null, 2)}
                        </pre>
                        {/* Nota: Personaliza aquí cómo quieres mostrar el JSON devuelto */}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ModuloIA;