// index.ts
import express from 'express';
import dotenv from 'dotenv';
import eventRoutes from './routes/eventRoutes';
import eventTypeRoutes from './routes/eventTypeRoutes';
import setupSwagger from './swagger';

dotenv.config();

const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Route setup
app.use('/api', eventRoutes);
app.use('/api', eventTypeRoutes);

// Setup Swagger
setupSwagger(app);

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  if (err instanceof SyntaxError && 'body' in err) {
    return res.status(400).send({ message: 'Invalid JSON payload' });
  }
  res.status(500).send('Something broke!');
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port ${port}`);
});
