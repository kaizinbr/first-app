import { View, StyleSheet } from "react-native";
import TextDefault from "@/components/core/text-core";

function Stat({ value, label }: { value: number | undefined; label: string }) {
    return (
        <View style={{ flex: 1, gap: 2, alignItems: "center", marginRight: 0 }}>
            <TextDefault
                style={{ color: "#eee", fontSize: 18, fontWeight: "bold" }}
            >
                {value === undefined ? "—" : value.toLocaleString("pt-BR")}
            </TextDefault>
            <TextDefault style={{ color: "#989898", fontSize: 12 }}>
                {label}
            </TextDefault>
        </View>
    );
}

export default function StatsSummary({
    scrobbles,
    artists,
    albums,
    tracks,
    isPlaceholderData,
}: {
    scrobbles: number | undefined;
    artists: number | undefined;
    albums: number | undefined;
    tracks: number | undefined;
    isPlaceholderData: boolean;
}) {
    return (
        <View
            style={{
                backgroundColor: "#212223",
                padding: 16,
                borderRadius: 18,
                flexDirection: "row",
                            justifyContent: "space-evenly",
                gap: 8,
                opacity: isPlaceholderData ? 0.5 : 1,
            }}
        >
            <Stat value={scrobbles} label="scrobbles" />
            <View style={styles.divider} />
            <Stat value={artists} label="artistas" />
            <View style={styles.divider} />
            <Stat value={albums} label="álbuns" />
            <View style={styles.divider} />
            <Stat value={tracks} label="músicas" />
        </View>
    );
}

const styles = StyleSheet.create({
    divider: {
        height: 40,
        borderWidth: 1,
        borderColor: "#4a4a4a",
    },
});
