module.exports = ({ config }) => {
    if (process.platform !== "win32") {
        return config;
    }

    return {
        ...config,
        plugins: [
            ...(config.plugins ?? []),
            [
                "expo-build-properties",
                {
                    android: {
                        cmakeVersion: "3.31.6",
                    },
                },
            ],
            "@react-native-community/datetimepicker",
        ],
    };
};