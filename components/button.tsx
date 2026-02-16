import { useRouter, Href } from 'expo-router';
;
import { Pressable, PressableProps, StyleSheet, Text } from "react-native";

type ButtonProps = PressableProps & {
    children: string;
    route?: Href;
};

export default function Button({ children, route, ...props }: ButtonProps) {
    const router = useRouter();

    

    const handlePress = () => {
        if (route) {
            router.navigate(route);
        }
    };

    return (
        <Pressable
            style={({ pressed }) => [styles.button, pressed && styles.pressed]}
            onPress={handlePress}
            {...props}
        >
            <Text style={styles.text}>{children}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: "#007AFF",
        padding: 12,
        borderRadius: 12,
        width: "100%",
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
