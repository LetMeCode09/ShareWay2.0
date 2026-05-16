# ShareWay

**Plataforma de gestión de viajes compartidos sostenibles**

ShareWay es una aplicación web full-stack que permite publicar rutas de transporte compartido, gestionar reservas y administrar usuarios mediante una API REST protegida con JWT. El proyecto está alineado con los **ODS 11** (Ciudades y comunidades sostenibles) y **ODS 13** (Acción por el clima), fomentando el transporte compartido como alternativa sostenible.

---

## Índice

- [Tecnologías](#tecnologías)
- [Estructura del repositorio](#estructura-del-repositorio)
- [Arquitectura](#arquitectura)
- [Modelo de datos](#modelo-de-datos)
- [API REST](#api-rest)
- [Autenticación y roles](#autenticación-y-roles)
- [Puesta en marcha](#puesta-en-marcha)
- [Testing](#testing)
- [Spring Cloud Config](#spring-cloud-config)
- [Reflexión tecnológica](#reflexión-tecnológica)

---

## Tecnologías

### Backend
| Tecnología | Versión |
|---|---|
| Java | 21 |
| Spring Boot | 4.0.2 |
| Spring Security + JWT (jjwt) | 0.11.5 |
| Spring Data JPA + Hibernate | — |
| Spring Cloud Config Client | — |
| Spring Boot Actuator | — |
| MariaDB (prod) / H2 (dev) | 11.3.2 / — |
| Maven | — |
| Docker | — |

### Frontend
| Tecnología | Versión |
|---|---|
| React | 19.2.0 |
| Vite | 7.2.4 |
| TypeScript | 5.9.3 |
| React Router | — |
| Axios | — |

### Infraestructura
| Herramienta | Uso |
|---|---|
| Spring Cloud Config Server | Gestión centralizada de configuración |
| GitHub Actions + Newman | CI con tests automáticos en cada PR |
| Docker Compose | Levantar la base de datos en local |
| Postman | Colección de tests de integración |

---

## Estructura del repositorio

```
ShareWay2.0/
├── .github/
│   └── workflows/
│       └── postman-test.yaml       # CI — tests automáticos en PR
├── postman/
│   ├── shareway-trips-tests.postman_collection.json
│   ├── local.postman_environment.json
│   └── results/                    # Resultados generados por Newman
├── shareway-backend/               # API REST — Spring Boot
│   ├── src/main/java/com/svalero/ShareWay/
│   │   ├── controller/             # AuthController, TripController, ReservationController, UserController
│   │   ├── domain/                 # Trip, Reservation, User
│   │   ├── dto/                    # LoginRequest, RegisterRequest, AuthResponse
│   │   ├── exception/              # GlobalExceptionHandler, TripNotFoundException, UserNotFoundException
│   │   ├── repository/             # JPA repositories
│   │   ├── security/               # JwtService, JwtAuthenticationFilter, SecurityConfig
│   │   └── service/                # TripService, ReservationService, UserService, AuthService
│   ├── src/main/resources/
│   │   ├── application.properties
│   │   ├── h2.sql                  # Datos de prueba para dev
│   │   └── mariadb.sql             # Datos de prueba para prod
│   ├── docker-compose.dev.yaml     # MariaDB en Docker
│   ├── Dockerfile
│   └── pom.xml
├── shareway-frontend/              # SPA — React + Vite
│   └── src/
│       ├── api/                    # http.js, tripsApi, reservationsApi, usersApi
│       ├── components/             # Layout, PrivateRoute, Loading, ErrorBox, SearchSortBar...
│       ├── context/                # AuthContext
│       ├── i18n/                   # Textos en inglés
│       └── pages/                  # auth/, trips/, reservations/, users/, dashboard/
└── shareway.yaml                   # Especificación OpenAPI 3.0
```

> Este repositorio forma parte de un conjunto de tres proyectos relacionados:
> - **ShareWay2.0** — Backend + Frontend (este repositorio)
> - **ShareWayConfigServer** — Servidor de Spring Cloud Config
> - **ShareWayConfigRepo** — Repositorio de ficheros de configuración por entorno

---

## Arquitectura

```
┌─────────────────┐        ┌──────────────────┐        ┌─────────────────────┐
│  Config Repo    │◄──────►│  Config Server   │◄──────►│   Backend API       │
│  (GitHub)       │        │  :8888           │        │   Spring Boot :8080  │
│  dev.properties │        │  @EnableConfig   │        │   JWT + JPA         │
│  prod.properties│        │  Server          │        │                     │
└─────────────────┘        └──────────────────┘        └──────────┬──────────┘
                                                                   │
                                                         ┌─────────▼──────────┐
                                                         │   MariaDB / H2     │
                                                         │   :3306            │
                                                         └────────────────────┘
                                                                   ▲
                                                         ┌─────────┴──────────┐
                                                         │  Frontend React    │
                                                         │  Vite :5173        │
                                                         └────────────────────┘
```

El backend arranca con `spring.profiles.active=dev` (H2 en memoria) o `prod` (MariaDB). En ambos casos consulta la configuración al Config Server antes de inicializarse.

---

## Modelo de datos

```
┌──────────────────────┐         ┌──────────────────────┐
│         Trip         │         │      Reservation      │
├──────────────────────┤    1:N  ├──────────────────────┤
│ id: Long (PK)        │────────►│ id: Long (PK)        │
│ origin: String       │         │ numberOfSeats: Int    │
│ destination: String  │         │ reservationDate: Date │
│ dateTime: LocalDate  │         │ confirmed: Boolean    │
│ transportTypes: Enum │         │ comment: String       │
│ availableSeats: Int  │         │ totalPrice: Int       │
│ price: Int           │         │ trip_id: FK → Trip    │
│ full: Boolean        │         │ user_id: FK → User    │
└──────────────────────┘         └──────────────────────┘
                                            ▲
                                       N:1  │
                                 ┌──────────┴───────────┐
                                 │         User          │
                                 ├──────────────────────┤
                                 │ id: Long (PK)        │
                                 │ name: String         │
                                 │ email: String        │
                                 │ phone: String        │
                                 │ registrationDate: Date│
                                 │ stars: Int (0-5)     │
                                 │ verified: Boolean    │
                                 │ role: ADMIN / USER   │
                                 └──────────────────────┘
```

---

## API REST

La especificación completa está disponible en [`shareway.yaml`](./shareway-backend/shareway.yaml) (OpenAPI 3.0). Para visualizarla, pega el contenido en [editor.swagger.io](https://editor.swagger.io).

### Endpoints

| Recurso | Endpoint | Métodos | Rol |
|---|---|---|---|
| Auth | `/auth/login` | POST | Público |
| Auth | `/auth/register` | POST | Público |
| Trips | `/trips` | GET, POST | USER / ADMIN |
| Trips | `/trips/{id}` | GET, PUT, DELETE | USER / ADMIN |
| Reservations | `/reservations` | GET, POST | ADMIN |
| Reservations | `/reservations/{id}` | GET, PUT, DELETE | ADMIN |
| Users | `/users` | GET, POST | ADMIN |
| Users | `/users/{id}` | GET, PUT, DELETE | ADMIN |
| Users | `/users/email/{email}` | GET | ADMIN |
| Users | `/users/search?name=` | GET | ADMIN |

### Respuestas de error

Todos los errores devuelven el siguiente formato:

```json
{
  "timestamp": "2026-05-16T10:00:00",
  "status": 404,
  "error": "Trip not found",
  "message": "Trip not found with id: 99"
}
```

---

## Autenticación y roles

La API usa **JWT con HS256** y expiración de 24 horas. El token se obtiene haciendo login y debe enviarse en la cabecera de cada request:

```
Authorization: Bearer <token>
```

**Flujo:**
1. `POST /auth/login` con `{ email, password }` → devuelve `{ token, role, email }`
2. El cliente guarda el token y lo incluye en cada petición
3. `JwtAuthenticationFilter` valida el token en cada request
4. Spring Security aplica el control de acceso por rol

**Roles:**

| Rol | Acceso |
|---|---|
| `ADMIN` | Acceso completo a todos los endpoints |
| `USER` | Solo acceso a `/trips/**` |

**Credenciales de prueba:**

| Email | Contraseña | Rol |
|---|---|---|
| admin@shareway.com | admin123 | ADMIN |
| user@shareway.com | user123 | USER |

---

## Puesta en marcha

### Requisitos previos

- Java 21
- Maven
- Node.js 18+
- Docker

### 1. Config Server

Clona y arranca el Config Server antes que el backend:

```bash
# En el repositorio ShareWayConfigServer
mvn spring-boot:run
# Queda escuchando en http://localhost:8888
```

### 2. Base de datos (perfil prod)

```bash
cd shareway-backend

# Levantar MariaDB con Docker
docker compose -f docker-compose.dev.yaml up -d

# Esperar a que esté lista y ejecutar los datos de prueba
# (después de arrancar el backend para que Hibernate cree las tablas)
docker exec -i shareway-db mariadb -u shareway_user -pshareway_password shareway < src/main/resources/mariadb.sql
```

### 3. Backend

```bash
cd shareway-backend

# Perfil dev (H2 en memoria, no necesita Docker ni Config Server activo)
mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=dev --spring.config.import=optional:configserver:"

# Perfil prod (MariaDB + Config Server)
mvn spring-boot:run
# La API arranca en http://localhost:8080
```

### 4. Frontend

```bash
cd shareway-frontend
npm install
npm run dev
# Disponible en http://localhost:5173
```

---

## Testing

### Colección Postman

La carpeta `postman/` contiene una colección con **9 tests de integración** para el CRUD completo de `/trips`, cubriendo los casos 200, 201, 204, 400 y 404:

| Test | Endpoint | Código esperado |
|---|---|---|
| Login Admin | POST /auth/login | 200 |
| Listar viajes | GET /trips | 200 |
| Crear viaje | POST /trips | 201 |
| Body inválido | POST /trips | 400 |
| Obtener viaje | GET /trips/{id} | 200 |
| Viaje inexistente | GET /trips/99999 | 404 |
| Actualizar viaje | PUT /trips/{id} | 200 |
| Actualizar inexistente | PUT /trips/99999 | 404 |
| Eliminar viaje | DELETE /trips/{id} | 204 |
| Eliminar inexistente | DELETE /trips/99999 | 404 |

Para ejecutar manualmente:

```bash
npm install -g newman
newman run postman/shareway-trips-tests.postman_collection.json \
  --environment postman/local.postman_environment.json
```

### GitHub Actions

El workflow `.github/workflows/postman-test.yaml` se ejecuta automáticamente en cada **Pull Request** contra `main` o `develop`:

1. Checkout del código
2. Configurar JDK 21
3. Build del backend (`mvn package -DskipTests`)
4. Arranca la API con perfil `dev` (H2, sin dependencias externas)
5. Espera a que `/actuator/health` devuelva `UP`
6. Ejecuta la colección con Newman
7. Publica los resultados como artefacto descargable

---

## Spring Cloud Config

La configuración se gestiona de forma centralizada a través de tres componentes:

```
ShareWayConfigRepo (GitHub)
  ├── shareway-backend-dev.properties   → H2 en memoria
  └── shareway-backend-prod.properties  → MariaDB :3306
        ↓
ShareWayConfigServer (:8888)
        ↓
shareway-backend (:8080)
  └── spring.config.import=optional:configserver:http://localhost:8888
```

**Perfil `dev`:** base de datos H2 en memoria, se inicializa con `h2.sql` en cada arranque.

**Perfil `prod`:** MariaDB en Docker. Hibernate actualiza el esquema (`ddl-auto=update`) y los datos se insertan manualmente con `mariadb.sql`.

---

## Reflexión tecnológica

### Decisiones de diseño

**Spring Boot + React** — Separación clara entre backend (API REST stateless) y frontend (SPA). Permite trabajar en paralelo y facilita el escalado independiente de cada capa.

**JWT sin estado** — Se optó por autenticación stateless en lugar de sesiones para simplificar el despliegue y la integración con el frontend. El token incluye el rol del usuario para evitar consultas a la base de datos en cada request.

**Spring Cloud Config** — Centraliza la configuración de los entornos en un único repositorio de GitHub. Permite cambiar credenciales, URLs o cualquier propiedad sin recompilar la aplicación.

**H2 en dev** — Elimina la dependencia de Docker para desarrollo y tests de CI, reduciendo el tiempo de setup y el coste de los workflows de GitHub Actions.

**BCrypt con prefijo `$2a$`** — Las contraseñas se almacenan siempre con el prefijo que reconoce `BCryptPasswordEncoder` de Spring Security. El prefijo `$2y$` (generado por PHP) no es compatible y provoca errores 500 en el login.

**GlobalExceptionHandler** — Centraliza el manejo de errores con `@RestControllerAdvice`, garantizando que todos los endpoints devuelvan errores con el mismo formato JSON (timestamp, status, error, message).

### Uso de IA generativa

Se utilizó IA generativa (Claude) como apoyo en tareas concretas: generación de la colección Postman, depuración del workflow de GitHub Actions, corrección de hashes BCrypt incompatibles y generación de la especificación OpenAPI 3.0. En todos los casos el código fue revisado, adaptado y comprendido antes de integrarse al proyecto.
