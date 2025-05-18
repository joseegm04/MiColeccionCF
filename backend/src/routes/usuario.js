import { Router } from 'express';
import { Usuario } from '../models/usuario.js';

export const usuarioRouter = Router();

//Cuando inicie sesión, enviar los usuarios de la misma provincia para sugerirlos en el cliente
usuarioRouter.get('/', async (req, res) => {
	const { id } = req.session.user;
	try {
		const usuario = await Usuario.getUsuario(id);
		res.json(usuario);
	} catch (error) {
		return res.status(400).json({ error: error.message });
	}
});

usuarioRouter.get("/usuariosCercanos", async (req, res) => {
	const { id } = req.session.user;

	try {
		const usuario = await Usuario.getUsuario(id);
		const usuariosCercanos = await Usuario.getUsuariosCercanos(usuario.ubicacion);
		res.json(usuariosCercanos);
	} catch (error) {
		return res.status(400).json({ error: error.message });
	}
});

usuarioRouter.get("/:id", async (req, res) => {
	const { id } =req.params;
	try {
		const usuario = await Usuario.getUsuario(id);
		if(usuario) return res.json(usuario);
	} catch (error) {
		return res.status(400).json({ error: error.message });
	}
	
});