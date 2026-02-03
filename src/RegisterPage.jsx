import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Lock, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import clienteAxios from './config/clienteAxios';
import fondoRegister from './assets/fondo_register.jpg'; // Recuperamos la imagen

const RegisterPage = () => {
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repetirPassword, setRepetirPassword] = useState('');
    
    const [alerta, setAlerta] = useState({});
    const [cargando, setCargando] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if ([nombre, email, password, repetirPassword].includes('')) {
            setAlerta({ msg: 'Todos los campos son obligatorios', error: true });
            return;
        }

        if (password !== repetirPassword) {
            setAlerta({ msg: 'Los passwords no coinciden', error: true });
            return;
        }

        if (password.length < 6) {
            setAlerta({ msg: 'El password es muy corto, agrega mínimo 6 caracteres', error: true });
            return;
        }

        setAlerta({});
        setCargando(true);

        try {
            // Nota: El endpoint es '/api/administradores' según tu backend
            await clienteAxios.post('/api/administradores', { nombre, email, password });
            
            setAlerta({ msg: 'Cuenta creada correctamente. Revisa tu email.', error: false });
            
            setNombre('');
            setEmail('');
            setPassword('');
            setRepetirPassword('');
        } catch (error) {
            setAlerta({
                msg: error.response?.data?.msg || "Hubo un error al registrarse",
                error: true
            });
        } finally {
            setCargando(false);
        }
    };

    const { msg } = alerta;

    return (
        <div className="flex h-screen w-full bg-white overflow-hidden">
            {/* Sección Izquierda - Formulario (Invertido respecto al login para dinamismo) */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 lg:p-12 bg-white relative overflow-y-auto">
                <Link to="/" className="absolute top-8 left-8 text-gray-500 hover:text-green-600 flex items-center gap-2 transition-colors z-20">
                    <ArrowRight className="rotate-180" size={20} /> Volver al inicio
                </Link>

                <div className="w-full max-w-md space-y-6 mt-10 lg:mt-0">
                    <div className="text-center lg:text-left">
                        <h1 className="text-4xl font-bold text-gray-900 font-space tracking-tight mb-2">
                            Crear Cuenta
                        </h1>
                        <p className="text-gray-500">
                            Únete a Agreenbyte y comienza a gestionar tus huertos.
                        </p>
                    </div>

                    {msg && (
                        <div className={`p-4 rounded-xl flex items-center gap-3 text-sm font-medium animate-fade-in-down ${alerta.error ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-green-50 text-green-700 border border-green-100'}`}>
                            <AlertCircle size={20} />
                            {msg}
                        </div>
                    )}

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Nombre Completo</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400 group-focus-within:text-green-500 transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Juan Pérez"
                                    className="block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all bg-gray-50 focus:bg-white"
                                    value={nombre}
                                    onChange={e => setNombre(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Email</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-green-500 transition-colors" />
                                </div>
                                <input
                                    type="email"
                                    placeholder="correo@ejemplo.com"
                                    className="block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all bg-gray-50 focus:bg-white"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Contraseña</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-green-500 transition-colors" />
                                    </div>
                                    <input
                                        type="password"
                                        placeholder="••••••"
                                        className="block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all bg-gray-50 focus:bg-white"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Repetir Contraseña</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-green-500 transition-colors" />
                                    </div>
                                    <input
                                        type="password"
                                        placeholder="••••••"
                                        className="block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all bg-gray-50 focus:bg-white"
                                        value={repetirPassword}
                                        onChange={e => setRepetirPassword(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={cargando}
                            className="w-full flex justify-center py-4 px-4 border border-transparent rounded-2xl shadow-lg shadow-green-500/30 text-sm font-bold text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all transform hover:-translate-y-0.5 mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                             {cargando ? <Loader2 className="animate-spin" /> : 'Registrarse'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            ¿Ya tienes una cuenta?{' '}
                            <Link to="/login" className="font-bold text-green-600 hover:text-green-500 transition-colors">
                                Inicia Sesión
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            {/* Sección Derecha - Imagen */}
            <div className="hidden lg:flex lg:w-1/2 relative">
                <div className="absolute inset-0 bg-black/20 z-10" />
                <img 
                    src={fondoRegister} 
                    alt="Agricultura tecnológica" 
                    className="w-full h-full object-cover"
                />
            </div>
        </div>
    );
};

export default RegisterPage;