import {
    View,
    Text,
    StyleSheet,
    TextProps,
    TextInput,
    TextInputProps,
} from "react-native";

export default function Input({
    placeholder,
    value,
    onChangeText,
    ...props
}: TextInputProps & {
    placeholder?: string;
    value?: string;
    onChangeText?: (text: string) => void;
}) {
    return (
        <TextInput
            style={[styles.input]}
            placeholder={placeholder}
            value={value}
            onChangeText={onChangeText}
            {...props}
        />
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
