import express from 'express';
import { createTask, getTasks, updateTask, deleteTask } from '../controllers/task.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { apiLimiter } from '../middleware/rateLimit.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { createTaskSchema, updateTaskSchema } from '../middleware/validate.middleware.js';

const router = express.Router();

// All task routes require authentication
router.use(authenticate);
router.use(apiLimiter);

// POST /api/tasks
router.post('/', validate(createTaskSchema), createTask);

// GET /api/tasks
router.get('/', getTasks);

// PATCH /api/tasks/:id
router.patch('/:id', validate(updateTaskSchema), updateTask);

// DELETE /api/tasks/:id
router.delete('/:id', deleteTask);

export default router;
