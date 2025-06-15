// Archivo de rutas para los datos de los usuarios
import { Router } from 'express';
import { Usuario } from '../models/usuario.js';

export const usuarioRouter = Router();


usuarioRouter.get('/', async (req, res) => {
	const { nombreUsuario } = req.session.user;
	try {
		const usuario = await Usuario.getUsuario(nombreUsuario);
		res.json(usuario);
	} catch (error) {
		return res.status(400).json({ error: error.message });
	}
});

usuarioRouter.get("/usuariosCercanos", async (req, res) => {
	const { nombreUsuario } = req.session.user;

	try {
		const usuario = await Usuario.getUsuario(nombreUsuario);
		const usuariosCercanos = await Usuario.getUsuariosCercanos(usuario.ubicacion, usuario.id);
		res.json(usuariosCercanos);
	} catch (error) {
		return res.status(400).json({ error: error.message });
	}
});

usuarioRouter.get("/:nombre", async (req, res) => {
	const { nombre } = req.params;
	try {
		const usuario = await Usuario.getUsuario(nombre);
		if(usuario) return res.json(usuario);
	} catch (error) {
		return res.status(400).json({ error: error.message });
	}
	
});