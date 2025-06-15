// Interfaces para el usuario, cromos y colecciones
export interface Usuario {
	id: number;
	correo: string;
	nombre_usuario: string;
	ubicacion: string;
	colecciones?: { [nombre: string]: Coleccion };
}

export interface ColeccionesResponse {
	colecciones: Coleccion[];
}

export interface Coleccion {
	nombre: string;
	equipos: Equipo[];
}

export interface Equipo {
	nombre: string;
	cromos: Cromo[];
}

export interface Cromo {
	id: number;
	numero: string;
	nombre: string;
	marcado: boolean;
}