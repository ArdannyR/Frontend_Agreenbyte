import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, User, Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import clienteAxios from './config/clienteAxios';

const RegisterPage = () => {
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repetirPassword, setRepetirPassword] = useState('');
    const [alerta, setAlerta] = useState({});
    const [cargando, setCargando] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async e => {
        e.preventDefault();

        if ([nombre, email, password, repetirPassword].includes('')) {
            setAlerta({ msg: 'Todos los campos son obligatorios', error: true });
            return;
        }

        if (password !== repetirPassword) {
            setAlerta({ msg: 'Las contraseñas no coinciden', error: true });
            return;
        }

        if (password.length < 6) {
            setAlerta({ msg: 'La contraseña debe tener al menos 6 caracteres', error: true });
            return;
        }

        try {
            setCargando(true);
            setAlerta({});
            
            // Hacemos la petición al backend para registrar
            const { data } = await clienteAxios.post('/agricultores', { nombre, email, password });

            // Mostramos un mensaje de éxito
            setAlerta({
                msg: data.msg, // El mensaje que viene de tu API ("¡Usuario registrado!...")
                error: false
            });

            // Limpiamos formulario
            setNombre('');
            setEmail('');
            setPassword('');
            setRepetirPassword('');

            // Opcional: Redirigir al login después de unos segundos
            setTimeout(() => {
                navigate('/login');
            }, 3000);

        } catch (error) {
            setAlerta({
                msg: error.response?.data?.msg || 'Error al registrar la cuenta',
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
                    Crea tu cuenta
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600 max-w">
                    Regístrate para empezar a monitorear tu huerto.
                </p>
            </div>

            {/* --- Form Card --- */}
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-xl shadow-gray-200/50 sm:rounded-3xl sm:px-10 border border-gray-100">
                    
                    {/* Alerta */}
                    {msg && (
                        <div className={`${alerta.error ? 'bg-red-50 text-red-800 border-red-200' : 'bg-green-50 text-green-800 border-green-200'} border px-4 py-3 rounded-xl mb-6 text-sm flex items-center gap-2 animate-fade-in`}
                        >
                            <span className="font-medium">{alerta.error ? 'Error:' : 'Éxito:'}</span>
                            {msg}
                        </div>
                    )}

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        
                        {/* Nombre Input */}
                        <div>
                            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                                Nombre Completo
                            </label>
                            <div className="relative rounded-xl shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                </div>
                                <input
                                    id="nombre"
                                    type="text"
                                    placeholder="Tu Nombre"
                                    className="block w-full pl-10 pr-3 py-3 border-gray-300 rounded-xl focus:ring-green-500 focus:border-green-500 sm:text-sm transition-all hover:border-gray-400"
                                    value={nombre}
                                    onChange={e => setNombre(e.target.value)}
                                />
                            </div>
                        </div>

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
                                    placeholder="tu@correo.com"
                                    className="block w-full pl-10 pr-3 py-3 border-gray-300 rounded-xl focus:ring-green-500 focus:border-green-500 sm:text-sm transition-all hover:border-gray-400"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div>
                            <label htmlFor="password" class="block text-sm font-medium text-gray-700 mb-1">
                                Contraseña
                            </label>
                            <div className="relative rounded-xl shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                </div>
                                <input
                                    id="password"
                                    type="password"
                                    placeholder="Crea una contraseña (mín. 6 caracteres)"
                                    className="block w-full pl-10 pr-3 py-3 border-gray-300 rounded-xl focus:ring-green-500 focus:border-green-500 sm:text-sm transition-all hover:border-gray-400"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                />
                            </div>
                        </div>
                        
                        {/* Repetir Password Input */}
                        <div>
                            <label htmlFor="repetir-password" class="block text-sm font-medium text-gray-700 mb-1">
                                Repetir Contraseña
                            </label>
                            <div className="relative rounded-xl shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                </div>
                                <input
                                    id="repetir-password"
                                    type="password"
                                    placeholder="Confirma tu contraseña"
                                    className="block w-full pl-10 pr-3 py-3 border-gray-300 rounded-xl focus:ring-green-500 focus:border-green-500 sm:text-sm transition-all hover:border-gray-400"
                                    value={repetirPassword}
                                    onChange={e => setRepetirPassword(e.target.value)}
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
                                        Creando cuenta...
                                    </>
                                ) : (
                                    <>
                                        Crear Cuenta
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Footer Link */}
                    <p className="mt-8 text-center text-sm text-gray-500">
                        ¿Ya tienes una cuenta?{' '}
                        <Link to="/login" className="font-semibold text-green-600 hover:text-green-500 transition-colors">
                            Inicia Sesión
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;