import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import clienteAxios from './config/clienteAxios';
import useAuth from './hooks/useAuth';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [alerta, setAlerta] = useState({});
    const [cargando, setCargando] = useState(false);

    const { setAuth } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async e => {
        e.preventDefault();

        if([email, password].includes('')) {
            setAlerta({
                msg: 'Todos los campos son obligatorios',
                error: true
            });
            return;
        }

        try {
            setCargando(true);
            setAlerta({});
            // Hacemos la petición al backend
            const { data } = await clienteAxios.post('/agricultores/login', { email, password });
            
            // Guardamos el token en localStorage
            localStorage.setItem('token', data.token);
            
            // Actualizamos el estado global de autenticación
            setAuth(data);

            // Redirigimos al dashboard
            navigate('/dashboard');
        } catch (error) {
            setAlerta({
                msg: error.response?.data?.msg || 'Hubo un error al iniciar sesión',
                error: true
            });
        } finally {
            setCargando(false);
        }
    }

    const { msg } = alerta;

    return (
        <div className="min-h-screen bg-green-400 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
            
            {/* --- Logo Header --- */}
            <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center">
                <div className="bg-green-600 p-3 rounded-2xl shadow-lg shadow-green-600/20 mb-6">
                    <Leaf className="text-white h-10 w-10" strokeWidth={1.5} />
                </div>
                <h2 className="text-center text-3xl font-extrabold text-gray-900 tracking-tight">
                    Bienvenido de nuevo
                </h2>
                <p className="mt-2 text-center text-sm text-gray-900 max-w">
                    Accede a tu panel de control y monitorea tu huerto inteligente en tiempo real.
                </p>
            </div>

            {/* --- Form Card --- */}
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-xl shadow-gray-200/50 sm:rounded-3xl sm:px-10 border border-gray-100">
                    
                    {/* Alerta de Error */}
                    {msg && (
                        <div className={`${alerta.error ? 'bg-red-50 text-red-800 border-red-200' : 'bg-green-50 text-green-800 border-green-200'} border px-4 py-3 rounded-xl mb-6 text-sm flex items-center gap-2 animate-fade-in`}>
                            <span className="font-medium">{alerta.error ? 'Error:' : 'Éxito:'}</span>
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
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    placeholder="tu@correo.com"
                                    className="block w-full pl-10 pr-3 py-3 border-gray-300 rounded-xl focus:ring-green-500 focus:border-green-500 sm:text-sm transition-all hover:border-gray-400"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <label htmlFor="password" class="block text-sm font-medium text-gray-700">
                                    Contraseña
                                </label>
                                <div className="text-sm">
                                    <Link to="/olvide-password" class="font-medium text-green-600 hover:text-green-500 transition-colors">
                                        ¿Olvidaste tu contraseña?
                                    </Link>
                                </div>
                            </div>
                            <div className="relative rounded-xl shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    placeholder="••••••••"
                                    className="block w-full pl-10 pr-3 py-3 border-gray-300 rounded-xl focus:ring-green-500 focus:border-green-500 sm:text-sm transition-all hover:border-gray-400"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
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
                                        Iniciando sesión...
                                    </>
                                ) : (
                                    <>
                                        Acceder
                                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Divider */}
                    <div className="mt-8">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white text-gray-500">
                                    ¿No tienes una cuenta?
                                </span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <Link
                                to="/registrar"
                                className="w-full flex justify-center items-center py-3 px-4 border-2 border-gray-200 rounded-xl shadow-sm text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all"
                            >
                                Crear cuenta nueva
                            </Link>
                        </div>
                    </div>
                </div>
                
                {/* Footer Link */}
                <p className="mt-8 text-center text-xs text-gray-500">
                    <Link to="/" className="hover:text-green-600 transition-colors flex items-center justify-center gap-1">
                        ← Volver al inicio
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;