import React, { useCallback, useEffect, useRef, useState } from "react";
import { FlatList, Pressable, StyleSheet, View } from "react-native";
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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
    TextBold,
    TextCross,
    TextItalic,
    TextUnderline,
} from "@/lib/solar-icons/Bold";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
} from "react-native-reanimated";
import { useKeyboardHandler } from "react-native-keyboard-controller";

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
    return text.replace(/\\n/g, "\n").replace(/\r/g, "");
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
    const insets = useSafeAreaInsets();

    const normalizedInitial = normalizeNewlines(initialValue);
    const markdownRef = useRef(normalizedInitial);
    const dirtyRef = useRef(false);

    // Trava de segurança para impedir o feedback loop corrupto
    const isSettingValueRef = useRef(false);

    const [styleState, setStyleState] = useState<StyleState | null>(null);
    const [markdown, setMarkdown] = useState(normalizedInitial);
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [currentAlbumId, setCurrentAlbumId] = useState(album.id);

    const keyboardHeight = useSharedValue(0);

    useEffect(() => {
        const updated = normalizeNewlines(initialValue);
        setMarkdown(updated);
        markdownRef.current = updated;
        dirtyRef.current = false;
        setCurrentAlbumId(album.id);

        // 1. Ativa a trava antes de injetar o valor nativo
        isSettingValueRef.current = true;

        setTimeout(() => {
            ref.current?.setValue?.(updated);

            // 2. Libera a trava apenas após o componente nativo processar o texto puro
            setTimeout(() => {
                isSettingValueRef.current = false;
            }, 250);
        }, 150);
    }, [album.id]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (!dirtyRef.current) return;
            onAutoSave?.(markdownRef.current);
            dirtyRef.current = false;
        }, 10000);

        return () => {
            if (searchTimeout.current) clearTimeout(searchTimeout.current);
            clearInterval(interval);
            if (dirtyRef.current) {
                onAutoSave?.(markdownRef.current);
                dirtyRef.current = false;
            }
        };
    }, [onAutoSave]);

    const handleChangeMarkdown = useCallback(
        (text: string) => {
            // SE A TRAVA ESTIVER ATIVA: Ignora o evento defeituoso do componente e mantém o texto puro intacto
            if (isSettingValueRef.current) return;

            setMarkdown(text);
            markdownRef.current = text;
            dirtyRef.current = true;

            onDraftChange?.(text);

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
            dirtyRef.current = true;

            onDraftChange?.(newMarkdown);
            ref.current?.setValue?.(newMarkdown);
        },
        [onDraftChange],
    );

    useKeyboardHandler(
        {
            onMove: (event) => {
                "worklet";
                keyboardHeight.value = Math.max(event.height, 0);
            },
            onEnd: (event) => {
                "worklet";
                keyboardHeight.value = Math.max(event.height, 0);
            },
        },
        [],
    );

    const toolbarStyle = useAnimatedStyle(() => {
        const kbHeight = keyboardHeight.value;
        return {
            bottom: kbHeight > 0 ? kbHeight + 8 : Math.max(insets.bottom, 24),
        };
    });

    const editorContainerStyle = useAnimatedStyle(() => {
        const kbHeight = keyboardHeight.value;
        return {
            paddingBottom:
                kbHeight > 0 ? kbHeight : Math.max(insets.bottom, 24),
        };
    });

    return (
        <View style={styles.container}>
            <Animated.View
                style={[styles.editorContainer, editorContainerStyle]}
            >
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
                </View>
            </Animated.View>

            <Animated.View style={[styles.toolbar, toolbarStyle]}>
                <ToolbarButton
                    icon={
                        <TextBold
                            size={16}
                            color={styleState?.bold?.isActive ? "#eee" : "#666"}
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
                                styleState?.italic?.isActive ? "#eee" : "#666"
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
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
    },
    editorContainer: {
        flex: 1,
        backgroundColor: "transparent",
        paddingHorizontal: 16,
        gap: 12,
    },
    editorSurface: {
        flex: 1,
        // overflow: "hidden",
        backgroundColor: "transparent",
        height: "100%",
    },
    toolbar: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        padding: 8,
        backgroundColor: "#1a1a1c",
        marginHorizontal: 16,
        borderRadius: 12,
    },
    input: {
        flex: 1,
        paddingTop: 14,
        paddingBottom: 18,
        color: "#eee",
        fontSize: 16,
        textAlignVertical: "top",
        // minHeight: 260,
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
