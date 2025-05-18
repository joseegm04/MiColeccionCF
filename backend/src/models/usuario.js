import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { Usuario as Validaciones } from '../Validations/usuario.js';

dotenv.config();

const config = {
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
	port: process.env.DB_PORT
};

const connection = await mysql.createConnection(config);

export class Usuario {
	
	static async crear(usuario){
		const { correo, nombreUsuario, password, ubicacion } = usuario;

		Validaciones.correoValido(correo);
		Validaciones.nombreUsuarioValido(nombreUsuario);
		Validaciones.passwordValido(password);
		Validaciones.ubicacionValida(ubicacion);

		const [correoExistente] = await connection.execute("SELECT * FROM usuarios WHERE correo = ?", [correo]);
		if (correoExistente.length > 0) throw new Error("El correo ya está registrado");

		const [usuarioExistente] = await connection.execute("SELECT * FROM usuarios WHERE nombre_usuario = ?", [nombreUsuario]);
		if (usuarioExistente.length > 0) throw new Error("El nombre de usuario ya está registrado");

		const hashedPassword = await bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS, 10));
		const [result] = await connection.execute("INSERT INTO usuarios (correo, nombre_usuario, password, ubicacion) VALUES (?, ?, ?, ?)",
			[correo, nombreUsuario, hashedPassword, ubicacion]);

		return result.insertId;
	}

	static async login(usuario){
		const { nombreUsuario, password } = usuario;

		Validaciones.nombreUsuarioValido(nombreUsuario);
		Validaciones.passwordValido(password);

		const [rows] = await connection.execute("SELECT * FROM usuarios WHERE nombre_usuario = ?", [nombreUsuario]);
		const datosUsuario = rows[0];

		if (!datosUsuario) throw new Error("El usuario no se ha encontrado");

		const match = await bcrypt.compare(password, datosUsuario.password);
		if (!match) throw new Error("La contraseña es incorrecta");
		const { password: _, ...usuarioLogin} = datosUsuario;

		return usuarioLogin;
	}

	static async getUsuario(id){
		const [rows] = await connection.execute(`
			select usuarios.id, usuarios.correo, usuarios.nombre_usuario, usuarios.ubicacion, cromos.id as idCromo, cromos.numero as numCromo, cromos.nombre as nombreCromo, equipos.nombre as nombreEquipo, usuario_cromos.repetido, c.nombre as nombreColeccion from usuarios 
					join usuario_colecciones on usuarios.id = usuario_colecciones.id_usuario 
					join colecciones c on c.id = usuario_colecciones.id_coleccion
					join equipos on equipos.id_coleccion = c.id
					join cromos on cromos.id_equipo = equipos.id
					join usuario_cromos on cromos.id = usuario_cromos.id_cromo and usuarios.id = usuario_cromos.id_usuario
					where usuarios.id = ?;
		`, [id]);

		if (rows.length === 0 ) {
			const [rows] = await connection.execute("SELECT id, correo, nombre_usuario, ubicacion FROM usuarios WHERE id = ?", [id]);
			return rows[0];
		}
		
		const { correo, nombre_usuario, ubicacion } = rows[0];
		const colecciones = {};
		const equiposMap = {};

		rows.forEach(row => {
			if(!colecciones[row.nombreColeccion]){
				colecciones[row.nombreColeccion] = {
					id: row.id_coleccion,
					nombre: row.nombreColeccion,
					equipos: []
				}
			}

			if(!equiposMap[row.nombreEquipo]) {
				equiposMap[row.nombreEquipo] = { 
					nombre: row.nombreEquipo, 
					cromos: [] 
				};
				colecciones[row.nombreColeccion].equipos.push(equiposMap[row.nombreEquipo]);
			}
			equiposMap[row.nombreEquipo].cromos.push({
				id: row.idCromo,
				numero: row.numCromo,
				nombre: row.nombreCromo
			});
		});

		return {
			id: rows[0].id,
			correo,
			nombre_usuario,
			ubicacion,
			colecciones: colecciones
		};
	}
	
	static async getUsuariosCercanos(ubicacion){
		const [rows] = await connection.execute("SELECT id, nombre_usuario, ubicacion FROM usuarios WHERE ubicacion = ?", [ubicacion]);
		const usuarios = rows;

		return usuarios;
	}
}