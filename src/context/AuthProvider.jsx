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
            const rol = localStorage.getItem('rol'); // Leemos el rol guardado

            if (!token) {
                setCargando(false);
                return;
            }

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            };

            try {
                // Decidimos a qué endpoint llamar según el rol
                let url = '/api/administradores/perfil';
                if (rol === 'agricultor') {
                    url = '/api/agricultores/perfil';
                }

                const { data } = await clienteAxios.get(url, config);
                // Aseguramos tener el rol en el estado
                setAuth({ ...data, role: rol || 'admin' });
                
                // Redirección inteligente si está en login
                if (window.location.pathname === '/' || window.location.pathname === '/login') {
                   navigate('/dashboard'); 
                }
            } catch (error) {
                setAuth({});
                localStorage.removeItem('token');
                localStorage.removeItem('rol');
            } finally {
                setCargando(false);
            }
        };
        autenticarUsuario();
    }, []);

    const cerrarSesion = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('rol');
        setAuth({});
        navigate('/login');
    };

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
    );
};

export { AuthProvider };
export default AuthContext;