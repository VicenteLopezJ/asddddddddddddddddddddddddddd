CREATE TABLE IF NOT EXISTS cliente (
    id SERIAL PRIMARY KEY,
    dni VARCHAR(20) NOT NULL UNIQUE,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    celular VARCHAR(20),
    correo VARCHAR(100),
    licencia VARCHAR(20),
    estado VARCHAR(20) NOT NULL DEFAULT 'ACTIVO'
);

INSERT INTO cliente (dni, nombres, apellidos, celular, correo, licencia, estado) VALUES
('72654321', 'Miguel Luis', 'Lopez Sanchez', '987654321', 'miguel@gmail.com', 'Q12345678', 'ACTIVO'),
('45678901', 'Ana Maria', 'Torres Quispe', '912345678', 'ana@gmail.com', 'P98765432', 'ACTIVO'),
('89012345', 'Carlos Alberto', 'Ramos Flores', '956789012', 'carlos@gmail.com', 'R11223344', 'INACTIVO')
ON CONFLICT (dni) DO NOTHING;
