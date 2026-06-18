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
                    showsVerticalScrollIndicator={false}
                style={[styles.container, { paddingTop: FIXED_BAR_HEIGHT }]}
            >
                <View style={[styles.section, { padding: 16 }]}>
                    <TextDefault style={[styles.textDefault, styles.title]}>
                        Políticas de privacidade
                    </TextDefault>
                    <TextDefault style={[styles.textDefault, styles.paragraph]}>
                        A Pitchforkd coleta apenas os dados pessoais essenciais
                        para criação dos perfis dos usuários. Os dados e imagens
                        coletados são armazenados de forma segura e não são
                        compartilhados com terceiros.
                    </TextDefault>

                    <TextDefault style={[styles.textDefault, styles.subtitle]}>
                        Acesso e senha
                    </TextDefault>

                    <TextDefault style={[styles.textDefault, styles.paragraph]}>
                        Para fazer login na plataforma, basta utilizar e-mail e
                        senha. A senha é criptografada e não é armazenada em
                        texto puro.
                    </TextDefault>

                    <TextDefault style={[styles.textDefault, styles.paragraph]}>
                        Caso encontre alguma falha de segurança ou tenha alguma
                        dúvida sobre a privacidade dos seus dados, entre em
                        contato através do e-mail{" "}
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

                    <TextDefault style={[styles.textDefault, styles.subtitle]}>
                        Exclusão de conta e problemas de acesso
                    </TextDefault>

                    <TextDefault style={[styles.textDefault, styles.paragraph]}>
                        Caso deseje excluir sua conta ou esteja enfrentando
                        problemas para acessar sua área logada, entre em contato
                        através do e-mail{" "}
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
                        . A exclusão da conta é permanente e irreversível, e
                        todos os dados associados à conta serão apagados.
                    </TextDefault>

                    <TextDefault style={[styles.textDefault, styles.paragraph]}>
                        A exclusão da conta inclui todos os dados pessoais, como
                        nome, e-mail, senha e imagem de perfil. Além disso,
                        todas as avaliações e curtidas feitas pela conta serão
                        removidas da plataforma.
                    </TextDefault>

                    <TextDefault style={[styles.textDefault, styles.paragraph]}>
                        As informações relacionadas diretamente aos álbuns,
                        músicas e artistas não podem ser removidas, pois fazem
                        parte da base de dados do Spotify, não são provenientes
                        da plataforma.
                    </TextDefault>

                    <TextDefault style={[styles.textDefault, styles.subtitle]}>
                        Questões legais
                    </TextDefault>

                    <TextDefault style={[styles.textDefault, styles.paragraph]}>
                        A Pitchforkd não se responsabiliza por conteúdos
                        postados por usuários, como avaliações, comentários e
                        imagens de perfil. A plataforma é um espaço aberto para
                        a comunidade compartilhar suas opiniões e experiências.
                    </TextDefault>

                    <TextDefault style={[styles.textDefault, styles.paragraph]}>
                        Contudo, a Pitchforkd se reserva o direito de remover
                        conteúdos que violem as regras da comunidade, como
                        conteúdos ofensivos, discriminatórios, impróprios ou que
                        violem direitos autorais.
                    </TextDefault>

                    <TextDefault style={[styles.textDefault, styles.paragraph]}>
                        Para relatar esses conteúdos, entre em contato através
                        do e-mail{" "}
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
                        . Sinta-se livre para descrever toda a situação e enviar{" "}
                        <Text style={styles.boldText}>links</Text> ou imagens.
                    </TextDefault>

                    <TextDefault style={[styles.textDefault, styles.paragraph]}>
                        A Pitchforkd não possui relação alguma com as
                        empresas/plataformas citadas acima, tampouco com as
                        marcas e produtos associados a elas. A plataforma é um
                        projeto independente e sem fins lucrativos.
                    </TextDefault>

                    <TextDefault style={[styles.textDefault, styles.subtitle]}>
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
                <View style={[styles.section, { padding: 16 }]}>
                    <TextDefault style={[styles.textDefault, styles.title]}>
                        Termos de uso
                    </TextDefault>
                    <TextDefault style={[styles.textDefault, styles.paragraph]}>
                        O uso da Pitchforkd é gratuito e aberto a todos os
                        usuários. Ao criar uma conta e utilizar a plataforma, o
                        usuário concorda em seguir as regras da comunidade e as
                        políticas de privacidade descritas acima.
                    </TextDefault>
                    <TextDefault style={[styles.textDefault, styles.paragraph]}>
                        O usuário é responsável por manter a confidencialidade de
                        sua senha e por todas as atividades que ocorram em sua
                        conta. O usuário concorda em notificar imediatamente a
                        Pitchforkd sobre qualquer uso não autorizado de sua conta ou
                        qualquer outra violação de segurança.
                    </TextDefault>
                    <TextDefault style={[styles.textDefault, styles.paragraph]}>
                        A Pitchforkd se reserva o direito de modificar ou encerrar
                        a plataforma a qualquer momento, sem aviso prévio. A
                        Pitchforkd não será responsável por qualquer modificação,
                        suspensão ou encerramento da plataforma.
                    </TextDefault>
                    <TextDefault style={[styles.textDefault, styles.paragraph]}>
                        A Pitchforkd não se responsabiliza por quaisquer danos
                        diretos, indiretos, incidentais, especiais ou consequenciais
                        decorrentes do uso ou da incapacidade de usar a plataforma,
                        mesmo que a Pitchforkd tenha sido avisada da possibilidade
                        de tais danos.
                    </TextDefault>
                    <TextDefault style={[styles.textDefault, styles.paragraph]}>
                        Estes termos de uso são regidos pelas leis do Brasil. Qualquer
                        disputa relacionada a estes termos de uso será resolvida
                        exclusivamente nos tribunais do Brasil.
                    </TextDefault>
                </View>
                <View style={[styles.section, { padding: 16 }]}>
                    <TextDefault style={[styles.textDefault, styles.title]}>
                        Atualizações
                    </TextDefault>
                    <TextDefault style={[styles.textDefault, styles.paragraph]}>
                        A Pitchforkd pode atualizar suas políticas de privacidade e
                        termos de uso a qualquer momento. As atualizações serão
                        publicadas nesta página, e o uso continuado da plataforma
                        após a publicação das atualizações constitui aceitação das
                        mudanças.
                    </TextDefault>
                    <TextDefault style={[styles.textDefault, styles.paragraph]}>
                        Recomendamos que os usuários revisem esta página regularmente
                        para se manterem informados sobre quaisquer mudanças nas
                        políticas de privacidade e termos de uso da Pitchforkd.
                    </TextDefault>
                </View>
                <View style={[{ height: 160 }]}/>
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
