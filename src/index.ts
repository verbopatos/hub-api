// index.ts
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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
