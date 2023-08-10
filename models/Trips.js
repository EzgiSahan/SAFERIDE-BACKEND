import { DataTypes } from 'sequelize';
import sequelize from '../db.js';
import { v4 as uuidv4 } from 'uuid';

const Trips = sequelize.define('trips', {
    id: {
        type: DataTypes.UUID, // Use UUID data type
        defaultValue: () => uuidv4(), // Generate UUID automatically
        primaryKey: true,
    },
    code: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    departureDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    arrivalDate: {
        type: DataTypes.DATE,
        allowNull: false
    }, 

    destination: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
})

export default Trips;