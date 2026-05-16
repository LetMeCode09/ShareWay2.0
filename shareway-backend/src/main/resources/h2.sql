DELETE FROM users;

INSERT INTO users (name, email, phone, registration_date, stars, verified, password, role)
VALUES (
           'Admin',
           'admin@shareway.com',
           '123456789',
           CURRENT_DATE,
           5,
           true,
           '$2a$10$j4L6CC/ycr1.m4TSf9ARR.45xZLnaOQVppBouLUwntylnQdXdayAu',
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
           '$2a$10$kLInygqk9ESxTNrfOJlog.Tu/a1bcHG8WC2UM.RwgELaQakyvfmiS',
           'USER'
       );