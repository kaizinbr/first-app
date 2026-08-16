import { useCallback, useRef, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Keyboard,
    Pressable,
    StyleSheet,
    View,
    Platform,
} from "react-native";
import {
    EnrichedMarkdownTextInput,
    type EnrichedMarkdownTextInputInstance,
    type StyleState,
} from "react-native-enriched-markdown";

// 1. Imports ajustados para o padrão da nova biblioteca
import Animated, {
    useAnimatedStyle,
    useSharedValue,
} from "react-native-reanimated";
import { useKeyboardHandler } from "react-native-keyboard-controller";

import {
    Plain2Bold,
    TextBoldSquareBold,
    TextBoldSquareOutline,
    TextItalicSquareBold,
    TextItalicSquareLinear,
} from "@/lib/solar-icons";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import { apiAuth, apiAuthPost } from "@/lib/api";
import { AvatarNoPress } from "@/components/core/avatar";
import TextDefault from "@/components/core/text-core";

interface Suggestion {
    id: string;
    username: string;
    name: string;
    avatar_url: string;
}

const MENTION_REGEX = /@(\w+)$/;

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

    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [mentionQuery, setMentionQuery] = useState<string | null>(null);
    const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    const keyboardHeight = useSharedValue(0);

    useKeyboardHandler(
        {
            onMove: (event) => {
                'worklet';
                keyboardHeight.value = Math.abs(event.height);
            },
            onEnd: (event) => {
                'worklet';
                keyboardHeight.value = Math.abs(event.height);
            },
        },
        []
    );

    const containerStyle = useAnimatedStyle(() => {
        const kbHeight = keyboardHeight.value;
        const isKeyboardOpen = kbHeight > 0;

        // A Mágica: Subtraímos a altura do TabBar/Offset (56px) do teclado.
        // Se a sua barra fechar/abrir em uma altura ligeiramente diferente, você pode 
        // ajustar o número 56 (ex: para 60 ou usar o insets.bottom).
        return {
            bottom: isKeyboardOpen ? kbHeight - insets.bottom : Math.max(insets.bottom, 54), 
        };
    });

    const sheetStyle = useAnimatedStyle(() => {
        const kbHeight = keyboardHeight.value;
        const isKeyboardOpen = kbHeight > 0;
        // Como agora usamos os 56px de bottom fixos quando fechado, o input já está 
        // protegido das bordas arredondadas/linha do iPhone/Android. 
        // Não precisamos mais de paddingBottom dinâmico, apenas 0 limpo.
        return {
            paddingBottom: isKeyboardOpen ? 0 : 8,
        };
    });

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
            const newMarkdown = markdown.replace(
                MENTION_REGEX,
                `[@${user.username}](${user.username}) `,
            );
            setSuggestions([]);
            setMentionQuery(null);
            ref.current?.setValue?.(newMarkdown);
            setMarkdown(newMarkdown);
        },
        [markdown],
    );

    const handleSubmit = useCallback(async () => {
        const body = markdown.trim();
        if (!body || submitting) return;

        setSubmitting(true);
        try {
            await apiAuthPost(`/reviews/${reviewId}/comment`, {
                body,
                ...(parentId && { parentId }),
            });
            ref.current?.setValue?.("");
            setMarkdown("");
            Keyboard.dismiss();
            onCommentPosted?.();
        } catch (err) {
            // trate o erro com toast/alert conforme seu padrão
        } finally {
            setSubmitting(false);
        }
    }, [markdown, submitting, reviewId, parentId, onCommentPosted]);

    // 5. Retiramos o KeyboardAvoidingView por completo
    return (
        <Animated.View
            pointerEvents="box-none"
            style={[styles.container, containerStyle]}
        >
            {/* Animamos a sheet para lidar com o Safe Area Insets dinamicamente */}
            <Animated.View style={[styles.sheet, sheetStyle]}>
                
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
                                    <View style={{ flexDirection: "column", gap: 2 }}>
                                        <TextDefault style={styles.suggestionText}>
                                            {item.name}
                                        </TextDefault>
                                        <TextDefault
                                            style={[
                                                styles.suggestionText,
                                                { color: "#888", fontSize: 12 },
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
                
                <View style={styles.row}>
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
                        style={[
                            styles.toolbarSendBtn,
                            { backgroundColor: markdown.trim() ? "#8065ef" : "#333" },
                        ]}
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
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        left: 0,
        right: 0,
        width: "100%",
        justifyContent: "flex-end",
        zIndex: 10,
    },
    sheet: {
        backgroundColor: "#161718",
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: "#222",
    },
    row: {
        flexDirection: "row",
        alignItems: "flex-end",
        gap: 8,
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: "#161718",
        // Removi a borda daqui e passei para o sheet para um visual mais contínuo
    },
    toolbarBtn: {
        paddingBottom: 2,
        minHeight: 28,
    },
    toolbarSendBtn: {
        padding: 8,
        borderRadius: 999,
        alignItems: "center",
        justifyContent: "center",
    },
    input: {
        flex: 1,
        fontSize: 15,
        color: "#fff",
        maxHeight: 100,
        minHeight: 28,
    },
    suggestions: {
        backgroundColor: "#1a1a1a",
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: "#333",
        borderRadius: 8,
        marginHorizontal: 16,
        marginBottom: 8, // Dei um pequeno respiro extra entre os mentions e a barra
        marginTop: 8,
        maxHeight: 160,
        overflow: "hidden",
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
});