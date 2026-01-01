import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import ConnectDB from './config/database.js'
import authRouter from './routes/AuthRoutes.js'
import userRouter from './routes/userRoutes.js'

dotenv.config();

const app = express();
const Port = process.env.PORT || 4000;
ConnectDB();
const allowedOrigins = ['http://localhost:5173']

app.use(express.json());
app.use(cookieParser());
app.use(cors({origin : allowedOrigins,  credentials : true}))

//api EndPoints
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);

app.get("/", (req, res) => {
    res.send("heyy");
})

app.listen(Port , () => {
    console.log(`Server Running on ${Port}`);
})