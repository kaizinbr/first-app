import React from "react";
import { WebView } from "react-native-webview";

import { StyleSheet } from "react-native";

export default function HtmlContent({ html }: { html: string }) {
    const wrappedHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body {
            font-size: 16px;
            line-height: 1.5;
            margin: 0;
            padding: 0;
            font-family: -apple-system, Roboto, sans-serif;
          }
          p { margin: 0 0 12px 0; }
          h1,h2,h3 { margin: 0 0 10px 0; }
        </style>
      </head>
      <body>
        ${html}
      </body>
    </html>
  `;

    return (
        <WebView
            originWhitelist={["*"]}
            source={{ html: wrappedHtml }}
            style={styles.container}
            // nestedScrollEnabled
        />
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "transparent",
        padding: 12,
        fontSize: 24,
        height: 300,

    },
});
