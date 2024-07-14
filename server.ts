import express from 'express';
import { Routes } from './routes';
import { redisConnect } from './shared/connections';
import cors from 'cors'

export const app = express();
const PORT = 3000

app.listen(PORT, async() => {
  console.log(`Servidor rodando na porta http://localhost:${PORT}`);
})
app.use(cors({
  allowedHeaders:['X-Requested-With','content-type'],
  methods: [ 'GET', 'POST', 'OPTIONS', 'PUT', 'PATCH', 'DELETE'],
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(
  express.json()
);


redisConnect()
Routes();