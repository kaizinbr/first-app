// lib/util/truncateMarkdown.ts

export function truncateMarkdown(text: string, maxChars: number): string {
    if (text.length <= maxChars) return text;

    // Corta no limite máximo
    let truncated = text.slice(0, maxChars);

    // Garante que não corta no meio de uma sintaxe markdown
    // Remove qualquer marcação incompleta no final
    const incompletePatterns = [
        /\*+$/, // asteriscos soltos no final
        /_+$/,  // underscores soltos
        /~+$/,  // tils soltos
        /`+$/,  // backticks soltos
        /#+ ?$/, // títulos sem conteúdo
        /> ?$/, // blockquote vazio
    ];

    for (const pattern of incompletePatterns) {
        truncated = truncated.replace(pattern, "");
    }

    // Não corta no meio de uma palavra — volta até o último espaço
    const lastSpace = truncated.lastIndexOf(" ");
    if (lastSpace > maxChars * 0.8) {
        truncated = truncated.slice(0, lastSpace);
    }

    // Não corta no meio de uma linha de bloco (título, blockquote)
    // Remove a última linha se ela começar com # ou >
    const lines = truncated.split("\n");
    const lastLine = lines[lines.length - 1];
    if (/^(#{1,6}|>)/.test(lastLine)) {
        lines.pop();
        truncated = lines.join("\n");
    }

    return truncated.trimEnd() + "…";
}