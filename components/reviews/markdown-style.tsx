import type { MarkdownStyle } from "@expensify/react-native-live-markdown";
import { Platform } from "react-native";

const FONT_FAMILY_MONOSPACE = Platform.select({
    ios: "Courier",
    default: "monospace",
});

const FONT_FAMILY_EMOJI = Platform.select({
    ios: "System",
    android: "Noto Color Emoji",
    default: "System, Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji",
});

export const markdownStyle: MarkdownStyle = {
    syntax: {
        color: "gray",
    },
    link: {
        color: "blue",
    },
    h1: {
        fontSize: 25,
    },
    emoji: {
        fontSize: 20,
        fontFamily: FONT_FAMILY_EMOJI,
    },
    blockquote: {
        borderColor: "gray",
        borderWidth: 6,
        marginLeft: 6,
        paddingLeft: 6,
    },
    code: {
        fontFamily: FONT_FAMILY_MONOSPACE,
        fontSize: 20,
        color: "black",
        backgroundColor: "lightgray",
    },
    pre: {
        fontFamily: FONT_FAMILY_MONOSPACE,
        fontSize: 20,
        color: "black",
        backgroundColor: "lightgray",
    },
    mentionHere: {
        color: "green",
        backgroundColor: "lime",
    },
    mentionUser: {
        color: "blue",
        backgroundColor: "cyan",
    },
};
