import { useState } from "react";
import { TextInput, TouchableOpacity, View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface PasswordInputProps extends React.ComponentProps<typeof TextInput> {
    value: string;
    onChangeText: (text: string) => void;
}

export function PasswordInput({
    value,
    onChangeText,
    style,
    ...props
}: PasswordInputProps) {
    const [visible, setVisible] = useState(false);

    return (
        <View style={styles.container}>
            <TextInput
                value={value}
                onChangeText={onChangeText}
                secureTextEntry={!visible}
                style={[styles.input, style]}
                {...props}
            />
            <TouchableOpacity
                onPress={() => setVisible((v) => !v)}
                style={styles.icon}
                hitSlop={8}
            >
                <Ionicons
                    name={visible ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color="#888"
                />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        fontSize: 16,
        padding: 6,
        borderRadius: 12,
        backgroundColor: "#282828",
    },
    input: {
        flex: 1,
        fontFamily: "Walsheim",
        color: "#eee",
    },
    icon: {
        position: "absolute",
        right: 12,
    },
});
