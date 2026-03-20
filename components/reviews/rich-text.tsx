import React, { useCallback, useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    View,
    Pressable,
    Text,
} from "react-native";
import {
    MarkdownTextInput,
    parseExpensiMark,
} from "@expensify/react-native-live-markdown";
import { markdownStyle } from "@/components/reviews/markdown-style";
import { AlbumCard } from "@/components/home/album-section";
import { Album, Review, Palette } from "@/lib/types";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { parseMarkdown } from "@/lib/parser";

// Tipos
type MarkdownStyle = {
    bold?: boolean;
    italic?: boolean;
    strikethrough?: boolean;
    code?: boolean;
};

interface PostEditorProps {
    onChange?: (text: string) => void;
    initialValue?: string;
    placeholder?: string;
    minHeight?: number;

    reviewData: {
        reviewed: boolean;
        rating: Review | null;
        album: Album;
    };
    total: number;
}

// Botão da toolbar isolado pra evitar re-renders desnecessários
const ToolbarButton = React.memo(
    ({
        label,
        active,
        onPress,
        style,
    }: {
        label: string;
        active: boolean;
        onPress: () => void;
        style?: object;
    }) => (
        <Pressable
            style={[styles.button, active && styles.buttonActive]}
            onPress={onPress}
            hitSlop={8}
        >
            <Text
                style={[styles.buttonText, active && styles.textActive, style]}
            >
                {label}
            </Text>
        </Pressable>
    ),
);

export default function PostEditor({
    onChange,
    initialValue = "",
    placeholder = "O que você está pensando?",
    minHeight = 300,
    reviewData,
    total,
}: PostEditorProps) {

    const insets = useSafeAreaInsets();
    const [value, setValue] = useState(initialValue);
    const [selection, setSelection] = useState({ start: 0, end: 0 });

    const handleChange = useCallback(
        (text: string) => {
            setValue(text);
            onChange?.(text);
        },
        [onChange],
    );

    // Insere markdown na posição do cursor
    const wrapSelection = useCallback(
        (syntax: string) => {
            const before = value.slice(0, selection.start);
            const selected = value.slice(selection.start, selection.end);
            const after = value.slice(selection.end);

            const wrapped = `${syntax}${selected || "texto"}${syntax}`;
            const newValue = `${before}${wrapped}${after}`;

            setValue(newValue);
            onChange?.(newValue);
        },
        [value, selection, onChange],
    );

    const insertBlock = useCallback(
        (prefix: string) => {
            const before = value.slice(0, selection.start);
            const after = value.slice(selection.end);

            // Garante que começa numa linha nova
            const needsNewLine = before.length > 0 && !before.endsWith("\n");
            const newValue = `${before}${needsNewLine ? "\n" : ""}${prefix}${after}`;

            setValue(newValue);
            onChange?.(newValue);
        },
        [value, selection, onChange],
    );

    return (
        <KeyboardAvoidingView
            behavior={"padding"}
            keyboardVerticalOffset={insets.top + 50}
            style={styles.container}
        >
            <View style={[styles.editorContainer]}>
                <AlbumCard
                    image={reviewData.album.images[0].url}
                    value={
                        total ? `${Number(total).toFixed(1)}/100` : "0.0/100"
                    }
                    subtitle={reviewData.rating?.ratings.length || 0}
                    editor
                />
                <MarkdownTextInput
                    value={value}
                    parser={parseMarkdown}
                    onChangeText={handleChange}
                    onSelectionChange={(e) =>
                        setSelection(e.nativeEvent.selection)
                    }
                    placeholder={placeholder}
                    placeholderTextColor="#555"
                    multiline
                    scrollEnabled={true}
                    // nestedScrollEnabled={true}

                    style={styles.input}
                    markdownStyle={markdownStyle}
                />
            </View>

            {/* Toolbar */}
            <View style={styles.toolbar}>
                <ToolbarButton
                    label="B"
                    active={false}
                    onPress={() => wrapSelection("**")}
                    style={{ fontWeight: "bold" }}
                />
                <ToolbarButton
                    label="I"
                    active={false}
                    onPress={() => wrapSelection("_")}
                    style={{ fontStyle: "italic" }}
                />
                <ToolbarButton
                    label="S"
                    active={false}
                    onPress={() => wrapSelection("~~")}
                    style={{ textDecorationLine: "line-through" }}
                />

                {/* Separador */}
                <View style={styles.separator} />

                <ToolbarButton
                    label="H1"
                    active={false}
                    onPress={() => insertBlock("# ")}
                />
                <ToolbarButton
                    label="H2"
                    active={false}
                    onPress={() => insertBlock("## ")}
                />
                <ToolbarButton
                    label="❝"
                    active={false}
                    onPress={() => insertBlock("> ")}
                />
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // height: "100%",
        backgroundColor: "#161718",
    },
    editorContainer: {
        flex: 1,
        maxHeight: "100%",
        // minHeight: "100%",
        backgroundColor: "transparent",
        borderRadius: 8,
        padding: 12,
    },
    input: {
        flex: 1,
        paddingTop: 16,
        minHeight: 100,
        // height: "100%",
        color: "#eee",
        fontSize: 16,
        textAlignVertical: "top",
    },
    toolbar: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#1a1a1c",
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderTopWidth: 1,
        borderTopColor: "#2a2a2a",
        gap: 4,
    },
    separator: {
        width: 1,
        height: 24,
        backgroundColor: "#333",
        marginHorizontal: 8,
    },
    button: {
        width: 36,
        height: 36,
        borderRadius: 6,
        alignItems: "center",
        justifyContent: "center",
    },
    buttonActive: {
        backgroundColor: "#333",
    },
    buttonText: {
        color: "#666",
        fontSize: 16,
    },
    textActive: {
        color: "#eee",
    },
});
