import express from 'express';
import cors from 'cors';
import { generateResume } from './controllers/resume.controller';

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.post('/api/generate', generateResume);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API démarrée sur le port ${PORT}`));