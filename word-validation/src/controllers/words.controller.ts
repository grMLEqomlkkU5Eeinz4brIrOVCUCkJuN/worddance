import { trieService } from "service/trie";
import { Request, Response } from "express";
import { cleanContent } from "utils/sanitize";

export const findWord = (req: Request, res: Response): void => {
	const sanitizedWord = cleanContent(req.params.word as string);
	const wordValidResult = trieService.isValid(sanitizedWord);
	res.json({
		isValid: wordValidResult
	});
}
