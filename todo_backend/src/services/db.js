'use strict';

/**
 * Simple in-memory data layer to store users and tasks.
 * This is designed for easy replacement with a persistent DB later.
 */
const { randomUUID } = require('crypto');

class InMemoryDB {
  constructor() {
    this.users = new Map(); // key: userId, value: user object
    this.usersByEmail = new Map(); // key: email, value: userId
    this.tasks = new Map(); // key: taskId, value: task object
    this.tasksByUser = new Map(); // key: userId, value: Set(taskId)
  }

  // User operations
  createUser({ email, passwordHash, name }) {
    if (this.usersByEmail.has(email)) {
      const err = new Error('Email already registered');
      err.code = 'USER_EXISTS';
      throw err;
    }
    const id = randomUUID();
    const user = {
      id,
      email,
      passwordHash,
      name: name || email.split('@')[0],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.users.set(id, user);
    this.usersByEmail.set(email, id);
    return { ...user };
  }

  getUserByEmail(email) {
    const id = this.usersByEmail.get(email);
    if (!id) return null;
    return this.users.get(id) || null;
  }

  getUserById(id) {
    return this.users.get(id) || null;
  }

  // Task operations
  createTask({ userId, title, description = '', dueDate = null, completed = false }) {
    const id = randomUUID();
    const now = new Date().toISOString();
    const task = {
      id,
      userId,
      title,
      description,
      dueDate,
      completed,
      createdAt: now,
      updatedAt: now,
    };
    this.tasks.set(id, task);
    if (!this.tasksByUser.has(userId)) {
      this.tasksByUser.set(userId, new Set());
    }
    this.tasksByUser.get(userId).add(id);
    return { ...task };
  }

  listTasks(userId) {
    const set = this.tasksByUser.get(userId);
    if (!set) return [];
    const tasks = [];
    for (const taskId of set.values()) {
      const t = this.tasks.get(taskId);
      if (t) tasks.push({ ...t });
    }
    // Sort by createdAt desc for convenience
    return tasks.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  }

  getTask(userId, taskId) {
    const task = this.tasks.get(taskId);
    if (!task || task.userId !== userId) return null;
    return { ...task };
  }

  updateTask(userId, taskId, updates) {
    const existing = this.tasks.get(taskId);
    if (!existing || existing.userId !== userId) return null;
    const updated = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.tasks.set(taskId, updated);
    return { ...updated };
  }

  deleteTask(userId, taskId) {
    const existing = this.tasks.get(taskId);
    if (!existing || existing.userId !== userId) return false;
    this.tasks.delete(taskId);
    const set = this.tasksByUser.get(userId);
    if (set) set.delete(taskId);
    return true;
  }
}

module.exports = new InMemoryDB();
