import { DataTypes } from 'sequelize';
import sequelize from '../db.js';
import { v4 as uuidv4 } from 'uuid';
import Trips from './Trips.js';
import User from './User.js';
import Children from './Children.js';

const Transactions = sequelize.define('transactions', {
    id: {
        type: DataTypes.UUID, // Use UUID data type
        defaultValue: () => uuidv4(), // Generate UUID automatically
        primaryKey: true,
    },
    type:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    issuedAt: {
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
Transactions.belongsTo(Trips, { foreignKey: 'tripId', onDelete: 'CASCADE' });
Transactions.belongsTo(Children, { foreignKey: 'childId', onDelete: 'CASCADE' });
Transactions.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });



export default Transactions;