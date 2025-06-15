//Archivo para validar los datos que se introducen al crear un nuevo usuario o iniciar sesión
export class Usuario {
	static correoValido(correo) {
		if (typeof correo !== "string") throw new Error("El correo debe ser un string");
		if (correo.length < 5) throw new Error("El correo debe tener al menos 5 caracteres");
		if (!correo.includes("@")) throw new Error("El correo debe tener un formato válido");
	}

	static nombreUsuarioValido(nombreUsuario) {
		if (typeof nombreUsuario !== "string") throw new Error("El nombre de usuario debe ser un string");
		if (nombreUsuario.length < 3) throw new Error("El nombre de usuario debe tener al menos 3 caracteres");
	}

	static passwordValido(password) {
		if (typeof password !== "string") throw new Error("La contraseña debe ser un string");
		if (password.length < 4) throw new Error("La contraseña debe tener al menos 4 caracteres");
	}

	static ubicacionValida(ubicacion) {
		if (typeof ubicacion !== "string") throw new Error("La ubicación debe ser un string");
		if (ubicacion.length < 5) throw new Error("La ubicación debe tener al menos 5 caracteres");
	}
}