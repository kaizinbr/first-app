import { useRouter, Href } from 'expo-router';
;
import { Pressable, PressableProps, StyleSheet, Text } from "react-native";

type ButtonProps = PressableProps & {
    label: string;
    route?: Href;
    selected?: boolean;
};

export default function ChipBtn({ label, onPress, selected, ...props }: ButtonProps) {
    const router = useRouter();

    return (
        <Pressable
            style={({ pressed }) => [styles.button, pressed && styles.pressed, selected && { backgroundColor: "#222", borderColor: "#222" }]}
            onPress={onPress}
            {...props}
        >
            <Text style={styles.text}>{label}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: "transparent",
        borderWidth: 1,
        borderColor: "#2e2e2e",
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 12,
        width: "auto",
        height: 34,
        justifyContent: "center",
        alignItems: "center",
    },
    text: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "bold",
    },
    pressed: {
        opacity: 0.75,
    },
});
