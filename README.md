# 🏋️ Winterra Exercise Microservice

Microservicio de ejercicios para Winterra con arquitectura DDD (Domain-Driven Design) y TypeScript.

## 🏗️ Arquitectura DDD

```
📁 src/
├── 📁 domain/           # Capa de dominio
│   ├── 📁 entities/     # Entidades de negocio
│   ├── 📁 value-objects/ # Objetos de valor
│   ├── 📁 repositories/ # Interfaces de repositorios
│   └── 📁 services/     # Servicios de dominio
├── 📁 application/      # Capa de aplicación
│   ├── 📁 dtos/        # Data Transfer Objects
│   └── 📁 use-cases/   # Casos de uso
├── 📁 infrastructure/   # Capa de infraestructura
│   ├── 📁 database/    # Configuración y modelos de BD
│   └── 📁 services/    # Implementaciones de servicios
└── 📁 presentation/     # Capa de presentación
    ├── 📁 controllers/ # Controladores REST
    ├── 📁 middlewares/ # Middlewares
    └── 📁 routes/      # Rutas de la API
```

## 🚀 Características

- ✅ **Arquitectura DDD** - Separación clara de responsabilidades
- ✅ **TypeScript** - Tipado estático y mejor DX
- ✅ **MongoDB + Mongoose** - Base de datos NoSQL
- ✅ **Express.js** - Framework web rápido
- ✅ **Validación** - Joi para validación de datos
- ✅ **Seguridad** - Helmet, CORS, Rate Limiting
- ✅ **Logging** - Morgan para logs HTTP
- ✅ **Testing** - Jest para pruebas unitarias
- ✅ **Error Handling** - Manejo centralizado de errores

## 🧑‍💻 Estructura de Datos: Ejercicios y Sesiones (para ML)

Esta sección describe cómo se almacenan los datos de sesiones y ejercicios en la base de datos. Es útil para el equipo de Machine Learning que desee analizar, detectar anomalías o hacer forecasting sobre los datos generados por los usuarios.

### 📦 Ejercicio (`Exercise`)
Cada ejercicio almacenado tiene la siguiente estructura:

```json
{
  "id": "string",                // ID único del ejercicio
  "name": "string",              // Nombre del ejercicio
  "description": "string",       // Descripción (opcional)
  "category": "string",          // Categoría (por ejemplo: STRENGTH, CARDIO, etc.)
  "muscleGroups": ["string"],    // Grupos musculares involucrados
  "difficulty": "string",        // Dificultad (BEGINNER, INTERMEDIATE, ADVANCED)
  "equipment": ["string"],       // Equipamiento necesario (opcional)
  "instructions": ["string"],    // Instrucciones paso a paso (opcional)
  "createdAt": "ISODate",
  "updatedAt": "ISODate"
}
```

### 🏋️‍♂️ Sesión de Ejercicio (`ExerciseSession`)
Cada sesión de entrenamiento de un usuario se almacena así:

```json
{
  "id": "string",                // ID único de la sesión
  "userId": "string",            // ID del usuario
  "date": "ISODate",             // Fecha de la sesión
  "startTime": "ISODate",        // Hora de inicio
  "endTime": "ISODate",          // Hora de fin
  "totalDuration": 3600,          // Duración total en segundos
  "totalRestTime": 300,           // Tiempo total de descanso en segundos
  "totalSets": 12,                // Total de sets realizados
  "exercises": [                  // Lista de ejercicios realizados en la sesión
    {
      "id": "string",            // ID único del ejercicio en la sesión
      "name": "string",          // Nombre del ejercicio
      "muscleGroup": "string",   // Grupo muscular principal
      "sets": [                   // Sets realizados para este ejercicio
        {
          "id": "string",        // ID único del set
          "reps": 10,             // Repeticiones
          "weight": 50,           // Peso en kg (opcional)
          "restTime": 60,         // Descanso tras el set (segundos)
          "completed": true       // Si el set fue completado
        }
      ],
      "order": 1                  // Orden del ejercicio en la sesión
    }
  ],
  "statistics": {
    "setsByMuscleGroup": { "PECHO": 4, "ESPALDA": 8 }, // Sets por grupo muscular
    "totalCompletedSets": 12,      // Sets completados
    "totalRestTime": 300           // Descanso total en segundos
  },
  "notes": "string",              // Notas del usuario (opcional)
  "createdAt": "ISODate",
  "updatedAt": "ISODate"
}
```

