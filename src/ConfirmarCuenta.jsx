import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2, ArrowRight } from 'lucide-react';
import clienteAxios from './config/clienteAxios';

const ConfirmarCuenta = () => {
    const [cuentaConfirmada, setCuentaConfirmada] = useState(false);
    const [cargando, setCargando] = useState(true);
    const [alerta, setAlerta] = useState({});
    
    // 1. Usamos useRef para evitar la doble ejecución en modo desarrollo (React.StrictMode)
    const efectoEjecutado = useRef(false);

    const params = useParams();
    const { token } = params;

    useEffect(() => {
        const confirmarCuenta = async () => {
            try {
                const url = `/agricultores/confirmar/${token}`;
                const { data } = await clienteAxios(url);

                setCuentaConfirmada(true);
                setAlerta({
                    msg: data.msg, 
                    error: false
                });
            } catch (error) {
                setAlerta({
                    msg: error.response?.data?.msg || 'Token no válido o cuenta ya confirmada',
                    error: true
                });
            } finally {
                setCargando(false);
            }
        };
        
        // 2. Verificamos si ya se ejecutó el efecto
        if (efectoEjecutado.current) return;
        efectoEjecutado.current = true;

        if(token) {
            confirmarCuenta();
        }
        
    }, []); 

    return (
        <div className="min-h-screen bg-green-400 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-xl shadow-gray-200/50 sm:rounded-3xl sm:px-10 border border-gray-100 text-center">
                    
                    {/* ESTADO DE CARGA */}
                    {cargando && (
                        <div className="flex flex-col items-center justify-center py-10">
                            <Loader2 className="h-16 w-16 text-green-600 animate-spin mb-4" />
                            <h2 className="text-xl font-semibold text-gray-700">Verificando tu cuenta...</h2>
                            <p className="text-gray-500 mt-2">Por favor espera un momento.</p>
                        </div>
                    )}

                    {/* RESULTADO FINAL (Ya no carga) */}
                    {!cargando && (
                        <div className="flex flex-col items-center animate-fade-in-up">
                            
                            {/* ICONO */}
                            <div className={`rounded-full p-4 mb-6 ${alerta.error ? 'bg-red-100' : 'bg-green-100'}`}>
                                {alerta.error ? (
                                    <XCircle className="h-16 w-16 text-red-600" />
                                ) : (
                                    <CheckCircle className="h-16 w-16 text-green-600" />
                                )}
                            </div>

                            {/* TÍTULO */}
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                {alerta.error ? '¡Ups! Algo salió mal' : '¡Cuenta Verificada!'}
                            </h2>

                            {/* MENSAJE */}
                            <p className="text-gray-600 mb-8 max-w-xs mx-auto">
                                {alerta.msg}
                            </p>

                            {/* BOTÓN DE ACCIÓN */}
                            {cuentaConfirmada ? (
                                <Link
                                    to="/login"
                                    className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all group"
                                >
                                    Iniciar Sesión
                                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            ) : (
                                <div className="space-y-3 w-full">
                                    <p className="text-sm text-gray-500">
                                        Si crees que esto es un error, intenta solicitar el enlace nuevamente o intenta iniciar sesión si ya lo confirmaste antes.
                                    </p>
                                    <Link
                                        to="/"
                                        className="block w-full py-3 px-4 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-all"
                                    >
                                        Volver al Inicio
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ConfirmarCuenta;