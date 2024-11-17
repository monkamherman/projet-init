// src/server.ts
// Configurations de Middlewares
import express from 'express';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { setupSwagger } from './swagger';
import morgan from 'morgan';
import winston, { log } from 'winston';
import { ONE_HUNDRED, SIXTY } from './core/constants';
import { logger } from 'env-var';


// Créer un stream pour Morgan avec niveau HTTP spécifique
const morganStream = {
	write: (message: string) => {
		logger('http', message.trim()); // Utilise le format correct pour le logger
	}
};

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(
	rateLimit({
		max: ONE_HUNDRED,
		windowMs: SIXTY,
		message: 'Trop de Requete à partir de cette adresse IP '
	})
);

app.use(morgan('combined', {
	stream: morganStream
}));
setupSwagger(app);
export default app;
