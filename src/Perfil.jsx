import React, { useState, useEffect } from 'react';
// Importamos nuevos iconos: Phone, MapPin
import { User, Mail, Save, AlertCircle, CheckCircle, Phone, MapPin } from 'lucide-react';
import useAuth from './hooks/useAuth';
import clienteAxios from './config/clienteAxios';

const Perfil = () => {
    const { auth, setAuth } = useAuth();
    const [perfil, setPerfil] = useState({});
    const [alerta, setAlerta] = useState({});

    useEffect(() => {
        setPerfil(auth);
    }, [auth]);

    const handleSubmit = async e => {
        e.preventDefault();
        const { nombre, email } = perfil;

        if([nombre, email].includes('')) {
            setAlerta({
                msg: 'Nombre y Email son obligatorios',
                error: true
            });
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if(!token) return;

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clienteAxios.put('/agricultores/perfil', perfil, config);

            setAuth(data);
            setAlerta({
                msg: 'Perfil Actualizado Correctamente',
                error: false
            });
            
            // Ocultar alerta después de 3 segundos
            setTimeout(() => setAlerta({}), 3000);

        } catch (error) {
            setAlerta({
                msg: error.response?.data?.msg || 'Error al actualizar',
                error: true
            });
        }
    }

    const { msg } = alerta;

    return (
        <div className="flex justify-center mt-10 px-4 mb-20">
            <div className="w-full max-w-2xl bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
                
                <div className="flex flex-col items-center mb-8">
                    <div className="bg-green-100 p-4 rounded-full mb-3">
                        <User size={40} className="text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">Mi Perfil</h2>
                    <p className="text-gray-500 text-sm">Gestiona tu información personal</p>
                </div>

                {msg && (
                    <div className={`flex items-center gap-2 p-3 rounded-lg text-sm mb-6 animate-fade-in ${alerta.error ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                        {alerta.error ? <AlertCircle size={18}/> : <CheckCircle size={18}/>}
                        {msg}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Nombre */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User size={18} className="text-gray-400" />
                                </div>
                                <input 
                                    type="text"
                                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:ring-green-500 focus:border-green-500 transition-colors"
                                    placeholder="Tu Nombre"
                                    name="nombre"
                                    value={perfil.nombre || ''}
                                    onChange={e => setPerfil({ ...perfil, [e.target.name]: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Apellido */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User size={18} className="text-gray-400" />
                                </div>
                                <input 
                                    type="text"
                                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:ring-green-500 focus:border-green-500 transition-colors"
                                    placeholder="Tu Apellido"
                                    name="apellido"
                                    value={perfil.apellido || ''}
                                    onChange={e => setPerfil({ ...perfil, [e.target.name]: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail size={18} className="text-gray-400" />
                                </div>
                                <input 
                                    type="email"
                                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:ring-green-500 focus:border-green-500 transition-colors"
                                    placeholder="correo@ejemplo.com"
                                    name="email"
                                    value={perfil.email || ''}
                                    onChange={e => setPerfil({ ...perfil, [e.target.name]: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Teléfono */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Phone size={18} className="text-gray-400" />
                                </div>
                                <input 
                                    type="tel"
                                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:ring-green-500 focus:border-green-500 transition-colors"
                                    placeholder="0991234567"
                                    name="telefono"
                                    value={perfil.telefono || ''}
                                    onChange={e => setPerfil({ ...perfil, [e.target.name]: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Dirección (Ocupa todo el ancho) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                        <div className="relative">
                            <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                                <MapPin size={18} className="text-gray-400" />
                            </div>
                            <textarea 
                                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:ring-green-500 focus:border-green-500 transition-colors resize-none"
                                placeholder="Ciudad, Calle Principal y Secundaria"
                                rows="3"
                                name="direccion"
                                value={perfil.direccion || ''}
                                onChange={e => setPerfil({ ...perfil, [e.target.name]: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Botón Guardar */}
                    <div className="pt-4">
                        <button 
                            type="submit"
                            className="w-full flex justify-center items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
                        >
                            <Save size={20} />
                            Guardar Cambios
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Perfil;