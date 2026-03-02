import React, { useRef, useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    View,
    Button,
    Pressable,
    Text
} from "react-native";
// Importamos o componente da biblioteca
import type {
    OnChangeHtmlEvent,
    OnChangeStateEvent,
    EnrichedTextInputInstance
} from "react-native-enriched";
import { EnrichedTextInput } from "react-native-enriched";

export default function PostEditor({ref}: {ref: React.RefObject<EnrichedTextInputInstance | null>}) {
    const [conteudoHtml, setConteudoHtml] = useState<OnChangeHtmlEvent | null>(
        null,
    );
    const [activeStyles, setActiveStyles] = useState({
        bold: false,
        italic: false,
        underline: false,
    });

    const handleStateChange = (event: any) => {
        // O evento traz exatamente o que está ativo no cursor naquele momento
        const state = event.nativeEvent;

        setActiveStyles({
            bold: state.bold,
            italic: state.italic,
            underline: state.underline,
        });
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <View style={styles.editorContainer}>
                <EnrichedTextInput
                    ref={ref}
                    style={styles.input}
                    placeholder="O que você está pensando?"
                    placeholderTextColor="#777"
                    onChangeHtml={(html) => {
                        setConteudoHtml(html.nativeEvent);
                        // console.log("Conteúdo HTML atualizado:", html);
                    }}
                    onChangeState={handleStateChange}
                />
            </View>

            <View style={styles.toolbar}>
                {/* Botão de Negrito (B) */}
                <Pressable
                    style={[
                        styles.button,
                        activeStyles.bold && styles.buttonActive,
                    ]}
                    onPress={() => ref.current?.toggleBold()}
                >
                    <Text
                        style={[
                            styles.buttonText,
                            activeStyles.bold && styles.textActive,
                            { fontWeight: "bold" },
                        ]}
                    >
                        B
                    </Text>
                </Pressable>

                {/* Botão de Itálico (I) */}
                <Pressable
                    style={[
                        styles.button,
                        activeStyles.italic && styles.buttonActive,
                    ]}
                    onPress={() => ref.current?.toggleItalic()}
                >
                    <Text
                        style={[
                            styles.buttonText,
                            activeStyles.italic && styles.textActive,
                            { fontStyle: "italic" },
                        ]}
                    >
                        I
                    </Text>
                </Pressable>

                {/* Botão de Sublinhado (U) */}
                <Pressable
                    style={[
                        styles.button,
                        activeStyles.underline && styles.buttonActive,
                    ]}
                    onPress={() => ref.current?.toggleUnderline()}
                >
                    <Text
                        style={[
                            styles.buttonText,
                            activeStyles.underline && styles.textActive,
                            { textDecorationLine: "underline" },
                        ]}
                    >
                        U
                    </Text>
                </Pressable>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#161718",
        justifyContent: "flex-end",
    },
    editorContainer: {
        height: 300, // Funciona perfeitamente aqui!
        width: "100%",
        backgroundColor: "#222", // Cor de fundo do editor
        borderRadius: 8,
        padding: 12,
    },
    input: {
        flex: 1,
        color: "#eee", // O MODO ESCURO FUNCIONA DE PRIMEIRA!
        fontSize: 16,
        textAlignVertical: "top",
    },
    toolbar: {
        flexDirection: "row",
        backgroundColor: "#1a1a1c",
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderTopWidth: 1,
        borderTopColor: "#333",
        gap: 12, // Espaçamento moderno entre os botões
    },
    button: {
        width: 40,
        height: 40,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "transparent",
    },
    buttonActive: {
        backgroundColor: "#333", // Fundo mais claro quando o botão está ativado
    },
    buttonText: {
        color: "#777", // Cor apagada por padrão
        fontSize: 18,
    },
    textActive: {
        color: "#eee", // Fica branquinho quando a formatação está ativa
    },
});
