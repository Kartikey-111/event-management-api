import express from 'express';
import {
  createEventHandler,
  getEventDetails,
  registerHandler,
  cancelHandler,
  getUpcoming,
  statsHandler,
} from '../controllers/eventController.js';

const router = express.Router();

router.post('/', createEventHandler);
router.get('/upcoming', getUpcoming);
router.get('/stats/:id', statsHandler);
router.get('/:id', getEventDetails);
router.post('/:id/register', registerHandler);
router.delete('/:id/cancel', cancelHandler);

export default router;