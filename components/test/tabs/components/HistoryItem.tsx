import { StyleSheet, Text, View } from "react-native";

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: "#eee",
    },

    // Left Icon
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#f5f5f5",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    iconText: {
        fontSize: 18,
    },

    // Middle
    content: {
        flex: 1,
    },
    title: {
        fontSize: 15,
        fontWeight: "500",
    },
    subtitle: {
        fontSize: 12,
        color: "#777",
        marginTop: 2,
    },
    status: {
        fontSize: 11,
        color: "#f39c12",
        marginTop: 2,
    },

    // Right
    rightContent: {
        alignItems: "flex-end",
    },
    amount: {
        fontSize: 15,
        fontWeight: "600",
    },
    credit: {
        color: "green",
    },
    debit: {
        color: "#000",
    },
    date: {
        fontSize: 12,
        color: "#999",
        marginTop: 2,
    },
});

const HistoryItem = ({ item }) => {
    const isCredit = item.amount > 0;

    return (
        <View style={styles.container}>
            {/* Left Icon */}
            <View style={styles.iconContainer}>
                <Text style={styles.iconText}>{item.icon}</Text>
            </View>

            {/* Middle Content */}
            <View style={styles.content}>
                <Text style={styles.title}>{item.title}</Text>

                <Text style={styles.subtitle}>{item.subtitle}</Text>

                {item.status === "pending" && (
                    <Text style={styles.status}>Pending</Text>
                )}
            </View>

            {/* Right Content */}
            <View style={styles.rightContent}>
                <Text
                    style={[
                        styles.amount,
                        isCredit ? styles.credit : styles.debit,
                    ]}
                >
                    {item.formattedAmount}
                </Text>

                <Text style={styles.date}>{item.displayDate}</Text>
            </View>
        </View>
    );
};

export default HistoryItem;
