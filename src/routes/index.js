/* eslint-disable linebreak-style */
import { Router } from 'express';
import users from '../services/users/index.js';
import companies from '../services/companies/index.js';
import categories from '../services/categories/index.js';
import jobs from '../services/jobs/index.js';
import applications from '../services/applications/index.js';
import bookmarks from '../services/bookmarks/index.js';
import profiles from '../services/profiles/index.js';
import authentications from '../services/authentications/index.js';
import documents from '../services/documents/index.js';

const routes = Router();

routes.use('/', users);
routes.use('/', companies);
routes.use('/', categories);
routes.use('/', jobs);
routes.use('/', applications);
routes.use('/', bookmarks);
routes.use('/', profiles);
routes.use('/', authentications);
routes.use('/', documents);

export default routes;