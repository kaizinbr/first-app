import { useRouter, Href } from 'expo-router';
;
import { Pressable, PressableProps, StyleSheet, Text } from "react-native";

type ButtonProps = PressableProps & {
    label: string;
    route?: Href;
};

export default function ChipBtn({ label, onPress, ...props }: ButtonProps) {
    const router = useRouter();

    return (
        <Pressable
            style={({ pressed }) => [styles.button, pressed && styles.pressed]}
            onPress={onPress}
            {...props}
        >
            <Text style={styles.text}>{label}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: "#007AFF",
        padding: 12,
        borderRadius: 12,
        width: "auto",
        alignItems: "center",
    },
    text: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    pressed: {
        opacity: 0.75,
    },
});
