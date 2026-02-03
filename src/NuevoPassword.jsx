import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Leaf, Lock, ArrowRight, Loader2, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import clienteAxios from './config/clienteAxios';

const NuevoPassword = () => {
    const [password, setPassword] = useState('');
    const [repetirPassword, setRepetirPassword] = useState('');
    const [tokenValido, setTokenValido] = useState(false);
    const [alerta, setAlerta] = useState({});
    const [passwordModificado, setPasswordModificado] = useState(false);
    const [cargando, setCargando] = useState(true);
    const [esAgricultor, setEsAgricultor] = useState(false); // Estado para saber si es agricultor o admin

    // Usamos useRef para evitar la doble ejecución estricta de React 18 en desarrollo
    const efectoEjecutado = useRef(false);

    const params = useParams();
    const { token } = params;

    useEffect(() => {
        const comprobarToken = async () => {
            // Evitamos que se ejecute dos veces en modo desarrollo
            if (efectoEjecutado.current) return;
            efectoEjecutado.current = true;

            try {
                // Intentamos primero como Administrador
                try {
                    await clienteAxios(`/api/administradores/olvide-password/${token}`);
                    setTokenValido(true);
                    setEsAgricultor(false);
                } catch (errorAdmin) {
                    // Si falla, intentamos como Agricultor
                    await clienteAxios(`/api/agricultores/olvide-password/${token}`);
                    setTokenValido(true);
                    setEsAgricultor(true);
                }
                
            } catch (error) {
                console.log(error); 
                setAlerta({
                    msg: 'Token no válido o expirado',
                    error: true
                });
            } finally {
                setCargando(false);
            }
        };
        
        if (token) {
            comprobarToken();
        }
    }, []);

    const handleSubmit = async e => {
        e.preventDefault();

        if (password.length < 6) {
            setAlerta({
                msg: 'La contraseña debe tener mínimo 6 caracteres',
                error: true
            });
            return;
        }

        if (password !== repetirPassword) {
            setAlerta({
                msg: 'Las contraseñas no coinciden',
                error: true
            });
            return;
        }

        try {
            // Usamos la ruta correcta según lo detectado
            const url = esAgricultor 
                ? `/api/agricultores/olvide-password/${token}`
                : `/api/administradores/olvide-password/${token}`;

            const { data } = await clienteAxios.post(url, { password });
            
            setAlerta({
                msg: data.msg,
                error: false
            });
            setPasswordModificado(true);
        } catch (error) {
            setAlerta({
                msg: error.response?.data?.msg || 'Error al guardar la contraseña',
                error: true
            });
        }
    };

    const { msg } = alerta;

    if (cargando) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
                <Loader2 className="animate-spin h-12 w-12 text-green-600 mb-4" />
                <p className="text-gray-500 font-medium">Verificando enlace de seguridad...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#BEF035] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
            
            <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center mb-6">
                <div className="bg-green-600 p-3 rounded-2xl shadow-lg shadow-green-600/20 mb-4">
                    <Leaf className="text-white h-10 w-10" strokeWidth={1.5} />
                </div>
                <h2 className="text-center text-3xl font-extrabold text-gray-900 tracking-tight">
                    Restablecer Contraseña
                </h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-xl shadow-gray-200/50 sm:rounded-3xl sm:px-10 border border-gray-100">
                    
                    {/* MENSAJES DE ALERTA */}
                    {msg && (
                        <div className={`border px-4 py-3 rounded-xl mb-6 text-sm flex items-center gap-3 animate-fade-in ${alerta.error ? 'bg-red-50 text-red-800 border-red-200' : 'bg-green-50 text-green-800 border-green-200'}`}>
                            {alerta.error ? <XCircle size={20} /> : <CheckCircle size={20} />}
                            <span className="font-medium">{msg}</span>
                        </div>
                    )}

                    {/* ESCENARIO 1: Token Válido -> Mostrar Formulario */}
                    {tokenValido && !passwordModificado && (
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nueva Contraseña</label>
                                <div className="relative rounded-xl shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="password"
                                        placeholder="Mínimo 6 caracteres"
                                        className="block w-full pl-10 pr-3 py-3 border-gray-300 rounded-xl focus:ring-green-500 focus:border-green-500 sm:text-sm transition-all"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Repetir Nueva Contraseña</label>
                                <div className="relative rounded-xl shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="password"
                                        placeholder="Confirma tu contraseña"
                                        className="block w-full pl-10 pr-3 py-3 border-gray-300 rounded-xl focus:ring-green-500 focus:border-green-500 sm:text-sm transition-all"
                                        value={repetirPassword}
                                        onChange={e => setRepetirPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all hover:shadow-lg hover:shadow-green-600/20"
                            >
                                Guardar Nueva Contraseña
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </button>
                        </form>
                    )}

                    {/* ESCENARIO 2: Contraseña Modificada -> Ir al Login */}
                    {passwordModificado && (
                        <div className="text-center">
                            <p className="text-gray-600 mb-6 text-sm">
                                Tu contraseña ha sido actualizada correctamente. Ahora puedes acceder con tus nuevas credenciales.
                            </p>
                            <Link
                                to="/login"
                                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-green-600 hover:bg-green-700 transition-all"
                            >
                                Iniciar Sesión
                            </Link>
                        </div>
                    )}

                    {/* ESCENARIO 3: Token Inválido -> Volver a solicitar */}
                    {!tokenValido && !passwordModificado && (
                        <div className="text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                                <AlertTriangle className="h-6 w-6 text-red-600" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Enlace Expirado o Inválido</h3>
                            <p className="text-sm text-gray-500 mb-6">
                                Este enlace no es válido. Es posible que ya lo hayas usado, que haya caducado, o que estés intentando acceder con el rol incorrecto.
                            </p>
                            <Link 
                                to="/olvide-password" 
                                className="text-sm font-medium text-green-600 hover:text-green-500 hover:underline"
                            >
                                Solicitar un nuevo enlace
                            </Link>
                        </div>
                    )}
                </div>
                
                <p className="mt-8 text-center text-xs text-gray-900">
                    © 2025 Agreenbyte
                </p>
            </div>
        </div>
    );
};

export default NuevoPassword;