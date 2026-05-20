const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const { validateInput, schemas } = require("../middleware/validation");

/**
 * @swagger
 * /api/v1/auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string, example: "John Doe" }
 *               email: { type: string, example: "john@example.com" }
 *               password: { type: string, example: "SecurePass@123" }
 *     responses:
 *       201: { description: "User registered successfully" }
 *       400: { description: "Validation error" }
 */
router.post("/signup", validateInput(schemas.register), userController.signup);

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: { type: string, example: "john@example.com" }
 *               password: { type: string, example: "SecurePass@123" }
 *     responses:
 *       200: { description: "Login successful" }
 *       401: { description: "Invalid credentials" }
 */
router.post("/login", validateInput(schemas.login), userController.login);

module.exports = router;
