import { View } from "react-native";
import { StyleSheet } from "react-native";

export function ItemSeparator() {
    return (
        <View
            style={{
                height: 0.5,
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <View
                style={{
                    height: 0.5,
                    backgroundColor: "#3d3d3d",
                    width: "95%",
                }}
            />
        </View>
    );
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
