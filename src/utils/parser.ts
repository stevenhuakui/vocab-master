import type { WordItem } from '../types';

export const parseVocabulary = (text: string): WordItem[] => {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    const words: WordItem[] = [];

    let currentWord: Partial<WordItem> | null = null;

    // Regex to identify "ID Word" pattern, e.g., "1 abandon" or "100 zoology"
    // Relaxed regex:
    // Starts with number, space, word.
    // Optional: space, bracket stuff.
    const headerRegex = /^(\d+)\s+([a-zA-Z\-\s]+)(?:\[.*)?$/;

    for (const line of lines) {
        const headerMatch = line.match(headerRegex);

        if (headerMatch) {
            // Check heuristic: if word part is too long (e.g. > 5 words), it might be a numbered sentence
            const potentialWord = headerMatch[2].trim();
            if (potentialWord.split(' ').length > 4) {
                // Likely NOT a header, but a sentence like "1. This is a sentence."
                // Add to previous word's examples if exists
                if (currentWord) {
                    currentWord.examples?.push(line);
                }
                continue;
            }

            // Valid header found
            if (currentWord && currentWord.id && currentWord.word) {
                words.push(currentWord as WordItem);
            }

            const id = parseInt(headerMatch[1], 10);
            let wordRaw = potentialWord;

            let pronunciation = undefined;
            // Extract pronunciation if present in [ ]
            if (line.includes('[')) {
                const start = line.indexOf('[');
                // If close bracket exists
                const end = line.lastIndexOf(']');
                if (end > start) {
                    pronunciation = line.substring(start, end + 1);
                } else {
                    // Unclosed bracket, take rest of line
                    pronunciation = line.substring(start);
                }
            }

            currentWord = {
                id,
                word: wordRaw,
                pronunciation,
                meanings: [],
                examples: [],
                deformations: []
            };

            continue;
        }

        if (!currentWord) continue;

        // Helper regexes
        const isDeformation = /^(第三人称|过去式|现在分词|过去分词|复数|原型|变形)/.test(line);
        const isPhrase = /^(词组|be able to|add (in|on|up))/.test(line);

        if (line === '例句') continue;

        if (isDeformation || line.startsWith('变形')) {
            currentWord.deformations?.push(line);
        } else if (isPhrase || line.startsWith('词组')) {
            currentWord.deformations?.push(line);
        } else {
            // Improved Meaning Detection
            // Matches: "n.", "n:", "n", "vt", "adj" at start
            // And generally followed by Chinese or standard separators.
            // Also handling lines like "n放弃..." (no punctuation)
            const posRegex = /^(n|v|adj|adv|prep|conj|vi|vt|pron|num|art|int)\.?[.:]?\s*([\u4e00-\u9fa5]|.*)/i;
            const startsWithPOS = posRegex.test(line);

            // Also catch lines that have mostly Chinese characters?
            // Or specific pattern like "(1) ... (2) ..."

            if (startsWithPOS) {
                currentWord.meanings?.push(line);
            } else if (/^[(（]\d+[)）]/.test(line) && /[\u4e00-\u9fa5]/.test(line)) {
                // (1) 能够 ... -> Meaning
                currentWord.meanings?.push(line);
            } else {
                // Default to example
                currentWord.examples?.push(line);
            }
        }
    }

    // Push last word
    if (currentWord && currentWord.id && currentWord.word) {
        words.push(currentWord as WordItem);
    }

    return words;
};
