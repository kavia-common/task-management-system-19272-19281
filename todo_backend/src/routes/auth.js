'use strict';

const express = require('express');
const authController = require('../controllers/auth');
const auth = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: User authentication
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Create a user account with email and password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered
 *       400:
 *         description: Invalid input
 *       409:
 *         description: Email already registered
 */
router.post('/register', (req, res) => authController.register(req, res));

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login
 *     description: Authenticate user and return JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login success
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', (req, res) => authController.login(req, res));

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get current user
 *     description: Returns profile of authenticated user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile
 *       401:
 *         description: Unauthorized
 */
router.get('/me', auth, (req, res) => authController.me(req, res));

module.exports = router;
