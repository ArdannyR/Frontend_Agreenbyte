import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import clienteAxios from './config/clienteAxios';
import useAuth from './hooks/useAuth';
import backgroundImage from './assets/fondo_login.jpg'

const LoginPage = () => {

    useEffect(() => {
        const link = document.createElement('link');
        link.href = 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap';
        link.rel = 'stylesheet';
        document.head.appendChild(link);
        return () => document.head.removeChild(link);
    }, []);

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
        <div className="min-h-screen flex font-sans overflow-hidden">
            
            <style>{`.font-space { font-family: 'Space Grotesk', sans-serif; }`}</style>

            {/* --- Left Side: Image --- */}
            <div className="hidden lg:flex lg:flex-[6.5] relative">
                <img 
                    src={backgroundImage} 
                    alt="Greenhouse with tomatoes" 
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
            </div>

            {/* --- Right Side: Login Form --- */}
            <div className="w-full lg:flex-[3.5] bg-[#BEF035] flex items-center justify-center px-6 py-12">
                <div className="w-full max-w-md">
                    
                    {/* --- Logo Header --- */}
                    <div className="flex flex-col items-center mb-8">
                        <div className="bg-green-600 p-4 rounded-2xl shadow-lg mb-6">
                            <Leaf className="text-white h-12 w-12" strokeWidth={1.5} />
                        </div>
                        <h2 className="text-center text-3xl font-bold font-space text-gray-900 tracking-tight">
                            Bienvenido de nuevo
                        </h2>
                        <p className="mt-2 text-center text-sm text-gray-800 font-space">
                            Accede a tu panel de control y monitorea tu huerto<br/>
                            inteligente en tiempo real.
                        </p>
                    </div>

                    {/* --- Form Card --- */}
                    <div className="bg-white py-8 px-8 shadow-2xl rounded-3xl">
                        
                        {/* Alerta de Error */}
                        {msg && (
                            <div className={`${alerta.error ? 'bg-red-50 text-red-800 border-red-200' : 'bg-green-50 text-green-800 border-green-200'} border px-4 py-3 rounded-xl mb-6 text-sm flex items-center gap-2 animate-fade-in`}>
                                <span className="font-medium">{alerta.error ? 'Error:' : 'Éxito:'}</span>
                                {msg}
                            </div>
                        )}

                        <form className="space-y-5" onSubmit={handleSubmit}>
                            
                            {/* Email Input */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-space text-gray-700 mb-2">
                                    Correo Electrónico:
                                </label>
                                <div className="relative rounded-xl">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        placeholder=""
                                        className="block w-full px-4 py-3 bg-gray-100 border-0 rounded-xl focus:ring-2 focus:ring-green-600 focus:bg-white sm:text-sm transition-all font-space"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Password Input */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-space text-gray-700 mb-2">
                                    Contraseña:
                                </label>
                                <div className="relative rounded-xl">
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="current-password"
                                        required
                                        placeholder=""
                                        className="block w-full px-4 py-3 bg-gray-100 border-0 rounded-xl focus:ring-2 focus:ring-green-600 focus:bg-white sm:text-sm transition-all font-space"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={cargando}
                                    className="w-full flex justify-center items-center py-3.5 px-4 border-0 rounded-xl shadow-sm text-sm font-semibold font-space text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {cargando ? (
                                        <>
                                            <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                                            Iniciando sesión...
                                        </>
                                    ) : (
                                        <>
                                            Acceder
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>

                        {/* Divider */}
                        <div className="mt-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300" />
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-4 bg-white text-gray-600 font-space">
                                        ¿No tienes una cuenta?
                                    </span>
                                </div>
                            </div>

                            <div className="mt-6">
                                <Link
                                    to="/registrar"
                                    className="w-full flex justify-center items-center py-3 px-4 border-2 border-gray-300 rounded-xl text-sm font-semibold font-space text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 transition-all"
                                >
                                    Crear cuenta nueva
                                </Link>
                            </div>
                        </div>
                    </div>
                    
                    {/* Footer Link */}
                    <p className="mt-6 text-center text-sm text-gray-800">
                        <Link to="/" className="hover:text-green-700 transition-colors flex items-center justify-center gap-1 font-space font-medium">
                            ← Volver al inicio
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;