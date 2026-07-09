import TextDefault from "@/components/core/text-core";
import { AltArrowLeft } from "@solar-icons/react-native/Outline";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

export default function IndexSettings() {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const FIXED_BAR_HEIGHT = insets.top + 50;

    const openLink = async (url: string) => {
        await Linking.openURL(url);
    };

    return (
        <>
            <Animated.View
                style={[
                    styles.statusBarBg,
                    {
                        height: insets.top + 24,
                    },
                ]}
                pointerEvents="none"
            >
                <LinearGradient
                    colors={["#161718", "transparent"]}
                    style={StyleSheet.absoluteFill}
                />
            </Animated.View>
                <Pressable
                    onPress={() => router.back()}
                    style={[styles.backButton, { top: insets.top + 4 }]}
                >
                    <AltArrowLeft size={32} color="#eee" />
                </Pressable>
            <ScrollView
                style={[styles.container, { paddingTop: FIXED_BAR_HEIGHT }]}
                    showsVerticalScrollIndicator={false}
            >

                <View style={[styles.section, { padding: 16 }]}>
                    <TextDefault style={[styles.textDefault, styles.title]}>
                        Contato
                    </TextDefault>

                    <TextDefault style={[styles.textDefault, styles.paragraph]}>
                        Para entrar em contato com o criador da plataforma para
                        remoção de algum conteúdo, LGPD ou algum motivo
                        específico, envie um e-mail para{" "}
                        <Text
                            style={styles.linkText}
                            onPress={() =>
                                openLink("mailto:kaiolucas1812@gmail.com")
                            }
                        >
                            <Text style={styles.underlineText}>
                                kaiolucas1812@gmail.com
                            </Text>
                        </Text>
                        .
                    </TextDefault>
                </View>
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 16,
        padding: 16,
        width: "100%",
    },
    statusBarBg: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: "transparent",
        zIndex: 10,
    },

    textDefault: {
        color: "#eee",
        fontSize: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 8,
    },
    paragraph: {
        marginBottom: 12,
        lineHeight: 22,
    },
    boldText: {
        fontWeight: "700",
        color: "#eee",
    },
    linkText: {
        color: "#eee",
    },
    underlineText: {
        textDecorationLine: "underline",
        color: "#eee",
        fontWeight: "700",
    },
    section: {
        backgroundColor: "#212223",
        padding: 16,
        borderRadius: 12,
        overflow: "hidden",
    },
    backButton: {
        position: "absolute",
        left: 16,
        zIndex: 11,
        width: 40,
        height: 40,
        justifyContent: "center",
    },
});
