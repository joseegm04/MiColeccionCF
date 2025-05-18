import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import e from 'express';

dotenv.config();

const config = {
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
	port: process.env.DB_PORT
};

const connection = await mysql.createConnection(config);

export class Cromos {
	static async getCromos() {
		const [rows] = await connection.execute(`select cromos.id, cromos.numero, cromos.nombre, equipos.nombre as equipo, colecciones.nombre as coleccion from cromos 
												join equipos on cromos.id_equipo = equipos.id 
												join colecciones on equipos.id_coleccion = colecciones.id;`
		);

		const coleccionCompleta = { colecciones: []};
		const coleccionesMap = {};

		rows.forEach((cromo) => {
			if(!coleccionesMap[cromo.coleccion]) {
				coleccionesMap[cromo.coleccion] = { 
					nombre: cromo.coleccion, 
					equipos: [] 
				};
				coleccionCompleta.colecciones.push(coleccionesMap[cromo.coleccion]);
			}
			let equipo = coleccionesMap[cromo.coleccion].equipos.find(e => e.nombre === cromo.equipo);
			if(!equipo) {
				equipo = { 
					nombre: cromo.equipo, 
					cromos: [] 
				};
				coleccionesMap[cromo.coleccion].equipos.push(equipo);
			}
			equipo.cromos.push({ 
				id: cromo.id, 
				numero: cromo.numero, 
				nombre: cromo.nombre 
			});
		});

		return coleccionCompleta;
	}

	static async insertarCromo(idUsuario, idCromo, idColeccion) {
		const coleccion = await connection.execute(`select * from usuario_colecciones where id_usuario = ? and id_coleccion = ?`,
			[idUsuario, idColeccion]
		);

		if (coleccion[0].length === 0) await connection.execute(`insert into usuario_colecciones (id_usuario, id_coleccion) values (?, ?)`, [idUsuario, idColeccion]);

		const cromo = await connection.execute(`select * from usuario_cromos where id_usuario = ? and id_cromo = ?`,
			[idUsuario, idCromo]
		);

		if (cromo[0].length > 0) return { "message": "El cromo ya existe" };
		
		const [rows] = await connection.execute(`insert into usuario_cromos (id_usuario, id_cromo) values (?, ?)`,
			[idUsuario, idCromo]
		);
		

		if (rows.affectedRows === 0) {
			throw new Error("No se ha podido guardar el cromo");
		}
		return rows.insertId;
	}

	static async borrarCromo(idUsuario, idCromo) {
		const [rows] = await connection.execute(`delete from usuario_cromos where id_usuario = ? and id_cromo = ?`,
			[idUsuario, idCromo]
		);
		if (rows.affectedRows === 0) {
			throw new Error("No se ha podido borrar el cromo");
		}
	}
}