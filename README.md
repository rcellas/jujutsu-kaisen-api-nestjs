# 🎌 Jujutsu Kaisen API - NestJS

API RESTful para gestionar personajes del anime y manga Jujutsu Kaisen, construida con NestJS, TypeScript y MongoDB.

## 📋 Descripción

Esta API proporciona un sistema completo de gestión de personajes del universo de Jujutsu Kaisen. Permite realizar operaciones CRUD (Crear, Leer, Actualizar, Eliminar) sobre los personajes, incluyendo información como nombre, género, estado, especie e imagen.

## ✨ Características

- 🔍 Consultar todos los personajes
- 🎯 Obtener información detallada de un personaje específico
- ➕ Crear nuevos personajes
- ✏️ Actualizar información de personajes existentes
- 🗑️ Eliminar personajes
- 🖼️ Soporte para imágenes mediante URLs
- ✅ Validación de datos con class-validator
- 📚 Documentación automática con Swagger
- 🗄️ Base de datos MongoDB con Mongoose

## 🛠️ Tecnologías Utilizadas

- **[NestJS](https://nestjs.com/)** - Framework progresivo de Node.js
- **[TypeScript](https://www.typescriptlang.org/)** - Lenguaje de programación
- **[MongoDB](https://www.mongodb.com/)** - Base de datos NoSQL
- **[Mongoose](https://mongoosejs.com/)** - ODM para MongoDB
- **[Swagger](https://swagger.io/)** - Documentación de API
- **[Jest](https://jestjs.io/)** - Framework de testing
- **[Class-validator](https://github.com/typestack/class-validator)** - Validación de DTOs

## 📦 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (versión 16 o superior)
- **npm** o **yarn**
- **MongoDB** (local o MongoDB Atlas)

## 🚀 Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/rcellas/jujutsu-kaisen-api-nestjs.git
cd jujutsu-kaisen-api-nestjs
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura las variables de entorno:

Crea un archivo `.env` en la raíz del proyecto con la siguiente configuración:

```env
MONGO_URI=mongodb+srv://tu_usuario:tu_contraseña@cluster.mongodb.net/nombre_base_datos
```

## 🏃 Ejecución de la Aplicación

### Modo Desarrollo
```bash
npm run start:dev
```

### Modo Producción
```bash
# Compilar
npm run build

# Ejecutar
npm run start:prod
```

### Modo Debug
```bash
npm run start:debug
```

La aplicación estará disponible en `http://localhost:3000`

## 📡 Endpoints de la API

### Personajes

#### Obtener todos los personajes
```http
GET /character
```

**Respuesta:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Yuji Itadori",
    "gender": "Male",
    "status": "Alive",
    "specie": "Human",
    "imagen": "https://example.com/yuji.jpg"
  }
]
```

#### Obtener un personaje por ID
```http
GET /character/:id
```

**Parámetros:**
- `id` - ID del personaje (ObjectId de MongoDB)

#### Crear un nuevo personaje
```http
POST /character
Content-Type: application/json
```

**Body:**
```json
{
  "name": "Satoru Gojo",
  "gender": "Male",
  "status": "Alive",
  "species": "Human",
  "imagen": "https://example.com/gojo.jpg"
}
```

#### Actualizar un personaje
```http
PUT /character/:id
Content-Type: application/json
```

**Body:**
```json
{
  "name": "Satoru Gojo",
  "gender": "Male",
  "status": "Unknown",
  "species": "Human",
  "imagen": "https://example.com/gojo-updated.jpg"
}
```

#### Eliminar un personaje
```http
DELETE /character/:id
```

### Valores Permitidos

**Gender (Género):**
- `Male` - Masculino
- `Female` - Femenino
- `Unknown` - Desconocido

**Status (Estado):**
- `Alive` - Vivo
- `Dead` - Muerto
- `Unknown` - Desconocido

## 📁 Estructura del Proyecto

```
jujutsu-kaisen-api-nestjs/
├── src/
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   ├── main.ts
│   └── character/
│       ├── character.module.ts
│       ├── controller/
│       │   └── character/
│       │       └── character.controller.ts
│       ├── service/
│       │   └── character/
│       │       └── character.service.ts
│       ├── dto/
│       │   └── CreateCharacter.ts
│       └── schema/
│           └── characters.schema.ts
├── test/
│   └── app.e2e-spec.ts
├── .env
├── package.json
└── tsconfig.json
```

## 🧪 Testing

### Ejecutar tests unitarios
```bash
npm run test
```

### Ejecutar tests e2e
```bash
npm run test:e2e
```

### Cobertura de tests
```bash
npm run test:cov
```

### Modo watch
```bash
npm run test:watch
```

## 🔧 Scripts Disponibles

- `npm run build` - Compila el proyecto
- `npm run format` - Formatea el código con Prettier
- `npm run start` - Inicia la aplicación
- `npm run start:dev` - Inicia en modo desarrollo con hot-reload
- `npm run start:debug` - Inicia en modo debug
- `npm run start:prod` - Inicia en modo producción
- `npm run lint` - Ejecuta el linter y corrige problemas
- `npm run test` - Ejecuta tests unitarios
- `npm run test:watch` - Ejecuta tests en modo watch
- `npm run test:cov` - Genera reporte de cobertura
- `npm run test:e2e` - Ejecuta tests end-to-end

## 📝 Modelo de Datos

### Character (Personaje)

```typescript
{
  name: string;        // Nombre del personaje (requerido)
  gender: string;      // Género: Male, Female, Unknown (requerido)
  status: string;      // Estado: Alive, Dead, Unknown (requerido)
  imagen: string;      // URL de la imagen del personaje
  specie: string;      // Especie del personaje
}
```

## 🔐 Validaciones

El proyecto utiliza `class-validator` para validar los datos de entrada:

- **name**: String, no puede estar vacío
- **gender**: String, debe ser uno de los valores del enum
- **status**: String, debe ser uno de los valores del enum ('Alive', 'Dead', 'unknown')
- **imagen**: Debe ser una URL válida
- **species**: String

Si no se proporciona una imagen, se asignará una imagen por defecto.

## 📚 Documentación de la API

La documentación interactiva de la API está disponible gracias a Swagger. Una vez que la aplicación esté en ejecución, puedes acceder a ella en:

```
http://localhost:3000/api
```
