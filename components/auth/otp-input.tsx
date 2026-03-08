import React, { useRef, useState } from "react";
import { View, Text, TextInput, StyleSheet, Pressable } from "react-native";

interface OTPInputProps {
    length?: number;
    onComplete: (code: string) => void;
}

export default function OTPInput({ length = 6, onComplete }: OTPInputProps) {
    const [code, setCode] = useState("");
    const inputRef = useRef<TextInput>(null);

    // Quando o usuário clica em qualquer quadrado, nós focamos o input invisível
    const handlePress = () => {
        inputRef.current?.focus();
    };

    const handleChange = (text: string) => {
        // Aceita apenas números
        const numericText = text.replace(/[^0-9]/g, "");
        setCode(numericText);

        // Se chegou no tamanho máximo, avisa a tela principal
        if (numericText.length === length) {
            onComplete(numericText);
        }
    };

    return (
        <View style={styles.container}>
            {/* 1. O INPUT INVISÍVEL (O verdadeiro motor da tela) */}
            <TextInput
                ref={inputRef}
                value={code}
                onChangeText={handleChange}
                maxLength={length}
                keyboardType="number-pad"
                // 🌟 AS PROPRIEDADES OFICIAIS PARA AUTOFILL DE SMS NO EXPO 🌟
                textContentType="oneTimeCode" // Puxa o código do SMS no iOS
                autoComplete="sms-otp" // Puxa o código do SMS no Android
                style={styles.hiddenInput}
                autoFocus // Já abre o teclado sozinho ao entrar na tela
            />

            {/* 2. OS QUADRADINHOS VISÍVEIS */}
            <Pressable style={styles.boxContainer} onPress={handlePress}>
                {[...Array(length)].map((_, index) => {
                    const digit = code[index] || "";

                    // Lógica para saber qual quadrado deve ficar com a borda acesa
                    const isCurrentDigit = index === code.length;
                    const isLastDigit =
                        index === length - 1 && code.length === length;
                    const isFocused = isCurrentDigit || isLastDigit;

                    return (
                        <View
                            key={index}
                            style={[
                                styles.box,
                                isFocused && styles.boxFocused,
                                digit !== "" && styles.boxFilled, // Muda a cor se já tiver número
                            ]}
                        >
                            <Text style={styles.boxText}>{digit}</Text>
                        </View>
                    );
                })}
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
    },
    hiddenInput: {
        position: "absolute",
        width: 1,
        height: 1,
        opacity: 0, // Esconde o input original completamente
    },
    boxContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        gap: 8, // Espaço entre os quadrados
    },
    box: {
        width: 50,
        height: 60,
        borderWidth: 2,
        borderColor: "#333", // Cor da borda inativa
        borderRadius: 12,
        backgroundColor: "#1e1e1e",
        justifyContent: "center",
        alignItems: "center",
    },
    boxFocused: {
        borderColor: "#00a8ff", // Cor da borda quando está digitando (mude para a cor do seu app)
        backgroundColor: "#161718",
    },
    boxFilled: {
        borderColor: "#555",
    },
    boxText: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#eee",
    },
});
