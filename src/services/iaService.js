import axios from 'axios';

// La URL base de tu backend en Render
const API_URL = 'https://fia-backend-project.onrender.com';

// 1. Función para la predicción AUTOMÁTICA (GET)
// Esta no recibe parámetros, solo consulta el estado actual
export const obtenerAlertaHelada = async () => {
    try {
        const response = await axios.get(`${API_URL}/api/v1/prediccion/helada-automatica`);
        return response.data;
    } catch (error) {
        console.error("Error obteniendo alerta de helada:", error);
        throw error;
    }
};

// 2. Función para la predicción MANUAL (POST)
// Esta recibe el objeto JSON que me mostraste
export const predecirTemperatura = async (datos) => {
    try {
        const response = await axios.post(`${API_URL}/api/v1/prediccion/temperatura`, datos);
        return response.data;
    } catch (error) {
        console.error("Error en predicción manual:", error);
        throw error;
    }
};