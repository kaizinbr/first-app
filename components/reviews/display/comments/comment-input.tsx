import {
    KeyboardAvoidingView,
    Platform,
    Keyboard,
    Animated,
    Easing,
} from "react-native";
import { useRef, useState, useEffect, useCallback } from "react";
import {
    View,
    Text,
    Pressable,
    FlatList,
    StyleSheet,
    ActivityIndicator,
} from "react-native";
import {
    EnrichedMarkdownTextInput,
    type EnrichedMarkdownTextInputInstance,
    type StyleState,
} from "react-native-enriched-markdown";
import axios from "axios";

import {
    TextBoldSquareBold,
    TextBoldSquareOutline,
    TextItalicSquareLinear,
    TextItalicSquareBold,
    Plain2Bold,
} from "@solar-icons/react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { apiAuth, apiAuthPost } from "@/lib/api";

interface Suggestion {
    id: string;
    username: string;
    avatar_url: string;
}

const MENTION_REGEX = /@(\w+)$/;
const TAB_BAR_HEIGHT = 56;

export function CommentInput({
    reviewId,
    parentId,
    onCommentPosted,
}: {
    reviewId: string;
    parentId?: string;
    onCommentPosted?: () => void;
}) {
    const ref = useRef<EnrichedMarkdownTextInputInstance>(null);
    const insets = useSafeAreaInsets();
    const [styleState, setStyleState] = useState<StyleState | null>(null);
    const [markdown, setMarkdown] = useState("");
    const [submitting, setSubmitting] = useState(false);

    // mention state
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [mentionQuery, setMentionQuery] = useState<string | null>(null);
    const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleChangeMarkdown = useCallback((text: string) => {
        setMarkdown(text);

        const match = text.match(MENTION_REGEX);
        if (match) {
            const query = match[1];
            setMentionQuery(query);

            if (searchTimeout.current) clearTimeout(searchTimeout.current);
            searchTimeout.current = setTimeout(async () => {
                if (query.length < 1) {
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
        } else {
            setMentionQuery(null);
            setSuggestions([]);
        }
    }, []);

    const handleSelectMention = useCallback(
        (user: Suggestion) => {
            // substitui o @query pelo link de menção no markdown
            const newMarkdown = markdown.replace(
                MENTION_REGEX,
                `[@${user.username}](/profile/${user.username}) `,
            );
            // limpa sugestões
            setSuggestions([]);
            setMentionQuery(null);
            // injeta o texto atualizado no input
            ref.current?.setValue?.(newMarkdown);
            setMarkdown(newMarkdown);
        },
        [markdown],
    );

    const handleSubmit = useCallback(async () => {
        const body = markdown.trim();
        if (!body || submitting) return;

        console.log("Submitting comment:", { body, reviewId, parentId });

        setSubmitting(true);
        try {
            await apiAuthPost(`/reviews/${reviewId}/comment`, {
                body,
                    ...(parentId && { parentId }),
            });
            ref.current?.setValue?.("");
            setMarkdown("");
            onCommentPosted?.();
        } catch (err) {
            // trate o erro com toast/alert conforme seu padrão
        } finally {
            setSubmitting(false);
        }
    }, [markdown, submitting, reviewId, parentId, onCommentPosted]);

    // teclado

    const keyboardOffset = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const showEvent =
            Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";

        const hideEvent =
            Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

        const showSub = Keyboard.addListener(showEvent, (event) => {
            Animated.timing(keyboardOffset, {
                toValue: event.endCoordinates.height,
                duration: 250,
                easing: Easing.out(Easing.ease),
                useNativeDriver: false,
            }).start();
        });

        const hideSub = Keyboard.addListener(hideEvent, () => {
            Animated.timing(keyboardOffset, {
                toValue: 0,
                duration: 250,
                easing: Easing.out(Easing.ease),
                useNativeDriver: false,
            }).start();
        });

        return () => {
            showSub.remove();
            hideSub.remove();
        };
    }, []);

    return (
        <Animated.View
            style={{
                backgroundColor: "#161718",
                position: "absolute",
                bottom: Animated.add(
                    keyboardOffset,
                    new Animated.Value(TAB_BAR_HEIGHT + insets.bottom),
                ),
                left: 0,
                right: 0,
                zIndex: 10,
            }}
        >
            {/* Dropdown de mentions */}
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
                                <Text style={styles.suggestionText}>
                                    @{item.username}
                                </Text>
                            </Pressable>
                        )}
                    />
                </View>
            )}

            <View style={styles.row}>
                {/* Toolbar bold/italic */}
                <Pressable
                    onPress={() => ref.current?.toggleBold()}
                    hitSlop={8}
                    style={styles.toolbarBtn}
                >
                    {styleState?.bold.isActive ? (
                        <TextBoldSquareBold size={22} color="#fff" />
                    ) : (
                        <TextBoldSquareOutline size={22} color="#888" />
                    )}
                </Pressable>

                <Pressable
                    onPress={() => ref.current?.toggleItalic()}
                    hitSlop={8}
                    style={styles.toolbarBtn}
                >
                    {styleState?.italic.isActive ? (
                        <TextItalicSquareBold size={22} color="#fff" />
                    ) : (
                        <TextItalicSquareLinear size={22} color="#888" />
                    )}
                </Pressable>

                <EnrichedMarkdownTextInput
                    ref={ref}
                    placeholder="Adicione um comentário..."
                    placeholderTextColor="#555"
                    onChangeState={setStyleState}
                    onChangeMarkdown={handleChangeMarkdown}
                    style={styles.input}
                    markdownStyle={{
                        strong: { color: "#fff" },
                        em: { color: "#aaa" },
                        link: { color: "#8065ef", underline: false },
                    }}
                    multiline
                    scrollEnabled={true}
                />

                <Pressable
                    onPress={handleSubmit}
                    disabled={!markdown.trim() || submitting}
                    hitSlop={8}
                    style={[styles.toolbarSendBtn, { backgroundColor: markdown.trim() ? "#8065ef" : "#333" }]}
                >
                    {submitting ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <Plain2Bold
                            size={20}
                            color={markdown.trim() ? "#fff" : "#999"}
                        />
                    )}
                </Pressable>
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        alignItems: "flex-end",
        gap: 8,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: "#222",
        backgroundColor: "#161718",
    },
    toolbarBtn: {
        paddingBottom: 2,
        minHeight: 28,
    },
    toolbarSendBtn: {
        padding: 8,
        backgroundColor: "#8065ef",
        borderRadius: 999,
        alignItems: "center",
        justifyContent: "center",
    },
    input: {
        flex: 1,
        fontSize: 15,
        color: "#fff",
        maxHeight: 100, // limita a altura máxima
        minHeight: 28,
    },
    suggestions: {
        backgroundColor: "#1a1a1a",
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: "#333",
        borderRadius: 8,
        marginHorizontal: 16,
        marginBottom: 4,
        maxHeight: 160,
        overflow: "hidden",
    },
    suggestionItem: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: "#222",
    },
    suggestionText: {
        color: "#fff",
        fontSize: 14,
    },
});
