'use strict';

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('./db');

const DEFAULT_JWT_EXPIRES_IN = '2h';

/**
 * PUBLIC_INTERFACE
 * Generate a signed JWT for a user.
 * @param {object} user - User object (id, email, name)
 * @returns {string} JWT token
 */
function generateToken(user) {
  /** Generate a signed JWT for a user. */
  const payload = {
    sub: user.id,
    email: user.email,
    name: user.name,
  };
  const secret = process.env.JWT_SECRET || 'dev_secret_change_me';
  const expiresIn = process.env.JWT_EXPIRES_IN || DEFAULT_JWT_EXPIRES_IN;
  return jwt.sign(payload, secret, { expiresIn });
}

/**
 * PUBLIC_INTERFACE
 * Register a new user with email and password.
 * @param {string} email
 * @param {string} password
 * @param {string} [name]
 * @returns {{user: object, token: string}}
 */
function register(email, password, name) {
  /** Register a new user with email and password. */
  if (!email || !password) {
    const err = new Error('Email and password are required');
    err.status = 400;
    throw err;
  }
  const existing = db.getUserByEmail(email);
  if (existing) {
    const err = new Error('Email already registered');
    err.status = 409;
    throw err;
  }
  const passwordHash = bcrypt.hashSync(password, 10);
  const user = db.createUser({ email, passwordHash, name });
  const token = generateToken(user);
  return { user: sanitizeUser(user), token };
}

/**
 * PUBLIC_INTERFACE
 * Login a user with email and password.
 * @param {string} email
 * @param {string} password
 * @returns {{user: object, token: string}}
 */
function login(email, password) {
  /** Login a user with email and password. */
  const user = db.getUserByEmail(email);
  if (!user) {
    const err = new Error('Invalid email or password');
    err.status = 401;
    throw err;
  }
  const ok = bcrypt.compareSync(password, user.passwordHash);
  if (!ok) {
    const err = new Error('Invalid email or password');
    err.status = 401;
    throw err;
  }
  const token = generateToken(user);
  return { user: sanitizeUser(user), token };
}

/**
 * Remove sensitive fields from user object.
 */
function sanitizeUser(user) {
  const { passwordHash, ...safe } = user;
  return safe;
}

module.exports = {
  register,
  login,
  generateToken,
  sanitizeUser,
};