#### Notas importantes para ML:
- Los campos de fecha y hora están en formato ISO 8601.
- El campo `statistics` permite análisis agregados por grupo muscular y sets completados.
- El campo `completed` en cada set indica si el usuario terminó ese set.
- El campo `order` en cada ejercicio indica la secuencia dentro de la sesión.

---

## 📋 Prerrequisitos

- Node.js >= 18.0.0
- MongoDB >= 5.0
- npm o yarn

## 🛠️ Instalación

1. **Clonar el repositorio**
```bash
cd Winterra_exercise_microservice
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp env.example .env
```

Editar `.env` con tus configuraciones:
```env
MONGODB_URI=mongodb://localhost:27017/winterra_exercise
PORT=3000
NODE_ENV=development
```

4. **Ejecutar en desarrollo**
```bash
npm run dev
```

5. **Construir para producción**
```bash
npm run build
npm start
```

## 📚 API Endpoints

### Health Check
```
GET /health
```

### Ejercicios
```
GET    /api/v1/exercises          # Listar ejercicios
GET    /api/v1/exercises/:id      # Obtener ejercicio
POST   /api/v1/exercises          # Crear ejercicio
PUT    /api/v1/exercises/:id      # Actualizar ejercicio
DELETE /api/v1/exercises/:id      # Eliminar ejercicio
GET    /api/v1/exercises/search   # Buscar ejercicios
GET    /api/v1/exercises/stats    # Estadísticas
```

### Sesiones
```
GET    /api/v1/sessions           # Listar sesiones del usuario
GET    /api/v1/sessions/:id       # Obtener sesión
POST   /api/v1/sessions           # Crear sesión
PUT    /api/v1/sessions/:id       # Actualizar sesión
DELETE /api/v1/sessions/:id       # Eliminar sesión
GET    /api/v1/sessions/stats     # Estadísticas de sesiones
```

### Usuarios
```
GET    /api/v1/users/profile      # Obtener perfil
PUT    /api/v1/users/profile      # Actualizar perfil
GET    /api/v1/users/progress     # Progreso del usuario
```

## 🔧 Desarrollo

### Estructura de Entidades

#### Exercise
```typescript
interface Exercise {
  id: string;
  name: string;
  description?: string;
  category: ExerciseCategory;
  muscleGroups: MuscleGroup[];
  difficulty: ExerciseDifficulty;
  equipment?: string[];
  instructions?: string[];
  createdAt: Date;
  updatedAt: Date;
}
```

#### ExerciseSession
```typescript
interface ExerciseSession {
  id: string;
  userId: string;
  name: string;
  exercises: ExerciseEntry[];
  totalDuration: number;
  totalSets: number;
  totalRestTime: number;
  date: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Value Objects

#### Weight
```typescript
const weight = Weight.fromKg(100);
const weightInLbs = weight.toLbs();
const totalWeight = weight1.add(weight2);
```

#### Duration
```typescript
const duration = Duration.fromMinutes(5);
const timeString = duration.toTimeString(); // "05:00"
const readable = duration.toReadableString(); // "5m 0s"
```

## 🧪 Testing

```bash
# Ejecutar todas las pruebas
npm test

# Ejecutar pruebas en modo watch
npm run test:watch

# Ejecutar pruebas con coverage
npm run test:coverage
```

## 📊 Monitoreo

### Health Check
```bash
curl http://localhost:3000/health
```

### Métricas
- Total de ejercicios
- Ejercicios por categoría
- Sesiones por usuario
- Progreso de usuarios

## 🔐 Seguridad

- **Rate Limiting**: 100 requests por 15 minutos
- **CORS**: Configurado para desarrollo
- **Helmet**: Headers de seguridad
- **Validación**: Joi para validar inputs
- **Sanitización**: Limpieza de datos

## 🚀 Despliegue

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3000
CMD ["npm", "start"]
```

### Variables de Entorno de Producción
```env
NODE_ENV=production
MONGODB_URI=mongodb://prod-db:27017/winterra_exercise
PORT=3000
JWT_SECRET=your-super-secret-key
RATE_LIMIT_MAX_REQUESTS=1000
```

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit los cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 🆘 Soporte

- 📧 Email: support@winterra.com
- 📖 Documentación: [docs.winterra.com](https://docs.winterra.com)
- 🐛 Issues: [GitHub Issues](https://github.com/winterra/exercise-microservice/issues)

---

**Desarrollado con ❤️ por el equipo de Winterra** 