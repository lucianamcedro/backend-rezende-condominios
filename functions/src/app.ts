import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { initializeApp } from './config/firebaseConfig';
import { routes } from './routes/routes';


const app = express();
app.use(bodyParser.json());
app.use(cors({ origin: '*' }));

initializeApp(); 

app.use('/api', routes); 

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

export default app;
