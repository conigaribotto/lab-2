const { Sequelize } = require('sequelize');

// Configuración de Sequelize
const sequelize = new Sequelize(
  process.env.DB_NAME,     
  process.env.DB_USERNAME,   
  process.env.DB_PASSWORD,   
  {
    host: process.env.DB_HOST,  
    dialect: 'mysql',           
    logging: false,     // Desactiva comentarios de Sequelize
    port: process.env.DB_PORT
  }
)

// Probar la conexión
sequelize.authenticate()
  .then(() => {
    console.log('Conexión a la base de datos exitosa!!');
  })
  .catch(err => {
    console.error('Error de conexión:', err);
  });

module.exports = sequelize;
