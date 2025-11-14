/**
 * @summary
 * Internal (authenticated) API routes configuration
 *
 * @module routes/v1/internalRoutes
 *
 * @description
 * Defines authenticated API endpoints that require valid user session
 */

import { Router } from 'express';
import * as noteController from '@/api/v1/internal/note/controller';

const router = Router();

// Note routes
router.post('/note', noteController.postHandler);

export default router;
