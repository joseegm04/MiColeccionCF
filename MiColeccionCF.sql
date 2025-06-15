# BD PROYECTO INTEGRADO
CREATE DATABASE MiColeccionCF;
USE MiColeccionCF;

CREATE TABLE usuarios (
	id INTEGER AUTO_INCREMENT PRIMARY KEY,
    correo VARCHAR(50) UNIQUE NOT NULL,
    nombre_usuario VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255),
	ubicacion VARCHAR(50),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE colecciones (
	id INTEGER AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(40)
);

CREATE TABLE usuario_colecciones (
	id_usuario INTEGER,
    id_coleccion INTEGER,
    PRIMARY KEY (id_usuario, id_coleccion),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (id_coleccion) REFERENCES colecciones(id) ON DELETE CASCADE
);

CREATE TABLE equipos (
	id INTEGER AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50),
    id_coleccion INTEGER,
    FOREIGN KEY (id_coleccion) REFERENCES colecciones(id)
);

CREATE TABLE cromos (
	id INTEGER AUTO_INCREMENT PRIMARY KEY,
    numero VARCHAR(10) DEFAULT NULL, -- LO DEJO COMO CADENA PORQUE ALGUNOS NÚMEROS CONTIENEN LETRAS: 6A/6B
    nombre VARCHAR(100),
    id_equipo INTEGER,
    FOREIGN KEY (id_equipo) REFERENCES equipos(id)
);

CREATE TABLE usuario_cromos (
	id_usuario INTEGER,
    id_cromo INTEGER,
    PRIMARY KEY (id_usuario, id_cromo),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (id_cromo) REFERENCES cromos(id) ON DELETE CASCADE
);

CREATE TABLE chat (
	id INTEGER AUTO_INCREMENT PRIMARY KEY,
    contenido TEXT,
    id_emisor INTEGER,
    id_receptor INTEGER,
    fecha_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_emisor) REFERENCES usuarios(id),
    FOREIGN KEY (id_receptor) REFERENCES usuarios(id)
);

#Insertar en la tabla usuarios
INSERT INTO usuarios (correo, nombre_usuario, password, ubicacion) VALUES ('jose@gmail.com', 'joseantoniogm', 'contraseña_hasheada', 'Malaga');

#Insertar en la tabla colecciones
INSERT INTO colecciones (nombre) VALUES ('LaLiga EA Sports 2024/25');

#Insertar en la tabla usuario_colecciones
INSERT INTO usuario_colecciones (id_usuario, id_coleccion) VALUES (1, 1);

#Insertar en la tabla equipos
INSERT INTO equipos (nombre, id_coleccion) VALUES ('Real Madrid', 1);

#Insertar en la tabla cromos
INSERT INTO cromos (numero, nombre, id_equipo) VALUES ('218', 'Courtois', 1);

#Insertar en la tabla usuario_cromos
INSERT INTO usuario_cromos VALUES (1, 2);

#Insertar en la tabla chat
INSERT INTO chat (contenido, id_emisor, id_receptor) VALUES ('Buenas tardes, tienes algún cromo del Real Madrid?', 1, 2);