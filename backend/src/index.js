// Archivo principal del servidor, donde se crea el mismo y se configuran las rutas y middlewares
import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import { Usuario } from "./models/usuario.js";
import { usuarioRouter } from "./routes/usuario.js";
import { cromosRouter } from "./routes/cromos.js";
import { chatRouter } from "./routes/chat.js";
import { Chat } from "./models/chat.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
	origin: "http://localhost:4200",
	credentials: true,
}));

const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: "http://localhost:4200",
		credentials: true,
	}
});

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

app.post("/login", async (req, res) => {
	const { nombreUsuario, password } = req.body;
	if(!nombreUsuario || !password) {
		return res.status(400).json({ error: "Faltan datos" });
	}
	try {
		const usuario = await Usuario.login({ nombreUsuario, password });
		const token = jwt.sign(
			{ id: usuario.id, nombreUsuario: usuario.nombre_usuario},
			process.env.JWT_SECRET,
			{ expiresIn: "1h" }
		)

		res.cookie('access_token', token, {
			httpOnly: true,
			maxAge: 3600000,
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

app.use("/chat", chatRouter);

io.on("connection", (socket) => {
	socket.on("abrirChat", ({ id_emisor, id_receptor }) => {
		const nombreChat = [id_emisor, id_receptor].sort().join("-");
		socket.join(nombreChat);
	});

	socket.on("enviarMensaje", async (mensaje) => {
		const nombreChat = [mensaje.id_emisor, mensaje.id_receptor].sort().join("-");
		io.to(nombreChat).emit("recibirMensaje", mensaje);
		try {
			await Chat.guardarMensaje(mensaje.id_emisor, mensaje.id_receptor, mensaje.contenido);
		} catch (error) {
			console.error("error:", error);
		}
	})
});

server.listen(process.env.PORT)

export default app;
