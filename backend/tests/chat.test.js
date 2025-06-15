//Archivo de tests para las rutas del chat
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
	];
});

Chat.connection = {
	execute: jest.fn().mockResolvedValue([{ insertId: 1 }])
};

describe("Rutas del chat", () => {
	it("chat/:idEmisor/:idReceptor debería devolver los mensajes entre dos usuarios", async () => {
		const res = await request(app).get("/chat/1/2");
		expect(res.statusCode).toBe(200);
		expect(Array.isArray(res.body)).toBe(true);
		expect(res.body[0]).toHaveProperty("idEmisor", "1");
		expect(res.body[0]).toHaveProperty("idReceptor", "2");
	});

	it("debería guardar un mensaje en la base de datos", async () => {
        const idEmisor = 1;
        const idReceptor = 2;
        const contenido = "Mensaje de prueba";

        await expect(Chat.guardarMensaje(idEmisor, idReceptor, contenido)).resolves.toBeUndefined();

        expect(Chat.connection.execute).toHaveBeenCalledWith(
            "INSERT INTO chat (contenido, id_emisor, id_receptor) VALUES (?, ?, ?)",
            [contenido, idEmisor, idReceptor]
        );
    });
});