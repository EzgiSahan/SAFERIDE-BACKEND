import dotenv from 'dotenv';

import {Sequelize} from 'sequelize';
dotenv.config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_USER_PASSWORD,{
    host: 'localhost',
    dialect: 'postgres'
});

export default sequelize;