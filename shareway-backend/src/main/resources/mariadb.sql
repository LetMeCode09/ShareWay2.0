DELETE FROM reservations;
DELETE FROM trips;
DELETE FROM users;

ALTER TABLE reservations AUTO_INCREMENT = 1;
ALTER TABLE trips AUTO_INCREMENT = 1;
ALTER TABLE users AUTO_INCREMENT = 1;

-- USERS
INSERT INTO users (name, email, phone, registration_date, stars, verified, password, role)
VALUES (
           'Admin',
           'admin@shareway.com',
           '123456789',
           CURRENT_DATE,
           5,
           true,
           '$2a$10$9UVkGQEGeoVG8hGdzs71y.KS1cDjjsKT8iZu/17XzNFTByVobcPYS',
           'ADMIN'
       );

INSERT INTO users (name, email, phone, registration_date, stars, verified, password, role)
VALUES (
           'User',
           'user@shareway.com',
           '987654321',
           CURRENT_DATE,
           0,
           true,
           '$2a$10$99tNYcUFLY50W5/aZzQRt.odz0nJAkVlM/xyLh4S/s/AydV/5XEUu',
           'USER'
       );

INSERT INTO users (id, email, name, phone, registration_date, stars, verified, user_id, password, role)
VALUES
    (3, 'laura@shareway.com', 'Laura Martinez', '611223344', '2026-05-10', 4, true, NULL,
     '$2a$10$99tNYcUFLY50W5/aZzQRt.odz0nJAkVlM/xyLh4S/s/AydV/5XEUu', 'USER'),
    (4, 'carlos@shareway.com', 'Carlos Perez', '622334455', '2026-05-11', 5, true, NULL,
     '$2a$10$99tNYcUFLY50W5/aZzQRt.odz0nJAkVlM/xyLh4S/s/AydV/5XEUu', 'USER'),
    (5, 'maria@shareway.com', 'Maria Lopez', '633445566', '2026-05-12', 3, false, NULL,
     '$2a$10$99tNYcUFLY50W5/aZzQRt.odz0nJAkVlM/xyLh4S/s/AydV/5XEUu', 'USER'),
    (6, 'david@shareway.com', 'David Romero', '644556677', '2026-05-13', 2, true, NULL,
     '$2a$10$99tNYcUFLY50W5/aZzQRt.odz0nJAkVlM/xyLh4S/s/AydV/5XEUu', 'USER'),
    (7, 'sofia@shareway.com', 'Sofia Navarro', '655667788', '2026-05-14', 5, true, NULL,
     '$2a$10$99tNYcUFLY50W5/aZzQRt.odz0nJAkVlM/xyLh4S/s/AydV/5XEUu', 'USER');

-- TRIPS
INSERT INTO trips (id, origin, destination, date_time, transport_types, available_seats, prices, is_full)
VALUES
    (1, 'Zaragoza', 'Madrid',     '2026-05-20', 'CAR',   3, 25, false),
    (2, 'Barcelona', 'Valencia',  '2026-05-22', 'TRAIN', 5, 40, false),
    (3, 'Sevilla', 'Málaga',      '2026-05-25', 'BUS',   1, 15, true),
    (4, 'Bilbao', 'Santander',    '2026-05-28', 'CAR',   2, 18, false),
    (5, 'Zaragoza', 'Barcelona',  '2026-06-01', 'CAR',   1, 20, false);

-- RESERVATIONS
INSERT INTO reservations (id, number_of_seats, reservation_date, confirmed, comment, total_price, user_id, trip_id)
VALUES
    (1,  2, '2026-05-16', true,  'Necesitamos espacio para maletas', 50, 2, 1),
    (2,  1, '2026-05-16', true,  'Viaje rápido',                     40, 2, 2),
    (3,  3, '2026-05-17', false, 'Pendiente de confirmación',         45, 3, 3),
    (4,  1, '2026-05-18', true,  'Voy con mochila pequeña',           18, 3, 4),
    (5,  1, '2026-05-18', false, 'Reserva provisional',               20, 5, 5),
    (6,  1, '2026-05-16', true,  'Solo equipaje de mano',             25, 3, 1),
    (7,  2, '2026-05-17', true,  'Vamos dos compañeros',              80, 4, 2),
    (8,  1, '2026-05-17', false, 'Pendiente de pago',                 15, 5, 3),
    (9,  1, '2026-05-18', true,  'Prefiero asiento delantero',        18, 6, 4),
    (10, 1, '2026-05-18', true,  'Viaje de trabajo',                  20, 7, 5),
    (11, 2, '2026-05-19', false, 'Puede que se retrase',              50, 3, 1),
    (12, 1, '2026-05-19', true,  'Sin comentarios',                   40, 5, 2);