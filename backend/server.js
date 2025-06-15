//En este archivo se levanta el servidor de la aplicación
import app from './src/index.js';
import { server } from './src/index.js';
import dotenv from 'dotenv';

dotenv.config();
const PORT = process.env.PORT || 3000;

server.listen(PORT);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});