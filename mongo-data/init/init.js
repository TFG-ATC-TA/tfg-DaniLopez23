// init.js
db = db.getSiblingDB('tfg_prod');

// Crear usuario de la aplicación
db.createUser({
  user: 'appuser',
  pwd: 'apppassword',
  roles: [{ role: 'readWrite', db: 'tfg_prod' }]
});

// Cargar datos
load('/docker-entrypoint-initdb.d/farms.js');
load('/docker-entrypoint-initdb.d/equipments.js');
load('/docker-entrypoint-initdb.d/devices.js');