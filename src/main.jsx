import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from './context/AuthProvider';
import ConfirmarCuenta from './pages/ConfirmarCuenta';
import NuevoPassword from './pages/NuevoPassword';
import Perfil from './pages/Perfil';
import './index.css';


// Páginas
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage'; 
import App from './pages/Dashboard';
import PlantSearch from './assets/PlantSearch';
import Layout from './Layout/Layout'; 
import RutaProtegida from './routes/RutaProtegida'; 
import OlvidePassword from './pages/OlvidePassword';
import PrediccionIA from './pages/prediccionIA'; 


ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <AuthProvider> 
                <Routes>
                    {/* --- Rutas Públicas --- */}
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/registrar" element={<RegisterPage />} />
                    <Route path="/confirmar/:token" element={<ConfirmarCuenta />} />
                    <Route path="/olvide-password" element={<OlvidePassword />} />
                    <Route path="/olvide-password/:token" element={<NuevoPassword />} />

                    {/* --- Rutas Privadas --- */}
                    {/* Todas las rutas dentro de /dashboard usan el Layout y están protegidas */}
                    <Route path="/dashboard" element={<RutaProtegida />}>
                        <Route element={<Layout />}> 
                            <Route index element={<App />} />
                            <Route path="buscar-plantas" element={<PlantSearch />} />
                            <Route path="perfil" element={<Perfil />} />
                            <Route path="prediccion-ia" element={<PrediccionIA />} />
                        </Route>
                    </Route>
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    </React.StrictMode>
);