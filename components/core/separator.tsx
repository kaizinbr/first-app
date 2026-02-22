import { View } from "react-native";
import { StyleSheet } from "react-native";

export function ItemSeparator() {
    return <View style={styles.separator} />;
}

const styles = StyleSheet.create({
    separator: {
        height: 1,
        backgroundColor: "#333", // Uma cor cinza escura sutil que combina com seu modo dark
        marginVertical: 4, // O espaço entre o separador e os posts
    },
    scene: {
        flex: 1,
        gap: 16,
        width: "100%",
    },
});