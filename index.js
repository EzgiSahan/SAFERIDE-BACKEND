import express, { json } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import userRouter from './routes/users-routes.js';
import authRouter from './routes/auth-routes.js';
import busRouter from './routes/bus-routes.js';
import busDriverRouter from './routes/busDriver-routes.js';
import childrenRouter from './routes/children-routes.js';
import companyRouter from './routes/company-routes.js';
import tripsRouter from './routes/trips-routes.js';
import verificationRouter from './routes/verification-routes.js'
import sequelize from './db.js';
  

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express(); 
const PORT = process.env.PORT || 8000;
const corsOptions = {credentails: true ,origin: process.env.URL || '*'};

app.use(cors(corsOptions));
app.use(json());
app.use(cookieParser());

async function syncDatabase() {
    try {
      await sequelize.sync(); // Passing will drop existing tables
      console.log('Database synchronized.');
    } catch (error) {
      console.error('Error synchronizing database:', error);
    }
}
  
syncDatabase();

app.use('/',express.static(join(__dirname,'public')));
app.use('/api/auth',authRouter);
app.use('/api/users',userRouter);
app.use('/api/bus', busRouter);
app.use('/api/busDriver', busDriverRouter);
app.use('/api/children', childrenRouter);
app.use('/api/company', companyRouter);
app.use('/api/trips', tripsRouter);
app.use('/api/verification', verificationRouter)

app.listen(PORT,()=>console.log(`Server is listening http://localhost:${PORT}`));