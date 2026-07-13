CREATE TABLE IF NOT EXISTS alquiler (
    id SERIAL PRIMARY KEY,
    vehiculo_id BIGINT NOT NULL,
    cliente_id BIGINT NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    dias INT NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    estado VARCHAR(20) NOT NULL DEFAULT 'ACTIVO'
);

INSERT INTO alquiler (vehiculo_id, cliente_id, fecha_inicio, fecha_fin, dias, total, estado) VALUES
(1, 1, '2024-01-01', '2024-01-06', 5, 250.00, 'ACTIVO'),
(2, 2, '2024-02-01', '2024-02-04', 3, 135.00, 'ACTIVO'),
(3, 3, '2024-03-01', '2024-03-08', 7, 385.00, 'INACTIVO')
ON CONFLICT DO NOTHING;
