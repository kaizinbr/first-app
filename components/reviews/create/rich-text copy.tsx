import React, { useCallback, useEffect, useRef, useState } from "react";
import {
    FlatList,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    StyleSheet,
    View,
} from "react-native";
import {
    EnrichedMarkdownTextInput,
    type EnrichedMarkdownTextInputInstance,
    type StyleState,
} from "react-native-enriched-markdown";

import { AvatarNoPress } from "@/components/core/avatar";
import TextDefault from "@/components/core/text-core";
import { AlbumCard } from "@/components/home/album-section";
import { apiAuth } from "@/lib/api";
import { Album, ReviewWithAlbum } from "@/lib/types";

import {
    TextBold,
    TextCross,
    TextItalic,
    TextUnderline,
} from "@solar-icons/react-native/Bold";

interface Suggestion {
    id: string;
    username: string;
    name: string;
    avatar_url: string;
}

const MENTION_REGEX = /@(\w+)$/;

const ToolbarButton = React.memo(
    ({
        icon,
        active,
        onPress,
    }: {
        icon: React.ReactNode;
        active: boolean;
        onPress: () => void;
    }) => (
        <Pressable
            style={[styles.button, active && styles.buttonActive]}
            onPress={onPress}
            hitSlop={8}
        >
            {icon}
        </Pressable>
    ),
);

const normalizeNewlines = (text: string) => {
    if (!text) return "";
    
    // 1. Trata possíveis quebras escapadas (literais "\\n") que vêm de JSON/Bancos de Dados
    let parsedText = text.replace(/\\n/g, '\n');
    
    // 2. Garante que cada linha termine com 2 espaços (Hard Break do Markdown)
    return parsedText
        .split('\n')
        .map(line => line.trimEnd() + '  ')
        .join('\n')
        .trimEnd(); // Removemos o excesso do final do texto
};

