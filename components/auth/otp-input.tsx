import React, { useRef, useState } from "react";
import { View, Text, TextInput, StyleSheet, Pressable } from "react-native";

import { OtpInput } from "react-native-otp-entry";

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
            <OtpInput
                numberOfDigits={6}
                focusColor="#8065ef"
                onTextChange={(text) => onComplete(text)}
                onFilled={(text) => onComplete(text)}
                placeholder="******"
                type="numeric"
                textProps={{
                    accessibilityRole: "text",
                    accessibilityLabel: "OTP digit",
                    allowFontScaling: false,
                }}
                theme={{
                    containerStyle: {
                        gap: 8,
                    },
                    pinCodeContainerStyle: {
                        width: 50,
                        height: 60,
                        borderWidth: 2,
                        borderColor: "#333",
                        borderRadius: 12,
                        backgroundColor: "#1e1e1e",
                        justifyContent: "center",
                        alignItems: "center",
                    },
                    pinCodeTextStyle: {
                        fontSize: 24,
                        fontWeight: "bold",
                        color: "#eee",
                    },
                    placeholderTextStyle: {
                        fontSize: 24,
                        fontWeight: "bold",
                        color: "#eee",
                    },
                }}
            />
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
