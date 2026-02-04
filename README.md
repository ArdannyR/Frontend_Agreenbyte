AGREENBYTE

<img width="1920" height="3204" alt="screencapture-agreenbyte-netlify-app-2026-02-04-13_41_33" src="https://github.com/user-attachments/assets/3bb1ffce-cb75-4af9-82ca-2fb92def188c" />

🌱 Agreenbyte - Sistema de Monitoreo de Huertos Inteligentes
> Agreenbyte es una plataforma web IoT diseñada para la gestión, monitoreo y análisis en tiempo real de cultivos agrícolas. Permite a los administradores gestionar huertos y agricultores, mientras que los agricultores pueden visualizar métricas críticas (temperatura, humedad, etc.) para la toma de decisiones.
> 
🚀 Características Principales
👨‍💼 Para Administradores
 * Gestión de Usuarios: Registro y administración de cuentas de agricultores.
 * Gestión de Huertos: CRUD completo (Crear, Leer, Actualizar, Eliminar) de huertos.
 * Asignación de Recursos: Vincular agricultores específicos a huertos determinados.
 * Panel de Control: Vista general del estado del sistema.
👨‍🌾 Para Agricultores
 * Monitoreo en Tiempo Real: Visualización de datos de sensores (Temperatura, Humedad, Viento, Nutrientes) actualizados al instante mediante WebSockets.
 * Gráficos Interactivos: Historial visual del comportamiento del clima y suelo.
 * Simulación de Datos: Sistema inteligente que simula el comportamiento de sensores en ausencia de hardware físico.
 * Exportación de Datos: Generación de reportes en formato CSV con el historial semanal.
 * Diseño Responsivo: Acceso optimizado desde móviles y computadoras de escritorio.
🛠️ Tecnologías Utilizadas
El proyecto está construido utilizando el stack MERN (MongoDB, Express, React, Node.js) con esteroides:
Frontend (Cliente)
 * Framework: React + Vite
 * Estilos: Tailwind CSS
 * Iconos: Lucide React
 * Gráficos: Chart.js y react-chartjs-2
 * Comunicación Real-time: socket.io-client
 * HTTP Client: Axios
Backend (Servidor)
 * Entorno: Node.js
 * Framework: Express
 * Base de Datos: MongoDB (Mongoose)
 * Autenticación: JWT (JSON Web Tokens)
 * Comunicación Real-time: socket.io
 * Seguridad: CORS configurado para desarrollo y producción.
📦 Instalación y Configuración
Sigue estos pasos para ejecutar el proyecto en tu entorno local.
Prerrequisitos
 * Node.js (v14 o superior)
 * MongoDB (corriendo localmente o una URI de MongoDB Atlas)
 * Git
1. Clonar el Repositorio
git clone [https://github.com/tu-usuario/agreenbyte.git](https://github.com/tu-usuario/agreenbyte.git)
cd agreenbyte

2. Configurar el Backend (Servidor)
Navega a la carpeta del backend e instala las dependencias:
cd backend
npm install

Crea un archivo .env en la carpeta backend con las siguientes variables:
PORT=4000
MONGO_URI=mongodb://localhost:27017/agreenbyte
JWT_SECRET=tu_palabra_secreta_super_segura
FRONTEND_URL=http://localhost:5173

Inicia el servidor:
npm run dev

> El servidor correrá en http://localhost:4000
> 
3. Configurar el Frontend (Cliente)
Abre una nueva terminal, navega a la carpeta del frontend e instala las dependencias:
cd frontend
npm install

Crea un archivo .env en la carpeta frontend:
VITE_BACKEND_URL=http://localhost:4000

Inicia la aplicación de React:
npm run dev

> La aplicación correrá en http://localhost:5173
> 
🖥️ Uso del Sistema
 * Registro Inicial: Crea una cuenta de Administrador desde la página de registro.
 * Dashboard Admin:
   * Crea un nuevo Huerto (ej: "Huerto Tomates Norte").
   * Registra un Agricultor.
   * Asigna el Agricultor al Huerto usando el botón "Gestionar Accesos".
 * Vista Agricultor:
   * Inicia sesión con la cuenta del agricultor creado.
   * Verás las tarjetas de los huertos asignados.
   * Los datos se actualizarán automáticamente cada 5 segundos (Simulación).
   * Usa el botón "Exportar CSV" para descargar el reporte.
👥 Autores
Este proyecto fue desarrollado como parte de la asignatura de Desarrollo de Aplicaciones Web por:
 * Juan Lucero
 * Brandon Huera
 * Ardanny Romero
