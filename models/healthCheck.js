// models/healthCheck.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');  // Make sure this points to your sequelize instance

const HealthCheck = sequelize.define('HealthCheck', {
  check_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  check_datetime: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,  // Automatically set the current date and time
  }
}, {
  tableName: 'health_checks',  // Ensure the table name is 'health_checks'
  timestamps: false,  // Disable timestamps if not required
});

module.exports = HealthCheck;
