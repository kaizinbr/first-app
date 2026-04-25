import * as React from "react";
import {
    View,
    StyleSheet,
    RefreshControl,
    Text,
    Pressable,
} from "react-native";
import { Tabs, MaterialTabBar } from "react-native-collapsible-tab-view";
import { UserProfile, Palette } from "@/lib/types";
import { User, LockPassword, Letter, QuestionSquare,Logout   } from "@solar-icons/react-native/Bold";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Menu({ data }: { data: UserProfile }) {
    const insets = useSafeAreaInsets();

    const FIXED_BAR_HEIGHT = insets.top + 50;

    return (
        <View style={[styles.container, { paddingTop: FIXED_BAR_HEIGHT }]}>
            {/* <Text style={styles.title}>Conta</Text> */}
            <View style={styles.section}>
                <Pressable style={styles.button}>
                    <User size={24} color="#eee" />
                    <Text style={styles.textDefault}>Informações da conta</Text>
                </Pressable>
                <View style={styles.divider} />
                <Pressable style={styles.button}>
                    <LockPassword  size={24} color="#eee" />
                    <Text style={styles.textDefault}>Informações da conta</Text>
                </Pressable>
                <View style={styles.divider} />
                <Pressable style={styles.button}>
                    <Letter size={24} color="#eee" />
                    <Text style={styles.textDefault}>Informações da conta</Text>
                </Pressable>
            </View>
            <View style={styles.section}>
                <Pressable style={styles.button}>
                    <QuestionSquare  size={24} color="#eee" />
                    <Text style={styles.textDefault}>Informações da conta</Text>
                </Pressable>
            </View>
            <View style={styles.section}>
                <Pressable style={styles.button}>
                    <QuestionSquare  size={24} color="#eee" />
                    <Text style={styles.textDefault}>Informações da conta</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 16,
        padding: 16,
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
    section: {
        backgroundColor: "#1b1c1d",
        padding: 0,
        borderRadius: 12,
    },
    button: {
        backgroundColor: "transparent",
        padding: 16,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    divider: {
        height: 1,
        backgroundColor: "#2c2d2e",
        marginHorizontal: 16,
    },
});
