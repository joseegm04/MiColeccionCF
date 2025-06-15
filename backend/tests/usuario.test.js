import request from 'supertest';
import { jest } from '@jest/globals';
import jwt from 'jsonwebtoken';
import app from '../src/index.js';
import { Usuario } from '../src/models/usuario.js';

jest.spyOn(Usuario, 'getUsuario').mockImplementation(async (nombre) => {
	if (nombre !== 'usuario') {
		throw new Error('Usuario no encontrado');
	}
	return {
		id: 1,
		nombre_usuario: nombre,
		correo: `${nombre}@mock.com`,
		ubicacion: "Madrid"
	};
});

jest.spyOn(Usuario, 'getUsuariosCercanos').mockImplementation(async (ubicacion, id) => {
	return [
		{ id: 2, nombre_usuario: "usuario1", ubicacion: "Madrid" }
	];
});

jest.spyOn(jwt, 'verify').mockImplementation(() => {
	return {
		id: 1,
		nombreUsuario: 'usuario'
	};
});

describe('Rutas del usuario', () => {
	it('/usuario/:nombre deberia devolver el usuario si existe', async () => {
		const res = await request(app).get('/usuario/usuario');

		expect(res.statusCode).toBe(200);
		expect(res.body).toHaveProperty('nombre_usuario', 'usuario');
	});

	it('/usuariosCercanos deberia devolver usuarios cercanos', async () => {
		const agent = request.agent(app);

		const res = await agent.get('/usuario/usuariosCercanos').set('Cookie', 'access_token=mocktoken');
		expect(res.statusCode).toBe(200);
		expect(Array.isArray(res.body)).toBe(true);
	});

	it("/usuario/:nombre devuelve error si no existe", async () => {
		const res = await request(app).get("/usuario/noexiste");
		expect(res.statusCode).toBe(400); // O 404 según tu implementación
		expect(res.body).toHaveProperty("error");
	});
});