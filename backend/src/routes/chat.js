//Archivo de rutas para los mensajes del chat
import { Router } from "express";
import { Chat } from "../models/chat.js";

export const chatRouter = Router();

chatRouter.get("/:idEmisor/:idReceptor", async (req, res) => {
	const { idEmisor, idReceptor } = req.params;
	try {
		const chat = await Chat.cargarMensajes(idEmisor, idReceptor);
		res.json(chat);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});