import { useRouter, Href } from 'expo-router';
import TextDefault from '@/components/core/text-core';
import { Pressable, PressableProps, StyleSheet, Text } from "react-native";

type ButtonProps = PressableProps & {
    children: string;
    route?: Href;
};

export default function Button({ children, route, style, ...props }: ButtonProps) {
    const router = useRouter();

    

    const handlePress = () => {
        if (route) {
            router.navigate(route);
        }
    };

    return (
        <Pressable
            style={({ pressed }) => [styles.button, pressed && styles.pressed, style]}
            onPress={handlePress}
            {...props}
        >
            <TextDefault style={styles.text}>{children}</TextDefault>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: "#8065ef",
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
