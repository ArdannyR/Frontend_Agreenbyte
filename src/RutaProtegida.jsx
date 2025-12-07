import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Loader2 } from 'lucide-react'; // Para el spinner de carga
import useAuth from './hooks/useAuth';

const RutaProtegida = () => {
    
    // Obtenemos la información de autenticación y el estado de 'cargando'
    const { auth, cargando } = useAuth();

    // 1. Mostrar un spinner mientras se verifica el token
    if (cargando) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="animate-spin text-green-600 h-16 w-16" />
                    <p className="text-gray-600 font-medium">Verificando sesión...</p>
                </div>
            </div>
        );
    }

    // 2. Una vez que NO está cargando, decidimos:
    return (
        auth?._id ? (
            // Si hay un usuario autenticado (auth._id existe),
            // renderizamos el contenido de la ruta (ej. <Layout />)
            <Outlet />
        ) : (
            // Si no hay usuario, lo redirigimos a la página de login
            <Navigate to="/login" />
        )
    );
};

export default RutaProtegida;