import Button from "@/components/button";
import Input from "@/components/input";
import {
    Text,
    View,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Image,
    Platform,
    TextInput,
} from "react-native";

import { useState, useEffect } from "react";
import SearchInput from "@/components/search/search-input";
import SearchTabs from "@/components/search/search-result-tabs";
import { SearchResponse } from "@/lib/types";
import { ResultUserBtn } from "@/components/search/result-btns";
import PostEditor from "@/components/reviews/rich-text";

export default function Index() {
    const [searchQuery, setSearchQuery] = useState("");
    const [debounced, setDebounced] = useState("");
    const [results, setResults] = useState<SearchResponse | null>(null);
    const [type, setType] = useState<"tracks" | "artists" | "albums" | "users" | "reviews">("albums");
    const [loading, setLoading] = useState(false);



    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
                <View style={styles.main}>
                    <SearchInput results={results} setResults={setResults} type={type} />
                    <SearchTabs results={results} setType={setType} type={type} />
                </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: "#161718",
        // padding: 16,
        alignItems: "center",
        justifyContent: "flex-start",
        width: "100%",
    },
    searchInput: {
        width: "100%",
        padding: 12,
        borderWidth: 1,
        borderColor: "#b8b8b8",
        borderRadius: 8,
        marginVertical: 16,
        color: "#eeeeee",
    },
});