export default function PostEditor({
    onDraftChange,
    onAutoSave,
    initialValue,
    album,
    total,
}: {
    onDraftChange?: (text: string) => void;
    onAutoSave?: (text: string) => void;
    initialValue: string;
    album: Album;
    total: number;
}) {
    const ref = useRef<EnrichedMarkdownTextInputInstance>(null);
    const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
    
    // 1. Inicia o valor já formatado para o Markdown
    const normalizedInitial = normalizeNewlines(initialValue);
    
    const markdownRef = useRef(normalizedInitial);
    const dirtyRef = useRef(false);
    const [styleState, setStyleState] = useState<StyleState | null>(null);
    const [markdown, setMarkdown] = useState(normalizedInitial);
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

    useEffect(() => {
        // 2. Normaliza todo o texto novo que chegar de fora (Server/Draft)
        const normalizedIncoming = normalizeNewlines(initialValue);
        
        if (normalizedIncoming === markdownRef.current) {
            dirtyRef.current = false;
            return;
        }

        if (dirtyRef.current) {
            return;
        }

        setMarkdown(normalizedIncoming);
        markdownRef.current = normalizedIncoming;
        dirtyRef.current = false;
        
        // 3. Pequeno delay garante que a ref foi injetada corretamente no component interno nativo
        setTimeout(() => {
            ref.current?.setValue?.(normalizedIncoming);
        }, 50);
        
    }, [initialValue]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (!dirtyRef.current) return;
            dirtyRef.current = false;
            onAutoSave?.(markdownRef.current);
        }, 10000);

        return () => {
            if (searchTimeout.current) clearTimeout(searchTimeout.current);
            clearInterval(interval);

            if (dirtyRef.current) {
                dirtyRef.current = false;
                onAutoSave?.(markdownRef.current);
            }
        };
    }, [onAutoSave]);

    const handleChangeMarkdown = useCallback(
        (text: string) => {
            setMarkdown(text);
            markdownRef.current = text;
            if (!dirtyRef.current) {
                dirtyRef.current = true;
                onDraftChange?.(text);
            }

            const match = text.match(MENTION_REGEX);
            if (!match) {
                setSuggestions([]);
                return;
            }

            const query = match[1];
            if (searchTimeout.current) clearTimeout(searchTimeout.current);

            searchTimeout.current = setTimeout(async () => {
                if (!query.length) {
                    setSuggestions([]);
                    return;
                }

                try {
                    const result = await apiAuth(`/users?q=${query}&limit=5`);
                    setSuggestions(result.profiles);
                } catch {
                    setSuggestions([]);
                }
            }, 300);
        },
        [onDraftChange],
    );

    const handleSelectMention = useCallback(
        (user: Suggestion) => {
            const newMarkdown = markdownRef.current.replace(
                MENTION_REGEX,
                `[@${user.username}](${user.username}) `,
            );

            setSuggestions([]);
            setMarkdown(newMarkdown);
            markdownRef.current = newMarkdown;
            if (!dirtyRef.current) {
                dirtyRef.current = true;
                onDraftChange?.(newMarkdown);
            }
            ref.current?.setValue?.(newMarkdown);
        },
        [onDraftChange],
    );
    
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <View style={styles.editorContainer}>
                <AlbumCard
                    image={album.images[0].url}
                    value={
                        total ? `${Number(total).toFixed(1)}/100` : "0.0/100"
                    }
                    subtitle={album.tracks.items.length}
                    editor
                    review={{} as ReviewWithAlbum}
                />

                {suggestions.length > 0 && (
                    <View style={styles.suggestions}>
                        <FlatList
                            data={suggestions}
                            keyExtractor={(item) => item.id}
                            keyboardShouldPersistTaps="always"
                            renderItem={({ item }) => (
                                <Pressable
                                    style={styles.suggestionItem}
                                    onPress={() => handleSelectMention(item)}
                                >
                                    <AvatarNoPress data={item} size={28} />
                                    <View style={styles.suggestionCopy}>
                                        <TextDefault
                                            style={styles.suggestionText}
                                        >
                                            {item.name}
                                        </TextDefault>
                                        <TextDefault
                                            style={[
                                                styles.suggestionText,
                                                styles.suggestionHandle,
                                            ]}
                                        >
                                            @{item.username}
                                        </TextDefault>
                                    </View>
                                </Pressable>
                            )}
                        />
                    </View>
                )}

                <View style={styles.editorSurface}>
                    <EnrichedMarkdownTextInput
                        ref={ref}
                        placeholder="Escreva sua review..."
                        placeholderTextColor="#555"
                        defaultValue={markdown}

                        onChangeState={setStyleState}
                        onChangeMarkdown={handleChangeMarkdown}
                        style={styles.input}
                        markdownStyle={{
                            strong: { color: "#fff" },
                            em: { color: "#fff" },
                            link: { color: "#8065ef", underline: false },
                        }}
                        multiline
                        scrollEnabled
                    />

                    <View style={styles.toolbar}>
                        <ToolbarButton
                            icon={
                                <TextBold
                                    size={16}
                                    color={
                                        styleState?.bold?.isActive
                                            ? "#eee"
                                            : "#666"
                                    }
                                />
                            }
                            active={!!styleState?.bold?.isActive}
                            onPress={() => ref.current?.toggleBold()}
                        />
                        <ToolbarButton
                            icon={
                                <TextItalic
                                    size={16}
                                    color={
                                        styleState?.italic?.isActive
                                            ? "#eee"
                                            : "#666"
                                    }
                                />
                            }
                            active={!!styleState?.italic?.isActive}
                            onPress={() => ref.current?.toggleItalic()}
                        />
                        <ToolbarButton
                            icon={
                                <TextUnderline
                                    size={16}
                                    color={
                                        styleState?.underline?.isActive
                                            ? "#eee"
                                            : "#666"
                                    }
                                />
                            }
                            active={!!styleState?.underline?.isActive}
                            onPress={() => ref.current?.toggleUnderline()}
                        />
                        <ToolbarButton
                            icon={
                                <TextCross
                                    size={16}
                                    color={
                                        styleState?.strikethrough?.isActive
                                            ? "#eee"
                                            : "#666"
                                    }
                                />
                            }
                            active={!!styleState?.strikethrough?.isActive}
                            onPress={() => ref.current?.toggleStrikethrough()}
                        />
                    </View>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#161718",
    },
    editorContainer: {
        flex: 1,
        backgroundColor: "transparent",
        paddingHorizontal: 12,
        paddingBottom: 12,
        gap: 12,
    },
    editorSurface: {
        flex: 1,
        // backgroundColor: "#1a1a1c",
        // borderRadius: 18,
        overflow: "hidden",
        // borderWidth: StyleSheet.hairlineWidth,
        // borderColor: "#2a2a2a",
    },
    toolbar: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: "#2a2a2a",
        backgroundColor: "#1a1a1c",
    },
    input: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 14,
        paddingBottom: 18,
        color: "#eee",
        fontSize: 16,
        textAlignVertical: "top",
        minHeight: 260,
        fontFamily: "Walsheim",
    },
    suggestions: {
        width: "100%",
        backgroundColor: "#1a1a1a",
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: "#333",
        borderRadius: 12,
        maxHeight: 180,
        overflow: "hidden",
    },
    suggestionCopy: {
        flex: 1,
        flexDirection: "column",
        gap: 2,
    },
    suggestionItem: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: "#222",
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    suggestionText: {
        color: "#fff",
        fontSize: 14,
    },
    suggestionHandle: {
        color: "#888",
        fontSize: 12,
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
        fontWeight: "700",
    },
    textActive: {
        color: "#eee",
    },
});
