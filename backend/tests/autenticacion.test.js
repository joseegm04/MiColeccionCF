import request from "supertest";
import { jest } from "@jest/globals";
import app from "../src/index.js";
import { Usuario } from "../src/models/usuario.js";


jest.spyOn(Usuario, "crear").mockImplementation(async (data) => {
	return 1; 
});

jest.spyOn(Usuario, "login").mockImplementation(async (data) => {
	return {
		id: 1,
		nombre_usuario: data.nombreUsuario,
		correo: "usuario@mock.com",
		ubicacion: "Madrid"
	};
});

describe("Autenticación de Usuarios", () => {
	it("/register debería funcionar con mock", async () => {
		const res = await request(app).post("/register").send({
			correo: "usuario@mock.com",
			nombreUsuario: "usuario",
			password: "123456",
			ubicacion: "Madrid"
		});
		expect(res.statusCode).toBe(200);
		expect(res.body).toHaveProperty("id", 1);
	});

	it("/login debería funcionar con mock", async () => {
		const res = await request(app).post("/login").send({
			nombreUsuario: "usuario",
			password: "123456"
		});
		expect(res.statusCode).toBe(200);
		expect(res.body).toHaveProperty("id", 1);
		expect(res.headers["set-cookie"]).toBeDefined();
	});

	it("/register debería fallar si faltan datos", async () => {
		const res = await request(app).post("/register").send({ nombreUsuario: "usuario" });
		expect(res.statusCode).toBe(400);
		expect(res.body).toHaveProperty("error");
	});

	it("/login debería fallar si faltan datos", async () => {
		const res = await request(app).post("/login").send({ nombreUsuario: "usuario" });
		expect(res.statusCode).toBe(400);
		expect(res.body).toHaveProperty("error");
	});

	it("/logout debería limpiar la cookie", async () => {
		const res = await request(app).post("/logout");
		expect(res.statusCode).toBe(200);
		expect(res.body).toHaveProperty("message", "Sesión cerrada");
	});

	it("/check debería devolver usuario autenticado si hay cookie", async () => {
		const loginRes = await request(app).post("/login").send({ nombreUsuario: "usuario", password: "123456" });
		const cookies = loginRes.headers['set-cookie'];
		const res = await request(app).get("/check").set("Cookie", cookies);
		
		expect(res.statusCode).toBe(200);
		expect(res.body).toHaveProperty("autenticado", true);
		expect(res.body.usuario).toHaveProperty("nombreUsuario", "usuario");
	});
});
