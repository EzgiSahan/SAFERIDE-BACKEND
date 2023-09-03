import { DataTypes } from 'sequelize';
import sequelize from '../db.js';
import { v4 as uuidv4 } from 'uuid';

const Company = sequelize.define('Company', {
    id: {
        type: DataTypes.UUID, // Use UUID data type
        defaultValue: () => uuidv4(), // Generate UUID automatically
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    joinedDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
    },  
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
        unique:true
    },
    country: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    city: {
        type: DataTypes.STRING,
        allowNull: false,
    },  
    address: {
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

export default Company;