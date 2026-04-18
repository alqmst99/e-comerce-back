# E-Commerce Backend — API REST

Stack: Node.js · Express · MongoDB · Mongoose · JWT

## Variables de entorno (.env)

Copiar `.env.example` a `.env` y completar:

```
MONGODB_URL=mongodb://localhost:27017/ecommerce
JWT_SECRET=clave_secreta_larga_y_aleatoria
PORT=4000
CLIENT_URL=http://localhost:3000
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu@email.com
SMTP_PASS=tu_app_password
```

## Instalación

```bash
npm install
npm run dev
```

## Endpoints principales

### Auth
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | /api/user/register | Registrar usuario |
| POST | /api/user/login | Login usuario |
| POST | /api/user/admin-login | Login admin |
| GET | /api/user/refresh | Refresh token |
| GET | /api/user/logout | Logout |

### Productos
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /api/product | Listar (filtros, paginación) |
| GET | /api/product/:id | Detalle producto |
| POST | /api/product | Crear (admin) |
| PUT | /api/product/:id | Editar (admin) |
| DELETE | /api/product/:id | Eliminar (admin) |

### Carrito y Órdenes
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | /api/user/cart | Guardar carrito |
| GET | /api/user/cart/get | Obtener carrito |
| POST | /api/user/cart/applycoupon | Aplicar cupón |
| POST | /api/user/cart/cash-order | Crear orden COD |
| GET | /api/user/get/orders | Mis órdenes |

## Para personalizar para un cliente

1. Cambiar nombre del negocio en package.json
2. Actualizar variables de entorno con sus credenciales
3. Cargar productos iniciales en la DB
4. Configurar cuenta de email para notificaciones
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
