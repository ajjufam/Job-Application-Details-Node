/**
 * @swagger
 * /users/update-password:
 *   put:
 *     summary: Update user password
 *     description: Allows a user to update their password.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               oldPassword:
 *                 type: string
 *                 example: "OldPassword123!"
 *               newPassword:
 *                 type: string
 *                 example: "NewPassword456!"
 *               confirmPassword:
 *                 type: string
 *                 example: "NewPassword456!"
 *     responses:
 *       200:
 *         description: Password updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Password updated successfully"
 *       400:
 *         description: Bad request (validation error)
 *       500:
 *         description: Internal server error
 */
