import {
    View,
    Text,
    Image,
    Button,
    StyleSheet,
    ScrollView,
    Pressable
} from "react-native";
import { UserProfile, Review } from "@/lib/types";
import { Tabs } from "react-native-collapsible-tab-view";
import { ArrowRightUp } from '@solar-icons/react-native/Linear'

export default function AboutRoute({ data }: { data: UserProfile }) {
    return (
        <Tabs.ScrollView
            contentContainerStyle={{
                flexGrow: 1,
                width: "100%",
                padding: 16,
                paddingBottom: 80,
                paddingTop: 448,
            }}
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.scene}>
                <View style={styles.sec}>
                    {data.bio && (
                        <View >
                            <Text style={styles.title}>Bio</Text>
                            <Text style={styles.textDefault}>{data.bio}</Text>
                        </View>
                    )}
                    {data.location && (
                        <View >
                            <Text style={styles.title}>Location</Text>
                            <Text style={styles.textDefault}>
                                {data.location}
                            </Text>
                        </View>
                    )}

                    <View >
                        <Text style={styles.title}>Membro desde</Text>
                        <Text style={styles.textDefault}>
                            {new Date(data.created_at).toLocaleDateString(
                                process.env.LOCALE || "pt-BR",
                                {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                },
                            )}
                        </Text>
                    </View>
                </View>
                {data.site && (
                    <Pressable style={[styles.sec, { flexDirection: "row", alignItems: "center", justifyContent: "space-between" }]} onPress={() => {
                        // Lógica para abrir o site, por exemplo, usando Linking
                    }}>
                        <Text style={styles.textDefault}>{data.site}</Text> 
                        <ArrowRightUp size={18} color="#eee" />
                    </Pressable>
                )}
                <Text style={styles.textDefault}>
                    Verified: {data.verified ? "Yes" : "No"}
                </Text>
            </View>
        </Tabs.ScrollView>
    );
}

const styles = StyleSheet.create({
    scene: {
        flex: 1,

        gap: 16,
        width: "100%",
    },

    textDefault: {
        color: "#eee", // A cor clara para o seu modo escuro
        fontSize: 16,
    },
    title: {
        color: "#989898",
        fontSize: 14,
        fontWeight: "bold",
    },
    sec: {
        backgroundColor: "#222",
        padding: 16,
        borderRadius: 12,
        gap: 16,
        // fontSize: 14,
    },
});
