import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, AlertTriangle, Loader2, Info } from 'lucide-react'; // Añadimos Info icon
import clienteAxios from './config/clienteAxios';

const ConfirmarCuenta = () => {
  const [cuentaConfirmada, setCuentaConfirmada] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [alerta, setAlerta] = useState({});

  const params = useParams();
  const { token } = params;

  useEffect(() => {
    const confirmarCuenta = async () => {
      try {
        const url = `/api/administradores/confirmar/${token}`;
        const { data } = await clienteAxios.get(url);

        setAlerta({
          msg: data.msg,
          error: false
        });
        setCuentaConfirmada(true);

      } catch (error) {
        // Detectamos si el mensaje indica que ya fue confirmada
        const msgError = error.response?.data?.msg || 'Error al confirmar cuenta';
        
        if (msgError.includes('ya fue confirmada')) {
             setAlerta({
                msg: 'Tu cuenta ya fue confirmada anteriormente. Puedes iniciar sesión.',
                error: false, // Lo tratamos como NO error visualmente
                info: true // Flag especial para estilo informativo
             });
             setCuentaConfirmada(true); // Permitimos ver el botón de login
        } else {
            setAlerta({
                msg: msgError,
                error: true
            });
        }
      }

      setCargando(false);
    };
    confirmarCuenta();
  }, []); 

  return (
    <div className="flex h-screen w-full justify-center items-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Confirma tu Cuenta</h1>

        <div className="flex justify-center mb-6">
            {cargando ? (
                <Loader2 className="animate-spin text-blue-600 h-16 w-16" />
            ) : alerta.error ? (
                <AlertTriangle className="text-red-500 h-16 w-16" />
            ) : alerta.info ? ( // Icono informativo si ya estaba confirmada
                <Info className="text-blue-500 h-16 w-16" />
            ) : (
                <CheckCircle className="text-green-500 h-16 w-16" />
            )}
        </div>

        {!cargando && (
            <div className={`p-4 rounded-xl text-sm font-medium mb-6 ${
                alerta.error ? 'bg-red-50 text-red-700 border border-red-100' : 
                alerta.info ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                'bg-green-50 text-green-700 border border-green-100'
            }`}>
                {alerta.msg}
            </div>
        )}

        {cuentaConfirmada && (
            <Link
              to="/login"
              className="inline-block w-full bg-green-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-green-700 transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              Iniciar Sesión
            </Link>
        )}
        
        {!cargando && !cuentaConfirmada && (
             <Link
             to="/"
             className="text-gray-500 hover:text-gray-700 font-medium text-sm"
           >
             Volver al inicio
           </Link>
        )}
      </div>
    </div>
  );
};

export default ConfirmarCuenta;