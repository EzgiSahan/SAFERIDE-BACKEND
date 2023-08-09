import pg from 'pg';
// const {Pool} = pg;
import {Sequelize} from 'sequelize';


// let localPoolConfig = {
//     user: 'postgres',
//     password: 'kkmobil',
//     host: 'localhost',
//     port: '5432',
//     database: 'safeRide'
// };

const sequelize = new Sequelize('Internship', 'postgres', 'kkmobil', {
    host: 'localhost',
    dialect: 'postgres'
});
// const poolConfig = process.env.DATABASE_URL ? {
//     connectionString:process.env.DATABASE_URL,
//     ssl:{rejectUnauthorized: false }
// } : localPoolConfig;

// const pool = new Pool(poolConfig);
export default sequelize;