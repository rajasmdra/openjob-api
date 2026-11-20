/* eslint-disable linebreak-style */
import 'dotenv/config';

import express from 'express';
import routes from '../routes/index.js';
import cors from 'cors';
import ErrorHandler from '../middlewares/error.js';

const app = express();
app.use('/documents', express.static('src/services/documents/files/documents'));
app.use(cors());
app.use(express.json());
app.use(routes);
app.use(ErrorHandler);

export default app;