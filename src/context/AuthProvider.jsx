import { useState, useEffect, createContext } from 'react';
import { useNavigate } from 'react-router-dom';
import clienteAxios from '../config/clienteAxios';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({});
    const [cargando, setCargando] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const autenticarUsuario = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setCargando(false);
                return;
            }

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            try {
                // Usamos la ruta de perfil que creaste
                const { data } = await clienteAxios('/agricultores/perfil', config);
                setAuth(data);
                
                // Si el usuario está logueado, lo mandamos al dashboard
                if (['/', '/login', '/registrar'].includes(window.location.pathname)) {
                navigate('/dashboard');
                }
            } catch (error) {
                setAuth({});
                localStorage.removeItem('token');
                error
            }
            setCargando(false);
        }
        autenticarUsuario();
    }, []);

    const cerrarSesion = () => {
        localStorage.removeItem('token');
        setAuth({});
        navigate('/'); // Al cerrar sesión, lo mandamos a la Landing
    }

    return (
        <AuthContext.Provider
            value={{
                auth,
                setAuth,
                cargando,
                cerrarSesion
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export {
    AuthProvider
}

export default AuthContext;