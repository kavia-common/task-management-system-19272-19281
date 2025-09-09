'use strict';

const tasksService = require('../services/tasks');

class TasksController {
  /**
   * PUBLIC_INTERFACE
   * Create a new task for the authenticated user.
   */
  create(req, res) {
    /** Create a new task for the authenticated user. */
    try {
      const task = tasksService.createTask(req.user.id, req.body || {});
      return res.status(201).json({ task });
    } catch (err) {
      const status = err.status || 400;
      return res.status(status).json({ message: err.message || 'Failed to create task' });
    }
  }

  /**
   * PUBLIC_INTERFACE
   * List tasks for the authenticated user.
   */
  list(req, res) {
    /** List tasks for the authenticated user. */
    const tasks = tasksService.listTasks(req.user.id);
    return res.status(200).json({ tasks });
  }

  /**
   * PUBLIC_INTERFACE
   * Get a single task by ID for the authenticated user.
   */
  get(req, res) {
    /** Get a single task by ID for the authenticated user. */
    const { id } = req.params;
    const task = tasksService.getTask(req.user.id, id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    return res.status(200).json({ task });
  }

  /**
   * PUBLIC_INTERFACE
   * Update a task for the authenticated user.
   */
  update(req, res) {
    /** Update a task for the authenticated user. */
    const { id } = req.params;
    try {
      const updated = tasksService.updateTask(req.user.id, id, req.body || {});
      if (!updated) {
        return res.status(404).json({ message: 'Task not found' });
      }
      return res.status(200).json({ task: updated });
    } catch (err) {
      const status = err.status || 400;
      return res.status(status).json({ message: err.message || 'Failed to update task' });
    }
  }

  /**
   * PUBLIC_INTERFACE
   * Delete a task for the authenticated user.
   */
  delete(req, res) {
    /** Delete a task for the authenticated user. */
    const { id } = req.params;
    const ok = tasksService.deleteTask(req.user.id, id);
    if (!ok) {
      return res.status(404).json({ message: 'Task not found' });
    }
    return res.status(204).send();
  }
}

module.exports = new TasksController();
