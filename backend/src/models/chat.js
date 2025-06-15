// Archivo en el que se hacen las conexiones a la base de datos sobre los mensajes del chat
import dotenv from "dotenv";
import mysql from 'mysql2/promise';

dotenv.config();

const config = {
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
	port: process.env.DB_PORT
};

const connection = await mysql.createConnection(config);

export class Chat {
	static connection = connection;

	static async guardarMensaje(idEmisor, idReceptor, contenido) {
		await this.connection.execute(
			"INSERT INTO chat (contenido, id_emisor, id_receptor) VALUES (?, ?, ?)",
			[contenido, idEmisor, idReceptor]
		);
	}

	static async cargarMensajes(idEmisor, idReceptor) {
		const [rows] = await this.connection.execute(
			"SELECT * FROM chat WHERE (id_emisor = ? AND id_receptor = ?) OR (id_emisor = ? AND id_receptor = ?) ORDER BY fecha_envio ASC",
			[idEmisor, idReceptor, idReceptor, idEmisor]
		);
		return rows;
	}
}