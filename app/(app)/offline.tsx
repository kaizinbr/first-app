import Button from "@/components/button";
import TextDefault from "@/components/core/text-core";
import { useRouter } from "expo-router";
import {
    StyleSheet,
    View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";





const blurhash =
    "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

const USERNAME_MAX_LENGTH = 20;
const USERNAME_ALLOWED_REGEX = /^[a-zA-Z0-9._]+$/;

interface UsernamesResponse {
    usernames: {
        username: string;
        lowername: string;
    }[];
}

export default function Onboarding() {
    const insets = useSafeAreaInsets();
    const router = useRouter();

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <TextDefault style={styles.stepText}>
                Parece que você está offline. Verifique sua conexão com a
                internet e tente novamente.
            </TextDefault>
            <Button
                onPress={() => router.push("/(app)/(tabs)/(ahome)")}
                style={{ marginTop: 16 }}
            >
                Tentar novamente
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#161718",
        paddingHorizontal: 32,
    },
    step: {
        // flex: 1,
        top: 0,
        right: 0,
        left: 0,
        position: "absolute",
        marginTop: 24,
        paddingHorizontal: 16,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#161718",
        gap: 16,
    },
    stepText: {
        fontSize: 16,
        fontWeight: 500,
        color: "#eee",
        textAlign: "center",
    },

    stepper: {
        flex: 1,
        width: "100%",
        paddingHorizontal: 16,
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        // backgroundColor: "red",
    },
    stepperText: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#eee",
        textAlign: "center",
    },
    usernameInputContainer: {
        width: "100%",
        borderBottomWidth: 1,
        borderBottomColor: "#a6a6a6",
        flexDirection: "row",
        alignItems: "center",
        // justifyContent: "space-between",
    },
    usernameInput: {
        fontSize: 16,
        paddingVertical: 12,
        borderRadius: 8,
        color: "#eee",
    },
    helperText: {
        color: "#9f9f9f",
        textAlign: "right",
        fontSize: 12,
        right: 12,
        position: "absolute",
    },

    input: {
        width: "100%",
        borderBottomWidth: 1,
        borderBottomColor: "#a6a6a6",
        flexDirection: "row",
        alignItems: "center",
        fontSize: 16,
        fontFamily: "Walsheim",
        fontWeight: "400",
        padding: 12,
        borderRadius: 8,
        color: "#eee",
    },

    validationText: {
        width: "100%",
        marginTop: 2,
        color: "#9f9f9f",
        fontSize: 13,
    },
    validationError: {
        color: "#ff7b7b",
    },
    validationSuccess: {
        color: "#6dd17f",
    },

    profilePicture: {
        width: 128,
        height: 128,
        borderRadius: 128 * 0.306,
    },
    userName: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#eee",
    },
    userEmail: {
        fontSize: 16,
        color: "#9f9f9f",
    },
});
