'use strict';

const db = require('./db');

/**
 * PUBLIC_INTERFACE
 * Create a task for a specific user.
 * @param {string} userId
 * @param {{title: string, description?: string, dueDate?: string|null, completed?: boolean}} data
 * @returns {object} Task
 */
function createTask(userId, data) {
  /** Create a task for a specific user. */
  if (!data || !data.title || typeof data.title !== 'string') {
    const err = new Error('Task title is required');
    err.status = 400;
    throw err;
  }
  return db.createTask({
    userId,
    title: data.title.trim(),
    description: data.description || '',
    dueDate: data.dueDate || null,
    completed: !!data.completed,
  });
}

/**
 * PUBLIC_INTERFACE
 * List tasks for a user.
 * @param {string} userId
 * @returns {object[]} tasks
 */
function listTasks(userId) {
  /** List tasks for a user. */
  return db.listTasks(userId);
}

/**
 * PUBLIC_INTERFACE
 * Get a task by ID for a user.
 * @param {string} userId
 * @param {string} taskId
 * @returns {object|null}
 */
function getTask(userId, taskId) {
  /** Get a task by ID for a user. */
  return db.getTask(userId, taskId);
}

/**
 * PUBLIC_INTERFACE
 * Update a task for a user.
 * @param {string} userId
 * @param {string} taskId
 * @param {object} updates
 * @returns {object|null}
 */
function updateTask(userId, taskId, updates) {
  /** Update a task for a user. */
  if (updates && updates.title && typeof updates.title !== 'string') {
    const err = new Error('Invalid title');
    err.status = 400;
    throw err;
  }
  return db.updateTask(userId, taskId, updates);
}

/**
 * PUBLIC_INTERFACE
 * Delete a task for a user.
 * @param {string} userId
 * @param {string} taskId
 * @returns {boolean}
 */
function deleteTask(userId, taskId) {
  /** Delete a task for a user. */
  return db.deleteTask(userId, taskId);
}

module.exports = {
  createTask,
  listTasks,
  getTask,
  updateTask,
  deleteTask,
};
