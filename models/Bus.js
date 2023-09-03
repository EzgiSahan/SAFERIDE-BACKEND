import { DataTypes } from 'sequelize';
import sequelize from '../db.js';
import { v4 as uuidv4 } from 'uuid';
import Company from './Company.js';
import BusDriver from './BusDriver.js';

const Bus = sequelize.define('Bus', {
    id: {
        type: DataTypes.UUID,
        defaultValue: () => uuidv4(),
        primaryKey: true,
    },
    model: {
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

Bus.belongsTo(Company, { foreignKey: 'companyId', onDelete: 'CASCADE' });
Bus.belongsTo(BusDriver, { foreignKey: 'busDriverId', onDelete: 'CASCADE' });

export default Bus;