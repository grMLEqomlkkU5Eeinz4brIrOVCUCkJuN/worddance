import Seshat from "seshat-trie";
import logger from "utils/logger";

class TrieService {
	private trie: Seshat;

	constructor() {
		this.trie = new Seshat();
	}

	async init() {
		logger.info("Trie initiated.");
		const bufferSize = 16 * 1024 * 1024;
		const filepath = "./data/words.txt";
		this.trie.insertFromFile(filepath, bufferSize);
		logger.info("Trie insertion complete");
	}

	public isValid(word: string): boolean {
		logger.info(`Item Searched: ${word}`);
		return this.trie.search(word);
	}

	public clearTrie(): boolean {
		this.trie.clear();
		return this.trie.isEmpty();
	}
}

export const trieService = new TrieService();
