import { Router } from "express";
import { z } from "zod";
import { validate } from "../../../middleware/validate";
import asyncHandler from "utils/asyncHandler";
import { findWord } from "controllers/words.controller";

const router = Router();

const wordParamSchema = {
	params: z.object({
		word: z.string()
	})
}

router.post("/:word", validate({ ...wordParamSchema }), asyncHandler(findWord));

/**
 * @swagger
 * /api/v1/words/{word}:
 *   post:
 *     summary: Validate a word
 *     description: Checks if a word exists in the dictionary.
 *     parameters:
 *       - in: path
 *         name: word
 *         schema:
 *           type: string
 *         required: true
 *         description: The word to validate.
 *     responses:
 *       200:
 *         description: Word is valid.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Word is valid.
 *       404:
 *         description: Word is not valid.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Word not found.
 *       400:
 *         description: Invalid input.
 */

export default router;
