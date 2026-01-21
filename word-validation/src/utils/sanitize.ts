import DOMPurify from "isomorphic-dompurify";

export function cleanContent(content: string): string {
	const cleanedContent = DOMPurify.sanitize(content);
	return cleanedContent;
}
