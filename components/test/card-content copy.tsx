import React from "react";
import { Text, View } from "react-native";

type Props = {
    html: string;
};

type MarkType = "bold" | "italic" | "underline" | "strike";

type node = {
    type: string;
    content?: node[];
    text?: string;
    marks?: { type: MarkType }[];
};

const markStyles: Record<MarkType, any> = {
    bold: { fontWeight: "bold" },
    italic: { fontStyle: "italic" },
    underline: { textDecorationLine: "underline" },
    strike: { textDecorationLine: "line-through" },
};

function renderTextNode(node: any, key: number) {
    let style: any = {};

    if (node.marks) {
        node.marks.forEach((mark: any) => {
            if (markStyles[mark.type as MarkType]) {
                style = { ...style, ...markStyles[mark.type as MarkType] };
            }
        });
    }

    return (
        <Text key={key} style={style}>
            {node.text}
        </Text>
    );
}

function renderParagraph(node: any, key: number) {
    return (
        <Text key={key} style={{ marginBottom: 8, color: "#eee" }}>
            {node.content?.map((child: any, index: number) =>
                child.type === "text" ? renderTextNode(child, index) : null,
            )}
        </Text>
    );
}

export function renderTiptap(json: any) {
    return json.content.map((node: any, index: number) => {
        switch (node.type) {
            case "paragraph":
                return renderParagraph(node, index);
            default:
                return null;
        }
    });
}

export default function TiptapRenderer({ json }: { json: any }) {
    return <View style={{ padding: 0, }}>{renderTiptap(json)}</View>;
}
