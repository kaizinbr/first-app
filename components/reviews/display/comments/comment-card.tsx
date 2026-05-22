import { EnrichedMarkdownText } from "react-native-enriched-markdown";
import { Linking, StyleSheet, View } from "react-native";

const markdown = `
**Teste negrito** *italico* e normal aaaaa ***e os dois***
`;

export default function CommentCard() {
    return (
        <View style={styles.container}>
            <EnrichedMarkdownText
                markdown={markdown}
                onLinkPress={({ url }) => Linking.openURL(url)}
                containerStyle={{
                    flex: 1,
                    fontSize: 15,
                    color: "#fff",
                }}
                markdownStyle={{
                    strong: { color: "#fff" },
                    em: { color: "#aaa" },
                    link: { color: "#8065ef", underline: false },
                    paragraph: { marginBottom: 0, color: "#fff" },
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#161718",
        padding: 16,
    },
    text: {
        flex: 1,
        fontSize: 15,
        color: "#fff",
        maxHeight: 100, // limita a altura máxima
        minHeight: 28,
    },
});
