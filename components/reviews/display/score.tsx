import { Text, View, StyleSheet, Pressable } from "react-native";
import { Review } from "@/lib/types";
import { Share } from "@solar-icons/react-native/Bold";
import { useRouter } from "expo-router";

export default function ReviewScore({ review }: { review: Review }) {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>
                Avaliação de {review.Profile.name}
            </Text>
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    width: "100%",
                    gap: 8,
                }}
            >
                <Text style={styles.score}>
                    {Number(review.total).toFixed(1)}/100
                </Text>
                <Pressable
                    onPress={() =>
                        router.navigate(`/share/${review.id}`)
                    }
                >
                    <Share color="#eee" />
                </Pressable>
            </View>
            <Text style={styles.date}>
                {new Date(review.created_at).toLocaleDateString("pt-BR")}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "transparent",
        alignContent: "center",
        justifyContent: "center",
        paddingHorizontal: 16,
    },
    sectionTitle: { color: "#fff", fontSize: 16, fontWeight: "bold" },
    score: { color: "#fff", fontSize: 28, fontWeight: "900", marginTop: 4 },
    date: { color: "#777", fontSize: 14, marginTop: 4 },
    confBtn: {
        backgroundColor: "#8065ef",
        borderRadius: 8,
        padding: 8,
    },
});
