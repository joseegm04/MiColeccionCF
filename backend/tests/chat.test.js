import request from "supertest";
import { expect, jest } from "@jest/globals";
import app from "../src/index.js";
import { Chat } from "../src/models/chat.js";

jest.spyOn(Chat, "cargarMensajes").mockImplementation(async (idEmisor, idReceptor) => {
	return [
		{
			id: 1,
			contenido: "Hola",
			idEmisor: idEmisor,
			idReceptor: idReceptor,
			fecha: "2025-06-12T12:00:00Z"
		}
	]
});

describe("Rutas del chat", () => {
	it("chat/:idEmisor/:idReceptor debería devolver los mensajes entre dos usuarios", async () => {
		const res = await request(app).get("/chat/1/2");
		expect(res.statusCode).toBe(200);
		expect(Array.isArray(res.body)).toBe(true);
		expect(res.body[0]).toHaveProperty("idEmisor", "1");
		expect(res.body[0]).toHaveProperty("idReceptor", "2");
	});
});