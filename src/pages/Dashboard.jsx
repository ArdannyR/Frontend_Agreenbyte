import React, { useState, useEffect } from 'react';
import { 
  Users, Sprout, Plus, Trash2, MapPin, Mail, Loader2, LogOut, QrCode, Lock, Link as LinkIcon, CheckCircle, AlertCircle, X, AlertTriangle, Pencil, Unlink
} from 'lucide-react';
import clienteAxios from '../config/clienteAxios';
import useAuth from '../hooks/useAuth';
import AgricultorDashboard from './AgricultorDashboard'; 

// === COMPONENTE TOAST (Notificación Flotante) ===
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000); // Se cierra a los 3 segundos
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'error' ? 'bg-red-50 border-red-200 text-red-800' : 'bg-green-50 border-green-200 text-green-800';
  const Icon = type === 'error' ? AlertCircle : CheckCircle;

  return (
    <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg transition-all animate-fade-in-down ${bgColor}`}>
      <Icon size={20} />
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 hover:opacity-70"><X size={16}/></button>
    </div>
  );
};

// === COMPONENTE MODAL DE CONFIRMACIÓN ===
const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all scale-100">
        <div className="p-6 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
          <p className="text-sm text-gray-500 mb-6">{message}</p>
          <div className="flex gap-3 justify-center">
            <button onClick={onClose} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium rounded-lg transition-colors">
              Cancelar
            </button>
            <button onClick={() => { onConfirm(); onClose(); }} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors shadow-md">
              Confirmar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// === COMPONENTE MODAL DE EDICIÓN ===
const EditModal = ({ isOpen, onClose, onUpdate, huerto }) => {
  const [nombre, setNombre] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [tipoCultivo, setTipoCultivo] = useState('');

  useEffect(() => {
    if (huerto) {
      setNombre(huerto.nombre || '');
      setUbicacion(huerto.ubicacion || '');
      setTipoCultivo(huerto.tipoCultivo || '');
    }
  }, [huerto]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(huerto._id, { nombre, ubicacion, tipoCultivo });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4 border-b pb-2">
            <h3 className="text-lg font-bold text-gray-900">Editar Huerto</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input 
                  className="w-full border p-2 rounded focus:ring-2 focus:ring-green-500 outline-none" 
                  value={nombre} 
                  onChange={e => setNombre(e.target.value)} 
                  required
                />
             </div>
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación</label>
                <input 
                  className="w-full border p-2 rounded focus:ring-2 focus:ring-green-500 outline-none" 
                  value={ubicacion} 
                  onChange={e => setUbicacion(e.target.value)} 
                  required
                />
             </div>
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Cultivo</label>
                <input 
                  className="w-full border p-2 rounded focus:ring-2 focus:ring-green-500 outline-none" 
                  value={tipoCultivo} 
                  onChange={e => setTipoCultivo(e.target.value)} 
                  required
                />
             </div>
             <div className="flex gap-3 justify-end mt-6">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium rounded-lg transition-colors">
                  Cancelar
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-md">
                  Guardar Cambios
                </button>
             </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// === COMPONENTE VISTA DE ADMINISTRADOR ===
const AdminView = ({ auth }) => {
  const [activeTab, setActiveTab] = useState('huertos');
  const [huertos, setHuertos] = useState([]);
  const [agricultores, setAgricultores] = useState([]);
  const [cargandoData, setCargandoData] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [asignarMode, setAsignarMode] = useState(null);
  const [agricultorSeleccionado, setAgricultorSeleccionado] = useState("");

  // Estados para Toast, Modal Confirmación y Modal Edición
  const [toast, setToast] = useState(null);
  const [modalConfig, setModalConfig] = useState({ isOpen: false, title: '', message: '', onConfirm: () => {} });
  const [editModalConfig, setEditModalConfig] = useState({ isOpen: false, huerto: null });

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
  };

  const openConfirmModal = (title, message, onConfirm) => {
    setModalConfig({ isOpen: true, title, message, onConfirm });
  };

  const openEditModal = (huerto) => {
    setEditModalConfig({ isOpen: true, huerto });
  };

  const [nombreHuerto, setNombreHuerto] = useState('');
  const [ubicacionHuerto, setUbicacionHuerto] = useState('');
  const [cultivoHuerto, setCultivoHuerto] = useState('');
  const [codigoDispositivo, setCodigoDispositivo] = useState('');
  const [nombreAgricultor, setNombreAgricultor] = useState('');
  const [emailAgricultor, setEmailAgricultor] = useState('');
  const [passwordAgricultor, setPasswordAgricultor] = useState('');

  // Función para recargar huertos
  const recargarHuertos = async () => {
      const token = localStorage.getItem('token');
      if(!token) return;
      const config = { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` } };
      try {
         const { data } = await clienteAxios.get('/api/huertos', config);
         setHuertos(data);
      } catch (error) { console.error("Error recargando huertos:", error); }
  };

  useEffect(() => {
    const obtenerDatos = async () => {
      const token = localStorage.getItem('token');
      if(!token) return;
      const config = { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` } };
      
      try {
         const resH = await clienteAxios.get('/api/huertos', config);
         setHuertos(resH.data);
      } catch (error) { console.error("Error huertos:", error); }

      try {
         const resA = await clienteAxios.get('/api/agricultores', config);
         setAgricultores(resA.data);
      } catch (error) { console.warn("Error agricultores (puede ser 404 si no hay):", error); }
      
      setCargandoData(false);
    };
    obtenerDatos();
  }, []);

  const handleAsignar = async (huertoId) => {
      if(!agricultorSeleccionado) return showToast("Selecciona un agricultor", "error");
      
      const agricultorObj = agricultores.find(a => a._id === agricultorSeleccionado);
      if (!agricultorObj) return showToast("Agricultor no encontrado", "error");

      try {
          const token = localStorage.getItem('token');
          const config = { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` } };
          
          await clienteAxios.post(`/api/huertos/agricultor/${huertoId}`, { email: agricultorObj.email }, config);
          
          showToast("Agricultor asignado correctamente");
          setAgricultorSeleccionado("");
          recargarHuertos();
      } catch (e) { 
          showToast(e.response?.data?.msg || "Error al asignar", "error"); 
      }
  }

  const handleDesvincular = async (huertoId, agricultorId) => {
    try {
        const token = localStorage.getItem('token');
        const config = { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` } };
        
        await clienteAxios.put(`/api/huertos/remover-agricultor/${huertoId}`, { agricultorId }, config);
        
        showToast("Agricultor desvinculado correctamente");
        recargarHuertos(); // Recarga para ver reflejada la eliminación
    } catch (e) {
        showToast(e.response?.data?.msg || "Error al desvincular", "error");
    }
  }

  const handleAgregarHuerto = async (e) => {
      e.preventDefault();
      try {
          const token = localStorage.getItem('token');
          const config = { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` } };
          const { data } = await clienteAxios.post('/api/huertos', { nombre: nombreHuerto, ubicacion: ubicacionHuerto, tipoCultivo: cultivoHuerto, codigoDispositivo }, config);
          setHuertos([...huertos, data]); setShowForm(false);
          setNombreHuerto(''); setUbicacionHuerto(''); setCultivoHuerto(''); setCodigoDispositivo('');
          showToast("Huerto creado exitosamente");
      } catch (e) { showToast(e.response?.data?.msg || "Error al crear huerto", "error"); }
  }

  const handleUpdateHuerto = async (id, datosActualizados) => {
    try {
        const token = localStorage.getItem('token');
        const config = { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` } };
        
        const { data } = await clienteAxios.put(`/api/huertos/${id}`, datosActualizados, config);
        
        const huertosActualizados = huertos.map(h => h._id === id ? data : h);
        setHuertos(huertosActualizados);
        
        setEditModalConfig({ isOpen: false, huerto: null });
        showToast("Huerto actualizado exitosamente");
    } catch (e) {
        showToast(e.response?.data?.msg || "Error al actualizar huerto", "error");
    }
  }

  const handleAgregarAgricultor = async (e) => {
      e.preventDefault();
      try {
          const token = localStorage.getItem('token');
          const config = { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` } };
          const { data } = await clienteAxios.post('/api/agricultores', { nombre: nombreAgricultor, email: emailAgricultor, password: passwordAgricultor }, config);
          if(data) { 
              setAgricultores([...agricultores, data]); 
              setShowForm(false); 
              setNombreAgricultor(''); setEmailAgricultor(''); setPasswordAgricultor(''); 
              showToast("Agricultor registrado exitosamente"); 
          }
      } catch (e) { showToast(e.response?.data?.msg || "Error al crear agricultor", "error"); }
  }

  const handleDelHuerto = (id) => {
      openConfirmModal(
        "Eliminar Huerto", 
        "¿Estás seguro de que quieres eliminar este huerto? Esta acción no se puede deshacer.",
        async () => {
            try {
                const token = localStorage.getItem('token');
                await clienteAxios.delete(`/api/huertos/${id}`, { headers: { Authorization: `Bearer ${token}` } });
                setHuertos(huertos.filter(h=>h._id!==id));
                showToast("Huerto eliminado");
            // eslint-disable-next-line no-unused-vars
            } catch (error) {
                showToast("Error al eliminar huerto", "error");
            }
        }
      );
  }

  const handleDelAgri = (id) => {
      openConfirmModal(
        "Eliminar Agricultor",
        "¿Estás seguro de eliminar a este agricultor? Se desvinculará de todos los huertos.",
        async () => {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };
                await clienteAxios.delete(`/api/agricultores/${id}`, config);
                setAgricultores(agricultores.filter(a=>a._id!==id));
                recargarHuertos(); 
                showToast("Agricultor eliminado y desvinculado");
            } catch (error) { 
                console.error(error); 
                showToast("Error al eliminar agricultor", "error"); 
            }
        }
      );
  }

  return (
    <div className="bg-gray-50 min-h-screen font-sans relative">
      {/* Toast, ConfirmModal y EditModal */}
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      
      <ConfirmModal 
        isOpen={modalConfig.isOpen} 
        onClose={() => setModalConfig({...modalConfig, isOpen: false})} 
        title={modalConfig.title} 
        message={modalConfig.message} 
        onConfirm={modalConfig.onConfirm} 
      />

      <EditModal
        isOpen={editModalConfig.isOpen}
        onClose={() => setEditModalConfig({ ...editModalConfig, isOpen: false })}
        huerto={editModalConfig.huerto}
        onUpdate={handleUpdateHuerto}
      />

      <div className="bg-white shadow-sm border-b border-gray-100 p-4 flex justify-between items-center sticky top-0 z-10">
          <h1 className="text-2xl font-bold text-gray-900">Admin Panel - <span className='text-green-600'>{auth.nombre}</span></h1>
      </div>
      <div className="max-w-7xl mx-auto p-4 md:p-8">
          <div className="flex gap-4 mb-6">
              <button onClick={() => setActiveTab('huertos')} className={`px-4 py-2 rounded-lg font-medium transition ${activeTab === 'huertos' ? 'bg-green-600 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>Huertos</button>
              <button onClick={() => setActiveTab('agricultores')} className={`px-4 py-2 rounded-lg font-medium transition ${activeTab === 'agricultores' ? 'bg-green-600 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>Agricultores</button>
              <button onClick={() => setShowForm(!showForm)} className="ml-auto bg-blue-600 text-white px-4 py-2 rounded-lg flex gap-2 items-center hover:bg-blue-700 transition shadow-md"><Plus size={18}/> Nuevo</button>
          </div>

          {showForm && (
              <div className="bg-white p-6 rounded-xl shadow-lg mb-8 border border-green-50 animate-fade-in-down">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">
                    {activeTab === 'huertos' ? 'Nuevo Huerto' : 'Nuevo Agricultor'}
                  </h3>
                  {activeTab === 'huertos' ? (
                      <form onSubmit={handleAgregarHuerto} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          <input placeholder="Nombre" className="border p-2 rounded focus:ring-2 focus:ring-green-500 outline-none" value={nombreHuerto} onChange={e=>setNombreHuerto(e.target.value)} required/>
                          <input placeholder="Ubicación" className="border p-2 rounded focus:ring-2 focus:ring-green-500 outline-none" value={ubicacionHuerto} onChange={e=>setUbicacionHuerto(e.target.value)} required/>
                          <input placeholder="Cultivo" className="border p-2 rounded focus:ring-2 focus:ring-green-500 outline-none" value={cultivoHuerto} onChange={e=>setCultivoHuerto(e.target.value)} required/>
                          <input placeholder="Código Disp." className="border p-2 rounded focus:ring-2 focus:ring-green-500 outline-none" value={codigoDispositivo} onChange={e=>setCodigoDispositivo(e.target.value)} required/>
                          <button className="bg-green-600 text-white p-2 rounded font-bold hover:bg-green-700 transition md:col-span-2 lg:col-span-4">Guardar Huerto</button>
                      </form>
                  ) : (
                      <form onSubmit={handleAgregarAgricultor} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <input placeholder="Nombre" className="border p-2 rounded focus:ring-2 focus:ring-green-500 outline-none" value={nombreAgricultor} onChange={e=>setNombreAgricultor(e.target.value)} required/>
                          <input placeholder="Email" className="border p-2 rounded focus:ring-2 focus:ring-green-500 outline-none" value={emailAgricultor} onChange={e=>setEmailAgricultor(e.target.value)} required/>
                          <input type="password" placeholder="Password" className="border p-2 rounded focus:ring-2 focus:ring-green-500 outline-none" value={passwordAgricultor} onChange={e=>setPasswordAgricultor(e.target.value)} required/>
                          <button className="bg-green-600 text-white p-2 rounded font-bold hover:bg-green-700 transition md:col-span-3">Guardar Agricultor</button>
                      </form>
                  )}
              </div>
          )}

          {cargandoData ? <div className="flex justify-center py-20"><Loader2 className="animate-spin text-green-600" size={40}/></div> : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activeTab === 'huertos' ? huertos.map(h => (
                      <div key={h._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative group hover:shadow-md transition">
                          <div className="absolute top-4 right-4 flex gap-2 bg-white pl-2">
                             <button onClick={()=>openEditModal(h)} className="text-gray-300 hover:text-blue-500 transition hover:scale-110" title="Editar Huerto"><Pencil size={18}/></button>
                             <button onClick={()=>handleDelHuerto(h._id)} className="text-gray-300 hover:text-red-500 transition hover:scale-110" title="Eliminar Huerto"><Trash2 size={18}/></button>
                          </div>
                          
                          <div className="flex items-center gap-3 mb-4">
                             <div className="bg-green-100 p-2 rounded-lg text-green-700"><Sprout size={24}/></div>
                             <div>
                                <h3 className="font-bold text-lg text-gray-800">{h.nombre}</h3>
                                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{h.tipoCultivo}</p>
                             </div>
                          </div>
                          <div className="text-sm text-gray-600 mb-4 flex items-center gap-2">
                             <MapPin size={16}/> {h.ubicacion}
                          </div>
                          <div className="mt-4 pt-4 border-t border-gray-100">
                              {asignarMode === h._id ? (
                                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 animate-fade-in space-y-3">
                                      <div className="flex justify-between items-center mb-1">
                                         <span className="text-xs font-bold text-blue-800 uppercase tracking-wider">Gestionar Accesos</span>
                                         <button onClick={()=>setAsignarMode(null)} className="text-gray-400 hover:text-gray-600"><X size={16} /></button>
                                      </div>

                                      {/* Lista de Agricultores Asignados */}
                                      <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                                          {h.agricultores && h.agricultores.length > 0 ? (
                                               h.agricultores.map(idAgri => {
                                                   // Cruzamos el ID del huerto con el estado global de agricultores para sacar el nombre
                                                   const agri = agricultores.find(a => a._id === idAgri);
                                                   return (
                                                       <div key={idAgri} className="flex justify-between items-center bg-white p-2 rounded border border-blue-100 shadow-sm text-sm">
                                                           <span className="truncate font-medium text-gray-700" title={agri ? agri.email : ''}>
                                                               {agri ? agri.nombre : 'Agricultor'}
                                                           </span>
                                                           <button 
                                                               onClick={()=>handleDesvincular(h._id, idAgri)} 
                                                               className="text-red-400 hover:text-red-600 hover:bg-red-50 p-1 rounded transition" 
                                                               title="Desvincular del huerto"
                                                           >
                                                               <Unlink size={14}/>
                                                           </button>
                                                       </div>
                                                   )
                                               })
                                          ) : <p className="text-xs text-gray-500 italic text-center py-2">Sin agricultores asignados</p>}
                                      </div>

                                      {/* Añadir Nuevo */}
                                      <div className="flex gap-2 pt-2 border-t border-blue-200">
                                          <select 
                                            className="border-none bg-white p-1.5 rounded flex-1 text-xs outline-none font-medium text-gray-700 shadow-sm" 
                                            value={agricultorSeleccionado} 
                                            onChange={e=>setAgricultorSeleccionado(e.target.value)}
                                          >
                                              <option value="">+ Añadir...</option>
                                              {/* Solo mostrar agricultores que NO estén ya en el huerto */}
                                              {agricultores
                                                .filter(a => !h.agricultores.includes(a._id))
                                                .map(a=><option key={a._id} value={a._id}>{a.nombre}</option>)
                                              }
                                          </select>
                                          <button 
                                            onClick={()=>handleAsignar(h._id)} 
                                            disabled={!agricultorSeleccionado}
                                            className="bg-blue-600 text-white px-3 rounded text-xs font-bold hover:bg-blue-700 shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                          >
                                            OK
                                          </button>
                                      </div>
                                  </div>
                              ) : (
                                  <button onClick={()=>setAsignarMode(h._id)} className="w-full text-blue-600 text-sm bg-blue-50 py-2 rounded-lg flex justify-center items-center gap-2 hover:bg-blue-100 transition font-medium border border-blue-100 hover:border-blue-200">
                                    <LinkIcon size={14}/> Gestionar Agricultores
                                  </button>
                              )}
                              
                              {asignarMode !== h._id && (
                                <p className="text-xs text-center text-gray-400 mt-2">
                                    {h.agricultores?.length || 0} agricultores monitoreando
                                </p>
                              )}
                          </div>
                      </div>
                  )) : agricultores.map(a => (
                      <div key={a._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center hover:shadow-md transition">
                          <div className="flex items-center gap-3">
                              <div className="bg-gradient-to-br from-green-500 to-emerald-600 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                                {a.nombre ? a.nombre.charAt(0).toUpperCase() : '?'}
                              </div>
                              <div>
                                <h3 className="font-bold text-gray-800">{a.nombre}</h3>
                                <div className="flex items-center gap-1 text-sm text-gray-500">
                                  <Mail size={12}/> {a.email}
                                </div>
                              </div>
                          </div>
                          <button onClick={()=>handleDelAgri(a._id)} className="text-gray-300 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition hover:scale-110"><Trash2 size={18}/></button>
                      </div>
                  ))}
                  
                  {activeTab === 'huertos' && huertos.length === 0 && (
                      <p className="col-span-3 text-center text-gray-500 py-10">No hay huertos registrados.</p>
                  )}
                  {activeTab === 'agricultores' && agricultores.length === 0 && (
                      <p className="col-span-3 text-center text-gray-500 py-10">No hay agricultores registrados.</p>
                  )}
              </div>
          )}
      </div>
    </div>
  );
};

const Dashboard = () => {
    const { auth, cargando, cerrarSesion } = useAuth();

    if (cargando) return <div className="h-screen flex justify-center items-center"><Loader2 className="animate-spin text-green-600" size={50}/></div>;

    if (auth.role === 'agricultor') {
        return <AgricultorDashboard />;
    }

    return <AdminView auth={auth} cerrarSesion={cerrarSesion} />;
};

export default Dashboard;