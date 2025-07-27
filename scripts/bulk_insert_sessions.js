const fs = require('fs');
const axios = require('axios');

// Configura aquí tu userId y la URL de tu backend
const userId = 'user1'; // Cambia esto por el userId deseado
const backendUrl = 'http://localhost:3000/api/v1/users/' + userId + '/sessions/bulk-insert';

// Lee el archivo de sesiones
const sessions = JSON.parse(fs.readFileSync('sessions_fake.json', 'utf8'));

async function bulkInsert() {
  try {
    const response = await axios.post(backendUrl, sessions, {
      headers: { 'Content-Type': 'application/json' }
    });
    console.log('Respuesta del backend:', response.data);
  } catch (error) {
    if (error.response) {
      console.error('Error en la respuesta:', error.response.data);
    } else {
      console.error('Error al hacer la petición:', error.message);
    }
  }
}

bulkInsert(); 