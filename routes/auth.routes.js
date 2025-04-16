const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controllers");
const { validateBody } = require("../middlewares/auth.middlewares");

/**
 * @openapi
 * /auth/register:
 *   post:
 *     description: Register
 *     requestBody:
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          email:
 *                              description: register email
 *                              type: string
 *                          password:
 *                              description: register email
 *                              type: string
 *     responses:
 *       201:
 *         description: Register successfully
 */

router.post("/register", validateBody, authController.register);
/**
 * @openapi
 * /auth/sign-in:
 *   post:
 *     description: User login to get JWT token
 *     requestBody:
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email
 *               password:
 *                 type: string
 *                 description: User's password
 *     responses:
 *       200:
 *         description: Successfully logged in and token generated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT Token for authentication
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Internal server error
 */
router.post("/sign-in", authController.signIn);


module.exports = router;
