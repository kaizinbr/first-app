import { useState } from "react";
import { TextInput, TouchableOpacity, View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface PasswordInputProps extends React.ComponentProps<typeof TextInput> {
    value: string;
    onChangeText: (text: string) => void;
    login: Boolean
}

export function PasswordInput({
    value,
    onChangeText,
    login,
    style,
    ...props
}: PasswordInputProps) {
    const [visible, setVisible] = useState(false);

    return (
        <View style={[login ? styles.inputLogin : styles.container]}>
            <TextInput
                value={value}
                onChangeText={onChangeText}
                secureTextEntry={!visible}
                style={[styles.input]}
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
        // backgroundColor: "red"
    },
    icon: {
        position: "absolute",
        right: 12,
    },
    
    inputLogin: {
        width: "100%",
        paddingHorizontal: 6,
        borderWidth: 1,
        borderColor: "#262626",
        backgroundColor: "#1b1c1d222",
        borderRadius: 12,
        color: "#eeeeee",
        fontFamily: "Walsheim",
        fontWeight: 400,
        flexDirection: "row",
        alignItems: "center",
    },
});
