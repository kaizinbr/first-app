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
            >

                <View style={[styles.section, { padding: 16 }]}>
                    <TextDefault style={[styles.textDefault, styles.title]}>
                        Sobre
                    </TextDefault>
                    <TextDefault style={[styles.textDefault, styles.paragraph]}>
                        Todos os dados dos álbuns são obtidos através da Web API
                        do <Text style={styles.boldText}>Spotify</Text>, e
                        qualquer pessoa pode criar uma conta para fazer suas
                        avaliações, que são públicas para toda a comunidade. Se
                        você gosta de música e quer compartilhar suas opiniões,
                        o Pitchforkd é o lugar certo para você.
                    </TextDefault>

                    <TextDefault style={[styles.textDefault, styles.subtitle]}>
                        Nome e criação
                    </TextDefault>

                    <TextDefault style={[styles.textDefault, styles.paragraph]}>
                        O nome <Text style={styles.boldText}>Pitchforkd</Text>{" "}
                        surgiu da junção das palavras Pitchfork, um site de
                        crítica de música, e Letterboxd, um site de avaliação de
                        filmes. A ideia é trazer a experiência de avaliar álbuns
                        de música para um site com uma interface atrativa,
                        simples e intuitiva.
                    </TextDefault>

                    <TextDefault style={[styles.textDefault, styles.paragraph]}>
                        A plataforma foi criada por{" "}
                        <Text
                            style={styles.linkText}
                            onPress={() => openLink("https://www.kaizin.work")}
                        >
                            <Text style={styles.underlineText}>Kaio Nunes</Text>
                        </Text>{" "}
                        de maneira independente, apenas para fins de estudo e
                        aprendizado. O código fonte do projeto está disponível
                        no{" "}
                        <Text
                            style={styles.linkText}
                            onPress={() =>
                                openLink(
                                    "https://github.com/kaizinbr/pitchforkd",
                                )
                            }
                        >
                            <Text style={styles.underlineText}>GitHub</Text>
                        </Text>
                        .
                    </TextDefault>

                    <TextDefault style={[styles.textDefault, styles.paragraph]}>
                        O projeto foi criado utilizando várias tecnologias e
                        bibliotecas, mas as principais são Next.Js, Tailwind
                        CSS, TypeScript e Supabase.
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
        backgroundColor: "#1b1c1d",
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
