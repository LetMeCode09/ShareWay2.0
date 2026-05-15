REST API for the management of reservations and sustainable trips. Implemented in Java 21 and Spring Boot 3.2.5.

🛠 Technology Stack  
Core: Java 21, Spring Boot 3.2.5  
Data: MariaDB (Prod/Dev)  
Infrastructure: Docker, Docker Compose  
Documentation: OpenAPI 3.0  

🏗 Architecture  
The project follows a layered architecture:  
- Controller Layer: REST endpoints and global exception handling.  
- Service Layer: API business logic and transaction management.  
- Repository Layer: Data access layer and CRUD operations.  

⚙️ Configuration and Deployment  
Infrastructure and Execution  

1. Start the database (Docker)  
docker compose -f docker-compose.dev.yaml up -d  

2. Run the application  
mvn spring-boot:run  

📄 API Documentation - OpenAPI 3.0  
The official API definition is available in the `shareway.yaml` specification file included in the project.

🔗 Main Endpoints

Users  
- GET    /users          → Retrieve all users  
- GET    /users/{id}     → Retrieve a user by ID  
- POST   /users          → Create a new user  
- PUT    /users/{id}     → Update a user  
- DELETE /users/{id}     → Delete a user  

Trips  
- GET    /trips          → Retrieve all trips  
- GET    /trips/{id}     → Retrieve a trip by ID  
- POST   /trips          → Create a new trip  
- PUT    /trips/{id}     → Update a trip  
- DELETE /trips/{id}     → Delete a trip  

Reservations  
- GET    /reservations           → Retrieve all reservations  
- GET    /reservations/{id}      → Retrieve a reservation by ID  
- POST   /reservations           → Create a new reservation  
- DELETE /reservations/{id}      → Cancel a reservation  
