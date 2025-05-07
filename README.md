 E-Commerce Backend

Este es un backend básico para una aplicación de comercio electrónico, desarrollado con **Node.js**, **Express** y **MongoDB**. La aplicación gestiona productos, usuarios y pedidos, sirviendo como base para construir un sistema completo de e-commerce.

Tecnologías utilizadas

- Node.js
- Express.js
- MongoDB + Mongoose
- Dotenv
- Morgan
- CORS

Estructura del proyecto

e-comerce-back/
├── Config/ # Configuración de conexión a MongoDB
├── Controllers/ # Lógica de negocios de productos y usuarios
├── Middlewares/ # Validación y control de errores (a mejorar)
├── Models/ # Esquemas de datos de Mongoose
├── Routes/ # Rutas para productos, usuarios, etc.
├── Utils/ # Funciones auxiliares (a desarrollar)
├── .env.example # Variables de entorno
├── package.json
└── index.js / app.js

bash
Copiar
Editar

Instalación

1. Clonar el repositorio:
    git clone https://github.com/alqmst99/e-comerce-back.git
   cd e-comerce-back

Instalar dependencias:

npm install

Crear un archivo .env basado en .env.example:


MONGO_URI=mongodb://localhost:27017/mi_tienda
PORT=4000

Ejecutar el servidor:

npm start

Endpoints (ejemplos)

GET /api/products — Lista todos los productos

POST /api/products — Crea un producto (requiere body)

GET /api/users — Lista usuarios

Más endpoints en desarrollo...

🧪 TODO / Mejoras pendientes
Agregar autenticación (JWT / bcrypt)

Validaciones con middleware (express-validator o Joi)

Implementar lógica de pedidos

Testing con Jest o Supertest

Manejo de errores unificado

Documentación Swagger/OpenAPI

Contribuciones
Pull requests, forks y sugerencias son bienvenidas. Se agradecen pruebas y mejoras de seguridad.
