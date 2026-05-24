import { StyleSheet, Text, View } from "react-native";

const styles = StyleSheet.create({
    container: {
        padding: 16,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: '#eee',
        borderRadius: 8,
        margin: 8,
        backgroundColor: '#fff',
        elevation: 2,
    },
    title: { fontSize: 14, color: '#666' },
    value: { fontSize: 18, fontWeight: '600' },
    change: { marginTop: 4, }
});

type Props = {
    item: {
        id: string;
        title: string;
        value: string;
        change: string;
    }
}

const OverviewItem: React.FC<Props> = ({ item }) => {
    return (
        <View
            style={styles.container}
        >
            <Text style={styles.title}>
                {item.title}
            </Text>

            <Text style={styles.value}>
                {item.value}
            </Text>

            <Text style={[
                styles.change,
                { color: item.change.startsWith('+') ? 'green' : 'red' },
            ]}>
                {item.change}
            </Text>
        </View>
    )
}
export default OverviewItem;
