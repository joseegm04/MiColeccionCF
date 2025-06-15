//Archivo de rutas para los datos de los cromos y colecciones
import { Router } from "express";
import { Cromos } from "../models/cromos.js";

export const cromosRouter = Router();

cromosRouter.get("/", async (req, res) => {
	try {
		const cromos = await Cromos.getCromos();
		if (cromos) return res.json(cromos);
	} catch (error) {
		return res.status(400).json({ error: error.message });
	}
});

cromosRouter.post("/insertarCromo", async (req, res) => {
	const { idUsuario, idCromo, idColeccion } = req.body;
	try {
		const id = await Cromos.insertarCromo(idUsuario, idCromo, idColeccion);
		return res.json({ id });
	} catch (error) {
		return res.status(400).json({ error: error.message });
	}
});

cromosRouter.delete("/borrarCromo", async (req, res) => {
	const { idUsuario, idCromo } = req.query;
	try {
		await Cromos.borrarCromo(idUsuario, idCromo);
		return res.json({ message: "Cromo borrado" });
	} catch (error) {
		return res.status(400).json({ error: error.message });
	}
});