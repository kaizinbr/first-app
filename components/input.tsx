import { View, Text, StyleSheet, TextProps, TextInput, TextInputProps } from "react-native";

export default function Input({...props}: TextInputProps) {
    return (
            <TextInput style={[styles.input]} {...props} />
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        width: "100%",
        gap: 16,
    },
    input: {
        fontSize: 16,
        padding: 10,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 12,
        width: "100%",
    },
});