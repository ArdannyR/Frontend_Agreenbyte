import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Mail, ArrowRight, Loader2, ArrowLeft } from 'lucide-react';
import clienteAxios from './config/clienteAxios';

const OlvidePassword = () => {
    const [email, setEmail] = useState('');
    const [alerta, setAlerta] = useState({});
    const [cargando, setCargando] = useState(false);

    const handleSubmit = async e => {
        e.preventDefault();

        if (email === '' || email.length < 6) {
            setAlerta({
                msg: 'El email es obligatorio',
                error: true
            });
            return;
        }

        try {
            setCargando(true);
            setAlerta({}); // Limpiar alertas previas
            
            // Petición al backend (Asegúrate de tener esta ruta creada en tu API)
            const { data } = await clienteAxios.post('/agricultores/olvide-password', { email });

            setAlerta({
                msg: data.msg,
                error: false
            });

        } catch (error) {
            setAlerta({
                msg: error.response?.data?.msg || 'Hubo un error al enviar la solicitud',
                error: true
            });
        } finally {
            setCargando(false);
        }
    }

    const { msg } = alerta;

    return (
        <div className="min-h-screen bg-green-400 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
            
            {/* --- Header --- */}
            <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center">
                <div className="bg-green-600 p-3 rounded-2xl shadow-lg shadow-green-600/20 mb-6">
                    <Leaf className="text-white h-10 w-10" strokeWidth={1.5} />
                </div>
                <h2 className="text-center text-3xl font-extrabold text-gray-800 tracking-tight">
                    Recuperar Acceso
                </h2>
                <p className="mt-2 text-center text-sm text-gray-900 max-w-xs">
                    Ingresa tu email y te enviaremos las instrucciones para restablecer tu contraseña.
                </p>
            </div>

            {/* --- Form Card --- */}
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-xl shadow-gray-200/50 sm:rounded-3xl sm:px-10 border border-gray-100">
                    
                    {/* Alerta */}
                    {msg && (
                        <div className={`${alerta.error ? 'bg-red-50 text-red-800 border-red-200' : 'bg-green-50 text-green-800 border-green-200'} border px-4 py-3 rounded-xl mb-6 text-sm flex items-center gap-2 animate-fade-in`}>
                            <span className="font-medium">{alerta.error ? 'Error:' : 'Enviado:'}</span>
                            {msg}
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        
                        {/* Email Input */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Correo Electrónico
                            </label>
                            <div className="relative rounded-xl shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                </div>
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    placeholder="tu@correo.com"
                                    className="block w-full pl-10 pr-3 py-3 border-gray-300 rounded-xl focus:ring-green-500 focus:border-green-500 sm:text-sm transition-all hover:border-gray-400"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div>
                            <button
                                type="submit"
                                disabled={cargando}
                                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {cargando ? (
                                    <>
                                        <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                                        Enviando...
                                    </>
                                ) : (
                                    <>
                                        Enviar Instrucciones
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Footer Links */}
                    <div className="mt-8 flex flex-col gap-2 text-center text-sm">
                        <Link to="/login" className="text-gray-500 hover:text-green-600 transition-colors flex items-center justify-center gap-1">
                            <ArrowLeft size={16} /> Volver al Login
                        </Link>
                        <div className="text-gray-400 text-xs mt-2">
                            ¿No tienes cuenta?{' '}
                            <Link to="/registrar" className="font-medium text-green-600 hover:text-green-500">
                                Regístrate
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OlvidePassword;