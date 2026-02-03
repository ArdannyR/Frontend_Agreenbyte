import { useEffect, useState } from 'react';
import useAuth from './hooks/useAuth';
import clienteAxios from './config/clienteAxios';
import { User, Mail, Phone, MapPin, Save, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

const Perfil = () => {
    const { auth, setAuth } = useAuth();
    const [perfil, setPerfil] = useState({});
    const [cargando, setCargando] = useState(false);
    const [alerta, setAlerta] = useState({});

    useEffect(() => {
        setPerfil(auth);
    }, [auth]);

    const handleSubmit = async e => {
        e.preventDefault();
        const { nombre, email } = perfil;

        if ([nombre, email].includes('')) {
            setAlerta({
                msg: 'Nombre y Email son obligatorios',
                error: true
            });
            return;
        }

        setCargando(true);
        try {
            const token = localStorage.getItem('token');
            const rol = localStorage.getItem('rol'); // Obtener rol para saber la ruta
            
            // Decidir endpoint dinámicamente
            const url = rol === 'agricultor' 
                ? '/api/agricultores/perfil' 
                : '/api/administradores/perfil';

            const { data } = await clienteAxios.put(url, perfil, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            });

            // CORRECCIÓN CLAVE: Mantener el rol al actualizar el estado global
            // El backend devuelve el usuario actualizado, pero quizás no el campo 'role' virtual que usamos en el login
            const usuarioActualizado = { ...data, role: rol }; 
            
            setAuth(usuarioActualizado); 
            
            setAlerta({
                msg: 'Almacenado Correctamente',
                error: false
            });
        } catch (error) {
            setAlerta({
                msg: error.response?.data?.msg || 'Error al actualizar',
                error: true
            });
        } finally {
            setCargando(false);
        }
    };

    const { msg } = alerta;

    return (
        <div className="max-w-4xl mx-auto mt-10 p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2 font-space">Editar Perfil</h1>
            <p className="text-gray-500 mb-8">Actualiza tu información personal</p>

            <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
                <div className="md:flex">
                    {/* Lateral Izquierdo (Visual) */}
                    <div className="md:w-1/3 bg-gradient-to-br from-green-600 to-emerald-700 p-8 text-white flex flex-col justify-center items-center text-center">
                        <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center text-5xl font-bold mb-4 backdrop-blur-sm border-4 border-white/30">
                            {perfil.nombre ? perfil.nombre.charAt(0).toUpperCase() : <User size={48} />}
                        </div>
                        <h2 className="text-2xl font-bold">{perfil.nombre}</h2>
                        <p className="text-green-100 text-sm mt-1">{perfil.email}</p>
                        <div className="mt-6 px-4 py-1 bg-white/20 rounded-full text-xs font-medium uppercase tracking-wider">
                            {auth.role === 'agricultor' ? 'Agricultor' : 'Administrador'}
                        </div>
                    </div>

                    {/* Formulario */}
                    <div className="md:w-2/3 p-8">
                        {msg && (
                            <div className={`p-4 rounded-xl flex items-center gap-3 text-sm font-medium mb-6 animate-fade-in-down ${alerta.error ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-green-50 text-green-700 border border-green-100'}`}>
                                {alerta.error ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
                                {msg}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Nombre</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                            <User size={18} />
                                        </div>
                                        <input
                                            type="text"
                                            className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all bg-gray-50 focus:bg-white"
                                            placeholder="Tu Nombre"
                                            name="nombre"
                                            value={perfil.nombre || ''}
                                            onChange={e => setPerfil({ ...perfil, [e.target.name]: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Email</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                            <Mail size={18} />
                                        </div>
                                        <input
                                            type="email"
                                            className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all bg-gray-50 focus:bg-white"
                                            placeholder="Tu Email"
                                            name="email"
                                            value={perfil.email || ''}
                                            onChange={e => setPerfil({ ...perfil, [e.target.name]: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Teléfono (Opcional)</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                            <Phone size={18} />
                                        </div>
                                        <input
                                            type="text"
                                            className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all bg-gray-50 focus:bg-white"
                                            placeholder="Ej: 0991234567"
                                            name="telefono"
                                            value={perfil.telefono || ''}
                                            onChange={e => setPerfil({ ...perfil, [e.target.name]: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Dirección (Opcional)</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                            <MapPin size={18} />
                                        </div>
                                        <input
                                            type="text"
                                            className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all bg-gray-50 focus:bg-white"
                                            placeholder="Tu Ciudad"
                                            name="direccion"
                                            value={perfil.direccion || ''}
                                            onChange={e => setPerfil({ ...perfil, [e.target.name]: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={cargando}
                                    className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {cargando ? <Loader2 className="animate-spin" /> : <><Save size={18} /> Guardar Cambios</>}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Perfil;