import express from 'express';

import {
    volunteerIdValidation,
    processVolunteer,
    processRemoveVolunteer
} from '../controllers/volunteers.js';

import { requireLogin } from '../middleware/authMiddleware.js';

const router = express.Router();

/*
 * Add volunteer
 */
router.post(
    '/projects/:id/volunteer',
    requireLogin,
    volunteerIdValidation,
    processVolunteer
);

/*
 * Remove volunteer
 */
router.post(
    '/projects/:id/remove-volunteer',
    requireLogin,
    volunteerIdValidation,
    processRemoveVolunteer
);

export default router;