import { DataTypes } from 'sequelize';
import sequelize from '../db.js';
import { v4 as uuidv4 } from 'uuid';
import User from './User.js';

const Children = sequelize.define('Children', {
    id: {
        type: DataTypes.UUID,
        defaultValue: () => uuidv4(), 
        primaryKey: true,
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false,
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

Children.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });

export default Children;
