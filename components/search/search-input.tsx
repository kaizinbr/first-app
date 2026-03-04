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
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useState, useEffect } from "react";
import api from "@/lib/api";

import { SearchResponse } from "@/lib/types";

export default function SearchInput({
    results,
    setResults,
    type,
}: {
    results: SearchResponse | null;
    setResults: (results: SearchResponse | null) => void;
    type: "tracks" | "artists" | "albums" | "users" | "reviews";
}) {
    const [searchQuery, setSearchQuery] = useState("");
    const [debounced, setDebounced] = useState("");
    const insets = useSafeAreaInsets();

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebounced(searchQuery);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    useEffect(() => {
        if (debounced.length === 0) return;

        console.log("Pesquisar por:", debounced);

        api.get(`/search?q=${debounced}`)
            .then((response) => {
                // console.log("Resultados da pesquisa:", response.data);
                setResults(response.data);
            })
            .catch((error) => {
                console.error("Erro na pesquisa:", error);
            });
    }, [debounced]);

    return (
        <View style={[styles.main, { paddingTop: insets.top }]}>
            <Input
                placeholder="Pesquisar..."
                style={styles.searchInput}
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor="#9c9c9c"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    main: {
        // flex: 1,
        paddingHorizontal: 16,
        alignItems: "center",
        justifyContent: "flex-start",
        width: "100%",
    },
    searchInput: {
        width: "100%",
        padding: 12,
        borderWidth: 1,
        borderColor: "#262626",
        backgroundColor: "#222222",
        borderRadius: 8,
        color: "#eeeeee",
    },
});
