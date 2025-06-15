import request from "supertest";
import { jest } from "@jest/globals";
import app from "../src/index.js";
import { Cromos } from "../src/models/cromos.js";

jest.spyOn(Cromos, "getCromos").mockImplementation(async () => {
	return {
		colecciones: [
			{
				nombre: "Colección 1",
				equipos: [
					{
						nombre: "Equipo 1",
						cromos: [
							{ id: 1, numero: "1", nombre: "Cromo 1" }
						]
					}
				]
			}
		]
	};
});

jest.spyOn(Cromos, "insertarCromo").mockImplementation(async (idUsuario, idCromo, idColeccion) => 1);

jest.spyOn(Cromos, "borrarCromo").mockImplementation(async (idUsuario, idCromo) => {});

describe("Rutas de los cromos", () => {
	it("/cromos debería devolver las colecciones completas", async () => {
		const res = await request(app).get("/cromos");
		expect(res.statusCode).toBe(200);
		expect(res.body).toHaveProperty("colecciones");
	});

	it("/cromos/insertarCromo debería insertar un cromo en la coleccion de un usuario", async () => {
		const res = await request(app).post("/cromos/insertarCromo").send({ idUsuario: 1, idCromo: 1, idColeccion: 1 });
		expect(res.statusCode).toBe(200);
		expect(res.body).toHaveProperty("id", 1);
	});

	it("/cromos/borrarCromo debería borrar un cromo de la coleccion de un usuario", async () => {
		const res = await request(app).delete("/cromos/borrarCromo").query({ idUsuario: 1, idCromo: 1 });
		expect(res.statusCode).toBe(200);
		expect(res.body).toHaveProperty("message", "Cromo borrado");
	});
});