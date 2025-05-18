import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import cors from "cors";
import { Usuario } from "./models/usuario.js";
import { usuarioRouter } from "./routes/usuario.js";
import { cromosRouter } from "./routes/cromos.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
	 origin: "http://localhost:4200" ,
	 credentials: true,
}));

app.use((req, res, next) => {
	const token = req.cookies.access_token;
	req.session = { user: null};
	try {
		const data = jwt.verify(token, process.env.JWT_SECRET);
		req.session.user = data;
	} catch {}

	next();
});

app.get("/", (req, res) => {
	res.json({"message": "Hello World!"});
})

app.post("/register", async (req, res) => {
	const { correo, nombreUsuario, password, ubicacion } = req.body;
	if(!correo || !nombreUsuario || !password || !ubicacion) {
		return res.status(400).json({ error: "Faltan datos" });
	}
	try {
		const id = await Usuario.crear({ correo, nombreUsuario, password, ubicacion });
		res.send({ id });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

app.post("/login", async (req, res) => { //Para iniciar sesion solo requiero del nombre de usuario y la contraseña
	const { nombreUsuario, password } = req.body;
	if(!nombreUsuario || !password) {
		return res.status(400).json({ error: "Faltan datos" });
	}
	try {
		const usuario = await Usuario.login({ nombreUsuario, password });
		const token = jwt.sign(
			{ id: usuario.id, nombreUsuario: usuario.nombreUsuario},
			process.env.JWT_SECRET,
			{ expiresIn: "1h" }
		)

		res.cookie('access_token', token, {
			httpOnly: true,
			maxAge: 3600000, // 1 hour
			sameSite: "lax",
			secure: false
		}).send(usuario);
	} catch (error) {
		return res.status(400).json({ error: error.message });
	}
});

app.post("/logout", (req, res) => {
	res.clearCookie("access_token", { httpOnly: true, sameSite: "lax", secure: false }).json({ message: "Sesión cerrada" });
});

app.get("/check", (req, res) => {
	if(req.session.user) {
		return res.json({ autenticado: true, usuario: req.session.user });
	}
	return res.status(401).json({ autenticado: false });
})

app.use("/usuario", usuarioRouter);

app.use("/cromos", cromosRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});