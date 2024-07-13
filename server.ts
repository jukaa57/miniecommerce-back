import express from 'express';
import { Routes } from './routes';
import { redisConnect } from './shared/connections';

export const app = express();
const PORT = 3000

app.listen(PORT, async() => {
  console.log(`Servidor rodando na porta http://localhost:${PORT}`);
})

app.use(function(req, res, next) {
  express.json()
   // Website you wish to allow to connect
   res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');

   // Request methods you wish to allow
   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

   // Request headers you wish to allow
   res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

   // Set to true if you need the website to include cookies in the requests sent
   // to the API (e.g. in case you use sessions)
   res.setHeader('Access-Control-Allow-Credentials', 'true');

   // Pass to next layer of middleware
   next();
});


redisConnect()
Routes();