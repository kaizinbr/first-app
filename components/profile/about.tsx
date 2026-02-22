import {
    View,
    Text,
    Image,
    Button,
    StyleSheet,
    ScrollView,
} from "react-native";
import { UserProfile, Review } from "@/lib/types";
import { useEffect, useState } from "react";
import api, { apiAuth } from "@/lib/api";
import { Tabs } from "react-native-collapsible-tab-view";

import FeedCard from "@/components/home/feed-card";

export default function AboutRoute({ data }: { data: UserProfile }) {


    
    return (
        <Tabs.ScrollView
            contentContainerStyle={{ flexGrow: 1, paddingTop: 324 }}
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.scene}>
                        <Text style={styles.textDefault}>Bio: {data.bio}</Text>
                        <Text style={styles.textDefault}>Pronouns: {data.pronouns}</Text>
                        <Text style={styles.textDefault}>Site: {data.site}</Text>
                        <Text style={styles.textDefault}>
                            Joined: {new Date(data.created_at).toLocaleDateString()}
                        </Text>
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
});
