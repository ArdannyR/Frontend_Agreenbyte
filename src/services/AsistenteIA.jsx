import React, { useState } from 'react';
import { consultarIA } from './iaService'

const AsistenteIA = () => {
    // Ajusta estos estados según lo que necesite tu IA (pH, humedad, etc.)
    const [inputData, setInputData] = useState({
        pregunta: '', 
        // o si es numérico: ph: 0, humedad: 0
    });
    const [resultado, setResultado] = useState(null);
    const [cargando, setCargando] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setCargando(true);
        try {
            const respuesta = await consultarIA(inputData);
            setResultado(respuesta); // Guardamos lo que respondió la IA
        } catch (error) {
            alert("Hubo un error consultando a la IA");
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-green-700">Asistente de Cultivos (IA)</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Ejemplo de input */}
                <div>
                    <label className="block text-gray-700">Consulta o Datos:</label>
                    <input 
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded mt-1"
                        value={inputData.pregunta}
                        onChange={(e) => setInputData({...inputData, pregunta: e.target.value})}
                        placeholder="Escribe aquí..."
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={cargando}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
                >
                    {cargando ? 'Analizando...' : 'Consultar IA'}
                </button>
            </form>

            {resultado && (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded">
                    <h3 className="font-bold text-green-800">Resultado:</h3>
                    {/* Aquí muestras la respuesta. Si es un objeto JSON, usa JSON.stringify para probar */}
                    <p>{JSON.stringify(resultado)}</p>
                </div>
            )}
        </div>
    );
};

export default AsistenteIA;