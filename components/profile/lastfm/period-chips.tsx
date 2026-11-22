import { Pressable, ScrollView } from "react-native";
import TextDefault from "@/components/core/text-core";
import type { LastfmPeriod, LastfmRange } from "@/lib/lastfm-types";

function Chip({
    active,
    onPress,
    children,
}: {
    active: boolean;
    onPress: () => void;
    children: string;
}) {
    return (
        <Pressable
            onPress={onPress}
            style={{
                paddingVertical: 6,
                paddingHorizontal: 14,
                borderRadius: 32,
                borderWidth: 1,
                borderColor: "#282828",
                backgroundColor: active ? "#8065ef" : "transparent",
            }}
        >
            <TextDefault
                style={{ color: active ? "#eee" : "#eee", fontSize: 12 }}
            >
                {children}
            </TextDefault>
        </Pressable>
    );
}

export default function PeriodChips({
    range,
    custom,
    onSelectPeriod,
    onSelectCustom,
}: {
    range: LastfmRange;
    custom: boolean;
    onSelectPeriod: (period: LastfmPeriod) => void;
    onSelectCustom: () => void;
}) {
    const isActive = (period: LastfmPeriod) =>
        !custom && "period" in range && range.period === period;

    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8, paddingHorizontal: 16 }}
        >
            <Chip active={isActive("7day")} onPress={() => onSelectPeriod("7day")}>
                7 dias
            </Chip>
            <Chip active={isActive("1month")} onPress={() => onSelectPeriod("1month")}>
                30 dias
            </Chip>
            <Chip active={isActive("3month")} onPress={() => onSelectPeriod("3month")}>
                3 meses
            </Chip>
            <Chip active={isActive("6month")} onPress={() => onSelectPeriod("6month")}>
                6 meses
            </Chip>
            <Chip active={isActive("12month")} onPress={() => onSelectPeriod("12month")}>
                12 meses
            </Chip>
            <Chip active={isActive("overall")} onPress={() => onSelectPeriod("overall")}>
                Todo o tempo
            </Chip>
            <Chip active={custom} onPress={onSelectCustom}>
                Personalizado
            </Chip>
        </ScrollView>
    );
}
