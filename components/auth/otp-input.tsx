import React, { useRef, useState } from "react";
import { View, Text, TextInput, StyleSheet, Pressable } from "react-native";

interface OTPInputProps {
    length?: number;
    placeholder?: string;
    onComplete: (code: string) => void;
}

export default function OTPInput({ length = 6, placeholder = "*", onComplete }: OTPInputProps) {
    const [code, setCode] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef<TextInput>(null);

    const handlePress = () => {
        inputRef.current?.focus();
    };

    const handleChange = (text: string) => {
        const numericText = text.replace(/[^0-9]/g, "").slice(0, length);
        setCode(numericText);

        if (numericText.length === length) {
            onComplete(numericText);
        }
    };

    return (
        <Pressable onPress={handlePress} style={styles.container}>
            <TextInput
                ref={inputRef}
                style={styles.hiddenInput}
                value={code}
                onChangeText={handleChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                keyboardType="numeric"
                maxLength={length}
                autoFocus
            />

            <View style={styles.boxContainer}>
                {Array.from({ length }).map((_, index) => {
                    const digit = code[index];
                    const isCurrent = isFocused && index === code.length;

                    return (
                        <View
                            key={index}
                            style={[
                                styles.box,
                                isCurrent && styles.boxFocused,
                                digit && styles.boxFilled,
                            ]}
                        >
                            <Text style={[styles.boxText, !digit && styles.placeholderText]}>
                                {digit ?? placeholder}
                            </Text>
                        </View>
                    );
                })}
            </View>
        </Pressable>
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
        opacity: 0,
    },
    boxContainer: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 8,
    },
    box: {
        width: 50,
        height: 60,
        borderWidth: 2,
        borderColor: "#333",
        borderRadius: 12,
        backgroundColor: "#1e1e1e",
        justifyContent: "center",
        alignItems: "center",
    },
    boxFocused: {
        borderColor: "#8065ef",
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
    placeholderText: {
        color: "#555",
    },
});