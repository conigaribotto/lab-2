const { Sequelize } = require('sequelize');

// Configuración de Sequelize
const sequelize = new Sequelize('laboratorio222', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  port: 3306
});

// Probar la conexión
sequelize.authenticate()
  .then(() => {
    console.log('Conexión a la base de datos exitosa!!');
  })
  .catch(err => {
    console.error('Error de conexión:', err);
  });

module.exports = sequelize;
