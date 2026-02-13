import prisma from '../config/db.js';
import { logActivity } from '../services/activity.service.js';
import logger from '../config/logger.js';

export const createTask = async (req, res) => {
  try {
    const { title, description, status } = req.body;
    const userId = req.user.userId;

    const task = await prisma.task.create({
      data: {
        title,
        description,
        status: status || 'pending',
        userId
      }
    });

    await logActivity('task_created', `Task "${title}" created`, userId);

    res.status(201).json(task);
  } catch (error) {
    logger.error(`Create task error: ${error.message}`);
    throw error;
  }
};

export const getTasks = async (req, res) => {
  try {
    const userId = req.user.userId;

    const tasks = await prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    res.json(tasks);
  } catch (error) {
    logger.error(`Get tasks error: ${error.message}`);
    throw error;
  }
};

export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const updates = req.body;

    const task = await prisma.task.updateMany({
      where: { id, userId },
      data: updates
    });

    if (task.count === 0) {
      return res.status(404).json({ message: 'Task not found or not authorized' });
    }

    await logActivity('task_updated', `Task ${id} updated`, userId);

    res.json({ message: 'Task updated successfully' });
  } catch (error) {
    logger.error(`Update task error: ${error.message}`);
    throw error;
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const task = await prisma.task.deleteMany({
      where: { id, userId }
    });

    if (task.count === 0) {
      return res.status(404).json({ message: 'Task not found or not authorized' });
    }

    await logActivity('task_deleted', `Task ${id} deleted`, userId);

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    logger.error(`Delete task error: ${error.message}`);
    throw error;
  }
};
