# 🚀 Full-Stack Senior Portfolio & CI/CD Runner

Bienvenido al repositorio oficial de mi Portafolio Profesional. Este proyecto no es solo una vitrina de trabajos; es una plataforma técnica robusta diseñada con arquitectura modular, seguridad industrial y una experiencia de usuario (UX) premium.

## 🌟 Características Destacadas

- **Live CI/CD Runner**: Ejecución de pruebas en tiempo real mediante *clonación dinámica de repositorios* y streaming vía **Server-Sent Events (SSE)**.
- **Cifrado de Seguridad (AES-256-CBC)**: Gestión protegida de variables de entorno (.env) para pruebas automatizadas, asegurando que tus secretos nunca se filtren.
- **Sistema de Temas Dinámico**: Personalización total de colores, logos y textos desde un panel administrativo, con soporte completo para **Modo Claro** y **Modo Oscuro**.
- **Arquitectura Modular**: Backend construido con **NestJS** siguiendo patrones de diseño escalables y Frontend con **Angular 16+** (Standalone Components).
- **Gestión de Contenido**: CRUD completo para proyectos, habilidades, testimonios y perfiles con carga de imágenes integrada.

## 🛠️ Tech Stack

### Backend (El Cerebro)
- **Framework**: NestJS (Node.js)
- **Base de Datos**: MongoDB via Mongoose
- **Cifrado**: Crypto (Nativo Node.js)
- **Seguridad**: JWT (JSON Web Tokens) & Passport
- **Comunicación**: RESTful API & SSE

### Frontend (La Vista)
- **Framework**: Angular 16+
- **Estilos**: Vanilla CSS (Efecto Glassmorphism & Neon)
- **Estado**: RxJS & Observables
- **Interconectividad**: HttpClient & EventSource

---

## 🚀 Guía de Inicio Rápido

Sigue estos pasos para tener el proyecto corriendo en tu máquina local.

### 1. Clonar el repositorio
```bash
git clone https://github.com/matias240895DC/Portafolio-Backend.git
cd "Portafolio-Backend"
```

### 2. Configurar el Backend
```bash
cd backend
npm install
```
Crea un archivo `.env` en la carpeta `backend/` y añade lo siguiente:
```env
PORT=3000
MONGO_URI=tu_uri_de_mongodb
JWT_SECRET=una_clave_secreta_muy_larga
ADMIN_PASSWORD=tu_contraseña_admin
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
ENCRYPTION_KEY=una_clave_de_64_caracteres_hex (ej: usa un generador)
```

### 3. Configurar el Frontend
```bash
cd ../frontend
npm install
```

### 4. Lanzar la aplicación
**Backend:**
```bash
cd ../backend
npm run start:dev
```
**Frontend:**
```bash
cd ../frontend
npm start
```

---

## 🔐 Seguridad y Producción

Este proyecto utiliza **Cifrado AES-256-CBC** para manejar variables de entorno de terceros. 
- Al registrar un proyecto para el CI/CD Runner, pega el contenido de tu `.env`.
- El sistema cifra el contenido antes de guardarlo en MongoDB.
- El Runner descifra el contenido temporalmente solo durante la ejecución de los tests.

## 📄 Documentación Detallada
Para una inmersión profunda en la arquitectura, guías paso a paso de implementación y lógica de negocio, consulta el archivo:
👉 [**DOCUMENTACION.md**](DOCUMENTACION.md)

---

Desarrollado con ❤️ por **Matias**
