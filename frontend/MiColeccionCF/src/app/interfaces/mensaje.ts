//Interfaz para los mensajes
export interface Mensaje {
	id?: number;
	contenido: string;
	id_emisor: number;
	id_receptor: number;
	fecha_envio: string;
}
