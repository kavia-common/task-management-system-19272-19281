'use strict';

const jwt = require('jsonwebtoken');
const db = require('../services/db');

/**
 * PUBLIC_INTERFACE
 * Express middleware to authenticate requests using Bearer JWT token.
 * Sets req.user to the user object if valid.
 */
function authMiddleware(req, res, next) {
  /** Express middleware to authenticate requests using Bearer JWT token. */
  try {
    const header = req.headers.authorization || '';
    const [scheme, token] = header.split(' ');
    if (scheme !== 'Bearer' || !token) {
      return res.status(401).json({ message: 'Missing or invalid Authorization header' });
    }
    const secret = process.env.JWT_SECRET || 'dev_secret_change_me';
    const payload = jwt.verify(token, secret);
    const user = db.getUserById(payload.sub);
    if (!user) {
      return res.status(401).json({ message: 'Invalid token user' });
    }
    req.user = { id: user.id, email: user.email, name: user.name };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
}

module.exports = authMiddleware;
