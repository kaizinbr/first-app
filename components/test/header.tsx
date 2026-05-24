import { useMemo } from "react";
import { Image, StyleSheet, Text, View, ViewProps } from "react-native";

export const IMAGE_SIZE = 80;

const styles = StyleSheet.create({
    container: {
        padding: 16,
        alignItems: "center",
    },
    name: { fontSize: 24, fontWeight: "700", marginTop: 8 },
    mob: { margin: 4 },
    photo: {
        height: IMAGE_SIZE,
        width: IMAGE_SIZE,
        borderRadius: IMAGE_SIZE / 2,
    },
})

type Props = Pick<ViewProps, "style"> & {
    name: string;
    mob: string;
    photo: string;
};

const Header: React.FC<Props> = ({ style, name, mob, photo }) => {
    const containerStyle = useMemo(() => [styles.container, style], [style]);
    return (
        <View style={containerStyle}>
            <Image style={styles.photo} source={{ uri: photo }} />
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.mob}>{mob}</Text>
        </View>
    )
}
export default Header;