CREATE TABLE vehiculo (
    id SERIAL PRIMARY KEY,
    marca VARCHAR(50) NOT NULL,
    placa VARCHAR(10) NOT NULL UNIQUE,
    modelo VARCHAR(50) NOT NULL,
    anio INT NOT NULL,
    color VARCHAR(20) NOT NULL,
    precio_por_dia DECIMAL(10, 2) NOT NULL,
    estado BOOLEAN NOT NULL
);

insert INTO vehiculo (marca, modelo, placa, anio, color, precio_por_dia, estado) VALUES
('Toyota', 'Corolla', 'ABC123', 2020, 'Rojo', 50.00, true),
('Honda', 'Civic', 'DEF456', 2019, 'Azul', 45.00, true),
('Ford', 'Focus', 'GHI789', 2021, 'Negro', 55.00, true);

Create table alquiler (
    id SERIAL PRIMARY KEY,
    dias INT NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    vehiculo_id INT NOT NULL,
    estado BOOLEAN NOT NULL,
    CONSTRAINT fk_alquiler_vehiculo FOREIGN KEY (vehiculo_id) REFERENCES vehiculo(id)
);

Insert into alquiler (dias, fecha_inicio, fecha_fin, total, vehiculo_id, estado) values
(5, '2023-01-01', '2023-01-06', 100.0, 1, true),
(3, '2023-02-01', '2023-02-04', 60.0, 2, true),
(7, '2023-03-01', '2023-03-08', 140.0, 2, false);

