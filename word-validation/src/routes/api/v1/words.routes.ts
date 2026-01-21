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

export default router;
