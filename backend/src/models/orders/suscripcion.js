const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); 
const Suscripcion = sequelize.define('Suscripcion', {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    }
  },
  fecha: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'suscripciones',
  timestamps: false
});

module.exports = Suscripcion;
