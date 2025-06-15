//Interfaz para el login
export interface LoginResponse {
	id: number;
	correo: string;
	nombre_usuario: string;
	ubicacion: string;
	fecha_registro: string;
}

export interface Login {
	nombreUsuario: string;
	password: string;
}