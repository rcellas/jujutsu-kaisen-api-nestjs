# 🎯 API de Jujutsu Kaisen - NestJS

<p align="center">
  <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" />
</p>

API RESTful desarrollada con NestJS que proporciona información sobre personajes, localizaciones y técnicas del anime y manga Jujutsu Kaisen.

## 📋 Descripción del Proyecto

Esta API permite acceder a datos estructurados sobre el universo de Jujutsu Kaisen, incluyendo:

- **Personajes**: Información detallada de los personajes de la serie
- **Localizaciones**: Lugares importantes en el universo de Jujutsu Kaisen
- **Técnicas**: Técnicas de hechicería maldita y habilidades especiales

El proyecto está construido con [NestJS](https://nestjs.com/), un framework progresivo de Node.js para construir aplicaciones del lado del servidor eficientes y escalables, utilizando TypeScript.

## 🔧 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado en tu sistema:

- **Node.js** (versión 20.x o superior) - [Descargar Node.js](https://nodejs.org/)
- **npm** (versión 10.x o superior) - Viene incluido con Node.js
- **MongoDB** (versión 4.4 o superior) - [Descargar MongoDB](https://www.mongodb.com/try/download/community)
  - Puede ser una instancia local o en la nube (MongoDB Atlas)

Para verificar las versiones instaladas, ejecuta:

```bash
node --version
npm --version
```

## 📦 Instalación

1. **Clona el repositorio:**

```bash
git clone https://github.com/rcellas/jujutsu-kaisen-api-nestjs.git
cd jujutsu-kaisen-api-nestjs
```

2. **Instala las dependencias:**

```bash
npm install
```

3. **Configura las variables de entorno:**

Crea un archivo `.env` en la raíz del proyecto basándote en el archivo `.env.example`:

```bash
cp .env.example .env
```

Edita el archivo `.env` con tus configuraciones:

```env
MONGO_URI=mongodb://localhost:27017/jujutsu-kaisen-db
```

Si usas MongoDB Atlas, tu URI tendrá un formato similar a:

```env
MONGO_URI=mongodb+srv://<usuario>:<contraseña>@cluster.mongodb.net/jujutsu-kaisen-db
```

## 🚀 Ejecutar la Aplicación

### Modo Desarrollo

Para ejecutar la aplicación en modo desarrollo con recarga automática:

```bash
npm run start:dev
```

La API estará disponible en: `http://localhost:3000`

### Modo Producción

Para compilar y ejecutar en modo producción:

```bash
# Compilar el proyecto
npm run build

# Ejecutar en producción
npm run start:prod
```

### Modo Debug

Para ejecutar en modo debug (útil para depuración):

```bash
npm run start:debug
```

## 📖 Documentación de la API

Una vez que la aplicación esté en ejecución, puedes acceder a la documentación interactiva de Swagger en:

```
http://localhost:3000/documentation
```

Esta interfaz te permite explorar y probar todos los endpoints disponibles de forma interactiva.

## 🌐 Endpoints Principales

### Personajes

- `GET /character` - Obtiene todos los personajes
- `GET /character/:id` - Obtiene un personaje por su ID

### Localizaciones

- `GET /location` - Obtiene todas las localizaciones
- `GET /location/:id` - Obtiene una localización por su ID

### Técnicas

- `GET /technique` - Obtiene todas las técnicas
- `GET /technique/:id` - Obtiene una técnica por su ID

## 🧪 Testing

El proyecto incluye diferentes tipos de tests:

### Tests Unitarios

```bash
npm run test
```

### Tests en Modo Watch

Ejecuta los tests en modo watch (se re-ejecutan automáticamente al hacer cambios):

```bash
npm run test:watch
```

### Tests con Cobertura

Para generar un reporte de cobertura de código:

```bash
npm run test:cov
```

El reporte se generará en el directorio `/coverage`.

### Tests End-to-End (E2E)

```bash
npm run test:e2e
```

## 🎨 Linting y Formato de Código

### Linting

Para verificar y corregir problemas de estilo de código:

```bash
npm run lint
```

### Formato de Código

Para formatear el código con Prettier:

```bash
npm run format
```

## 📌 Versionado

Este proyecto utiliza versionado semántico (SemVer) para el control de versiones.

**Versión actual:** `0.0.1`

El formato del versionado es: `MAJOR.MINOR.PATCH`

- **MAJOR**: Cambios incompatibles con versiones anteriores
- **MINOR**: Nueva funcionalidad compatible con versiones anteriores
- **PATCH**: Correcciones de bugs compatibles con versiones anteriores

Puedes ver el historial completo de versiones en la sección de [Releases](https://github.com/rcellas/jujutsu-kaisen-api-nestjs/releases).

## 🤝 Contribuir al Proyecto

¡Las contribuciones son bienvenidas! Si deseas contribuir a este proyecto, sigue estos pasos:

### 1. Fork del Repositorio

Haz un fork del proyecto haciendo clic en el botón "Fork" en la parte superior derecha de la página del repositorio.

### 2. Clona tu Fork

```bash
git clone https://github.com/TU_USUARIO/jujutsu-kaisen-api-nestjs.git
cd jujutsu-kaisen-api-nestjs
```

### 3. Crea una Rama para tu Feature

```bash
git checkout -b feature/nombre-de-tu-feature
```

O para correcciones de bugs:

```bash
git checkout -b fix/descripcion-del-bug
```

### 4. Realiza tus Cambios

- Asegúrate de seguir las convenciones de código del proyecto
- Añade tests para nuevas funcionalidades
- Actualiza la documentación si es necesario

### 5. Ejecuta los Tests

Antes de hacer commit, asegúrate de que todos los tests pasen:

```bash
npm run test
npm run lint
```

### 6. Commit de tus Cambios

Utiliza mensajes de commit descriptivos:

```bash
git add .
git commit -m "feat: añade endpoint para obtener técnicas por categoría"
```

Convenciones para mensajes de commit:
- `feat:` Nueva funcionalidad
- `fix:` Corrección de bugs
- `docs:` Cambios en documentación
- `style:` Cambios de formato (sin afectar el código)
- `refactor:` Refactorización de código
- `test:` Añadir o modificar tests
- `chore:` Tareas de mantenimiento

### 7. Push a tu Fork

```bash
git push origin feature/nombre-de-tu-feature
```

### 8. Crea un Pull Request

Ve a la página del repositorio original y haz clic en "New Pull Request". Describe claramente:

- ¿Qué problema resuelve tu PR?
- ¿Qué cambios has realizado?
- ¿Cómo se puede probar?

### Reportar Issues

Si encuentras un bug o tienes una sugerencia:

1. Ve a la pestaña [Issues](https://github.com/rcellas/jujutsu-kaisen-api-nestjs/issues)
2. Haz clic en "New Issue"
3. Proporciona una descripción clara:
   - **Para bugs**: Pasos para reproducir, comportamiento esperado vs actual, capturas de pantalla si aplica
   - **Para features**: Descripción de la funcionalidad, casos de uso, beneficios

### Código de Conducta

- Sé respetuoso con otros contribuidores
- Acepta críticas constructivas
- Enfócate en lo que es mejor para la comunidad
- Muestra empatía hacia otros miembros de la comunidad

## 🛠️ Tecnologías Utilizadas

- **[NestJS](https://nestjs.com/)** - Framework de Node.js
- **[TypeScript](https://www.typescriptlang.org/)** - Lenguaje de programación
- **[MongoDB](https://www.mongodb.com/)** - Base de datos NoSQL
- **[Mongoose](https://mongoosejs.com/)** - ODM para MongoDB
- **[Swagger](https://swagger.io/)** - Documentación de API
- **[Jest](https://jestjs.io/)** - Framework de testing
- **[ESLint](https://eslint.org/)** - Linter para TypeScript
- **[Prettier](https://prettier.io/)** - Formateador de código

## 📂 Estructura del Proyecto

```
jujutsu-kaisen-api-nestjs/
├── src/
│   ├── character/          # Módulo de personajes
│   │   ├── controller/     # Controladores
│   │   ├── dto/            # Data Transfer Objects
│   │   ├── schema/         # Esquemas de MongoDB
│   │   └── service/        # Lógica de negocio
│   ├── location/           # Módulo de localizaciones
│   ├── technique/          # Módulo de técnicas
│   ├── scraper/            # Módulo de web scraping
│   ├── app.module.ts       # Módulo principal
│   └── main.ts             # Punto de entrada
├── test/                   # Tests E2E
├── .env                    # Variables de entorno (no versionado)
├── .env.example            # Ejemplo de variables de entorno
├── package.json            # Dependencias del proyecto
└── README.md               # Este archivo
```

## 📄 Licencia

Este proyecto no tiene una licencia específica definida. Para uso comercial o redistribución, contacta al autor.

## 👤 Autor

**rcellas**

- GitHub: [@rcellas](https://github.com/rcellas)
- Repositorio: [jujutsu-kaisen-api-nestjs](https://github.com/rcellas/jujutsu-kaisen-api-nestjs)

## 📞 Soporte

Si tienes alguna pregunta o necesitas ayuda:

- Abre un [Issue](https://github.com/rcellas/jujutsu-kaisen-api-nestjs/issues)
- Consulta la [documentación de NestJS](https://docs.nestjs.com/)

---

⭐ Si este proyecto te ha sido útil, considera darle una estrella en GitHub!
