'worklet';
import type { MarkdownRange } from "@expensify/react-native-live-markdown";

export function parseMarkdown(input: string): MarkdownRange[] {
    'worklet';
    const ranges: MarkdownRange[] = [];

    // Bold **texto**
    const boldRegex = /\*\*(.*?)\*\*/gs;
    let match;
    boldRegex.lastIndex = 0;
    while ((match = boldRegex.exec(input)) !== null) {
        // marcador de abertura **
        ranges.push({ start: match.index, length: 2, type: "syntax" });
        // conteúdo em negrito
        ranges.push({ start: match.index + 2, length: match[1].length, type: "bold" });
        // marcador de fechamento **
        ranges.push({ start: match.index + 2 + match[1].length, length: 2, type: "syntax" });
    }


    // Strikethrough ~~texto~~
    const strikeRegex = /~~(.*?)~~/gs;
    strikeRegex.lastIndex = 0;
    while ((match = strikeRegex.exec(input)) !== null) {
        ranges.push({ start: match.index, length: 2, type: "syntax" });
        ranges.push({ start: match.index + 2, length: match[1].length, type: "strikethrough" });
        ranges.push({ start: match.index + 2 + match[1].length, length: 2, type: "syntax" });
    }

    // Underline `texto`
    const underlineRegex = /&(.*?)&/gs;
    underlineRegex.lastIndex = 0;
    while ((match = underlineRegex.exec(input)) !== null) {
        ranges.push({ start: match.index, length: 2, type: "syntax" });
        // mapeia pra mention-user e estiliza como underline no markdownStyle
        ranges.push({ start: match.index + 2, length: match[1].length, type: "code" });
        ranges.push({ start: match.index + 2 + match[1].length, length: 2, type: "syntax" });
    }

    // Italic _texto_
    const italicRegex = /_(.*?)_/gs;
    italicRegex.lastIndex = 0;
    while ((match = italicRegex.exec(input)) !== null) {
        ranges.push({ start: match.index, length: 1, type: "syntax" });
        ranges.push({ start: match.index + 1, length: match[1].length, type: "italic" });
        ranges.push({ start: match.index + 1 + match[1].length, length: 1, type: "syntax" });
    }
    return ranges.sort((a, b) => a.start - b.start);
}