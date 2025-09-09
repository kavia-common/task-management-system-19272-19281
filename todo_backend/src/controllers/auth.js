'use strict';

const authService = require('../services/auth');

class AuthController {
  /**
   * PUBLIC_INTERFACE
   * Register a new user.
   * Body: { email: string, password: string, name?: string }
   * Returns: { user, token }
   */
  register(req, res) {
    /** Register a new user. */
    try {
      const { email, password, name } = req.body || {};
      const result = authService.register(email, password, name);
      return res.status(201).json(result);
    } catch (err) {
      const status = err.status || 400;
      return res.status(status).json({ message: err.message || 'Registration failed' });
    }
  }

  /**
   * PUBLIC_INTERFACE
   * Login a user.
   * Body: { email: string, password: string }
   * Returns: { user, token }
   */
  login(req, res) {
    /** Login a user. */
    try {
      const { email, password } = req.body || {};
      const result = authService.login(email, password);
      return res.status(200).json(result);
    } catch (err) {
      const status = err.status || 401;
      return res.status(status).json({ message: err.message || 'Login failed' });
    }
  }

  /**
   * PUBLIC_INTERFACE
   * Get the current authenticated user's profile.
   * Returns: { id, email, name }
   */
  me(req, res) {
    /** Get the current authenticated user's profile. */
    return res.status(200).json({ user: req.user });
  }
}

module.exports = new AuthController();
