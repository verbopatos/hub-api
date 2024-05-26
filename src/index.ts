import express from 'express';
import dotenv from 'dotenv';
import eventRoutes from './routes/eventRoutes';
import eventTypeRoutes from './routes/eventTypeRoutes';
import setupSwagger from './swagger';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/api', eventRoutes);
app.use('/api', eventTypeRoutes);

// Setup Swagger
setupSwagger(app);

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
