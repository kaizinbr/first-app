import { Text, View, StyleSheet } from "react-native";
import { Review } from "@/lib/types";

export default function ReviewScore({ review }: { review: Review }) {
    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>
                Avaliação de {review.Profile.name}
            </Text>
            <Text style={styles.score}>{Number(review.total).toFixed(1)}/100</Text>
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
});
