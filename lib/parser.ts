'worklet';
import type { MarkdownRange } from "@expensify/react-native-live-markdown";

export function parseMarkdown(input: string): MarkdownRange[] {
    'worklet';
    const ranges: MarkdownRange[] = [];

    const patterns: { regex: RegExp; type: string }[] = [
        { regex: /\*\*(.*?)\*\*/gs, type: "bold" },
        { regex: /_(.*?)_/gs, type: "italic" },
        { regex: /~~(.*?)~~/gs, type: "strikethrough" },
        { regex: /^#{1} .+/gm, type: "h1" },
        { regex: /^#{2} .+/gm, type: "h2" },
        { regex: /^> .+/gm, type: "blockquote" },
        // Citação musical: >>texto<< 
        { regex: /^>> .+/gm, type: "mention-here" }, // tipo customizado via mention-here
    ];

    for (const { regex, type } of patterns) {
        let match;
        regex.lastIndex = 0;
        while ((match = regex.exec(input)) !== null) {
            ranges.push({
                start: match.index,
                length: match[0].length,
                type: type as any,
            });
        }
    }

    return ranges.sort((a, b) => a.start - b.start);
}