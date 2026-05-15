DELETE FROM users;
ALTER TABLE users AUTO_INCREMENT = 1;

INSERT INTO users (name, email, phone, registration_date, stars, verified, password, role)
VALUES (
    'Admin',
    'admin@shareway.com',
    '123456789',
    CURRENT_DATE,
    5,
    true,
    '$2y$10$9UVkGQEGeoVG8hGdzs71y.KS1cDjjsKT8iZu/17XzNFTByVobcPYS',
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
    '$2y$10$99tNYcUFLY50W5/aZzQRt.odz0nJAkVlM/xyLh4S/s/AydV/5XEUu',
    'USER'
);