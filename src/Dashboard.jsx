import React, { useState, useEffect } from 'react';
import { 
  Users, Sprout, Plus, Trash2, MapPin, Mail, Loader2, LogOut, QrCode, Lock, Link as LinkIcon
} from 'lucide-react';
import clienteAxios from './config/clienteAxios';
import useAuth from './hooks/useAuth';
import AgricultorDashboard from './AgricultorDashboard'; 

// === COMPONENTE VISTA DE ADMINISTRADOR ===
const AdminView = ({ auth }) => {
  const [activeTab, setActiveTab] = useState('huertos');
  const [huertos, setHuertos] = useState([]);
  const [agricultores, setAgricultores] = useState([]);
  const [cargandoData, setCargandoData] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [asignarMode, setAsignarMode] = useState(null);
  const [agricultorSeleccionado, setAgricultorSeleccionado] = useState("");

  const [nombreHuerto, setNombreHuerto] = useState('');
  const [ubicacionHuerto, setUbicacionHuerto] = useState('');
  const [cultivoHuerto, setCultivoHuerto] = useState('');
  const [codigoDispositivo, setCodigoDispositivo] = useState('');
  const [nombreAgricultor, setNombreAgricultor] = useState('');
  const [emailAgricultor, setEmailAgricultor] = useState('');
  const [passwordAgricultor, setPasswordAgricultor] = useState('');

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
      if(!agricultorSeleccionado) return alert("Selecciona un agricultor");
      try {
          const token = localStorage.getItem('token');
          const config = { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` } };
          await clienteAxios.post(`/api/huertos/asignar/${huertoId}`, { agricultorId: agricultorSeleccionado }, config);
          alert("Agricultor asignado correctamente");
          setAsignarMode(null);
          setAgricultorSeleccionado("");
          // Recargar para actualizar contador
          const resH = await clienteAxios.get('/api/huertos', config);
          setHuertos(resH.data);
      } catch (e) { 
          alert(e.response?.data?.msg || "Error al asignar"); 
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
      } catch (alert) { alert("Error al crear huerto"); }
  }

  const handleAgregarAgricultor = async (e) => {
      e.preventDefault();
      try {
          const token = localStorage.getItem('token');
          const config = { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` } };
          const { data } = await clienteAxios.post('/api/agricultores', { nombre: nombreAgricultor, email: emailAgricultor, password: passwordAgricultor }, config);
          if(data) { setAgricultores([...agricultores, data]); setShowForm(false); setNombreAgricultor(''); setEmailAgricultor(''); setPasswordAgricultor(''); alert("Agricultor Creado"); }
      } catch (alert) { alert("Error al crear agricultor"); }
  }

  const handleDelHuerto = async (id) => {
      if(!confirm("¿Estás seguro de borrar este huerto?")) return;
      const token = localStorage.getItem('token');
      await clienteAxios.delete(`/api/huertos/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setHuertos(huertos.filter(h=>h._id!==id));
  }

  const handleDelAgri = async (id) => {
      if(!confirm("¿Estás seguro de borrar este agricultor?")) return;
      const token = localStorage.getItem('token');
      await clienteAxios.delete(`/api/agricultores/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setAgricultores(agricultores.filter(a=>a._id!==id));
  }

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
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
                          <button onClick={()=>handleDelHuerto(h._id)} className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition"><Trash2 size={18}/></button>
                          
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
                                  <div className="flex gap-2 items-center animate-fade-in">
                                      <select className="border p-1.5 flex-1 text-sm rounded focus:ring-1 focus:ring-blue-500 outline-none" value={agricultorSeleccionado} onChange={e=>setAgricultorSeleccionado(e.target.value)}>
                                          <option value="">Seleccionar...</option>
                                          {agricultores.map(a=><option key={a._id} value={a._id}>{a.nombre}</option>)}
                                      </select>
                                      <button onClick={()=>handleAsignar(h._id)} className="bg-blue-600 text-white p-1.5 rounded text-xs font-bold hover:bg-blue-700">OK</button>
                                      <button onClick={()=>setAsignarMode(null)} className="text-gray-400 hover:text-gray-600 p-1"><span className="font-bold">✕</span></button>
                                  </div>
                              ) : (
                                  <button onClick={()=>setAsignarMode(h._id)} className="w-full text-blue-600 text-sm bg-blue-50 py-2 rounded-lg flex justify-center items-center gap-2 hover:bg-blue-100 transition font-medium">
                                    <LinkIcon size={14}/> Asignar Agricultor
                                  </button>
                              )}
                              <p className="text-xs text-center text-gray-400 mt-2">
                                  {h.agricultores?.length || 0} agricultores monitoreando
                              </p>
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
                          <button onClick={()=>handleDelAgri(a._id)} className="text-gray-300 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition"><Trash2 size={18}/></button>
                      </div>
                  ))}
              </div>
          )}
      </div>
    </div>
  );
};

// === COMPONENTE PRINCIPAL (DECISOR) ===
const Dashboard = () => {
    // CORRECCIÓN CLAVE: Destructuramos cerrarSesion aquí, no en el return
    const { auth, cargando, cerrarSesion } = useAuth();

    if (cargando) return <div className="h-screen flex justify-center items-center"><Loader2 className="animate-spin text-green-600" size={50}/></div>;

    if (auth.role === 'agricultor') {
        return <AgricultorDashboard />;
    }

    return <AdminView auth={auth} cerrarSesion={cerrarSesion} />;
};

export default Dashboard;