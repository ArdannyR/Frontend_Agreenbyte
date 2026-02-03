import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, AlertCircle, Loader2, ArrowRight, UserCheck, Tractor } from 'lucide-react';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import useAuth from './hooks/useAuth';
import clienteAxios from './config/clienteAxios';
import fondoLogin from './assets/fondo_login.jpg';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [esAgricultor, setEsAgricultor] = useState(false); // Estado para el rol
    const [alerta, setAlerta] = useState({});
    const [cargando, setCargando] = useState(false);

    const { setAuth } = useAuth();
    const navigate = useNavigate();

    // ID de Cliente de Google (Asegúrate de que coincida con el de Google Cloud Console)
    const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "846514170336-j50frmki30h52rt0rbrbplibtv1nrooc.apps.googleusercontent.com";

    const handleSubmit = async (e) => {
        e.preventDefault();

        if ([email, password].includes('')) {
            setAlerta({ msg: 'Todos los campos son obligatorios', error: true });
            return;
        }

        try {
            setCargando(true);
            localStorage.removeItem('token');
            localStorage.removeItem('rol'); 

            // Decidir endpoint según el rol seleccionado
            const url = esAgricultor ? '/api/agricultores/login' : '/api/administradores/login';

            const { data } = await clienteAxios.post(url, { email, password });

            setAlerta({});

            // Guardamos token y rol
            localStorage.setItem('token', data.token);
            localStorage.setItem('rol', esAgricultor ? 'agricultor' : 'admin');

            setAuth({ ...data, role: esAgricultor ? 'agricultor' : 'admin' });
            navigate('/dashboard');

        } catch (error) {
            setAlerta({
                msg: error.response?.data?.msg || "Credenciales incorrectas",
                error: true
            });
        } finally {
            setCargando(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        if (esAgricultor) {
            setAlerta({ msg: 'El inicio de sesión con Google solo está disponible para Administradores.', error: true });
            return;
        }

        try {
            setCargando(true);
            const { data } = await clienteAxios.post('/api/administradores/google-login', {
                idToken: credentialResponse.credential
            });

            localStorage.setItem('token', data.token);
            localStorage.setItem('rol', 'admin');
            setAuth({ ...data, role: 'admin' });
            navigate('/dashboard');

        } catch (error) {
            console.error("Error Google Login:", error);
            setAlerta({ 
                msg: error.response?.data?.msg || 'Error al iniciar sesión con Google', 
                error: true 
            });
        } finally {
            setCargando(false);
        }
    };

    const handleGoogleError = () => {
        setAlerta({ msg: 'Falló la conexión con Google. Revisa tu configuración.', error: true });
    };

    const { msg } = alerta;

    return (
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <div className="flex h-screen w-full bg-white overflow-hidden">
                <div className="hidden lg:flex lg:w-1/2 relative">
                    <div className="absolute inset-0 bg-green-900/40 z-10" />
                    <img src={fondoLogin} alt="Campo de cultivo" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-white p-12 text-center">
                        <h2 className="text-5xl font-bold mb-6 font-space">Bienvenido</h2>
                        <p className="text-xl max-w-md font-light leading-relaxed">
                            Gestión inteligente para cultivos de alto rendimiento.
                        </p>
                    </div>
                </div>

                <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 lg:p-16 bg-white relative overflow-y-auto">
                    <Link to="/" className="absolute top-8 left-8 text-gray-500 hover:text-green-600 flex items-center gap-2 transition-colors">
                        <ArrowRight className="rotate-180" size={20} /> Volver
                    </Link>

                    <div className="w-full max-w-md space-y-8 mt-12 lg:mt-0">
                        <div className="text-center lg:text-left">
                            <h1 className="text-4xl font-bold text-gray-900 font-space tracking-tight mb-2">Iniciar Sesión</h1>
                            <p className="text-gray-500">Selecciona tu perfil e ingresa.</p>
                        </div>

                        {/* SELECTOR DE ROL */}
                        <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
                            <button
                                type="button"
                                onClick={() => { setEsAgricultor(false); setAlerta({}); }}
                                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all ${!esAgricultor ? 'bg-white text-green-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                <UserCheck size={18} /> Administrador
                            </button>
                            <button
                                type="button"
                                onClick={() => { setEsAgricultor(true); setAlerta({}); }}
                                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all ${esAgricultor ? 'bg-white text-green-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                <Tractor size={18} /> Agricultor
                            </button>
                        </div>

                        {msg && (
                            <div className={`p-4 rounded-xl flex items-center gap-3 text-sm font-medium animate-fade-in-down ${alerta.error ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-green-50 text-green-700 border border-green-100'}`}>
                                <AlertCircle size={20} />
                                {msg}
                            </div>
                        )}

                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Email</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-green-500 transition-colors" />
                                        </div>
                                        <input type="email" className="block w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all bg-gray-50 focus:bg-white" value={email} onChange={e => setEmail(e.target.value)} required />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Contraseña</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-green-500 transition-colors" />
                                        </div>
                                        <input type="password" className="block w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all bg-gray-50 focus:bg-white" value={password} onChange={e => setPassword(e.target.value)} required />
                                    </div>
                                </div>
                            </div>

                            {/* --- ENLACE OLVIDÉ CONTRASEÑA --- */}
                            <div className="flex items-center justify-end">
                                <Link 
                                    to="/olvide-password" 
                                    className="text-sm font-medium text-green-600 hover:text-green-500 transition-colors hover:underline"
                                >
                                    ¿Olvidaste tu contraseña?
                                </Link>
                            </div>

                            <button type="submit" disabled={cargando} className="w-full flex justify-center py-4 px-4 border border-transparent rounded-2xl shadow-lg shadow-green-500/30 text-sm font-bold text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed">
                                {cargando ? <Loader2 className="animate-spin" /> : 'Ingresar'}
                            </button>
                        </form>

                        {/* SECCIÓN DE GOOGLE LOGIN (Solo para administradores) */}
                        {!esAgricultor && (
                            <div className="mt-6">
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-300"></div>
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-2 bg-white text-gray-500">O inicia sesión con</span>
                                    </div>
                                </div>

                                <div className="mt-6 flex justify-center">
                                    <GoogleLogin
                                        onSuccess={handleGoogleSuccess}
                                        onError={handleGoogleError}
                                        useOneTap
                                        theme="outline"
                                        shape="pill"
                                        width="100%"
                                        text="continue_with"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="mt-8 text-center pb-8">
                            <p className="text-sm text-gray-600">
                                ¿No tienes una cuenta?{' '}
                                <Link to="/registrar" className="font-bold text-green-600 hover:text-green-500 transition-colors">
                                    Regístrate aquí
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </GoogleOAuthProvider>
    );
};

export default LoginPage;