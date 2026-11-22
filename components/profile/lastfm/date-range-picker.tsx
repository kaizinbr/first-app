import { useState } from "react";
import { Platform, Pressable, View } from "react-native";
import DateTimePicker, {
    DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";
import TextDefault from "@/components/core/text-core";
import type { LastfmRange } from "@/lib/lastfm-types";

function DateField({
    label,
    value,
    minimumDate,
    onChange,
}: {
    label: string;
    value: Date;
    minimumDate?: Date;
    onChange: (date: Date) => void;
}) {
    return (
        <View
            style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
            }}
        >
            <TextDefault style={{ color: "#989898", fontSize: 14 }}>
                {label}
            </TextDefault>
            {Platform.OS === "ios" ? (
                <DateTimePicker
                    value={value}
                    mode="date"
                    display="compact"
                    themeVariant="dark"
                    minimumDate={minimumDate}
                    maximumDate={new Date()}
                    onChange={(_, date) => date && onChange(date)}
                />
            ) : (
                <Pressable
                    onPress={() =>
                        DateTimePickerAndroid.open({
                            value,
                            mode: "date",
                            minimumDate,
                            maximumDate: new Date(),
                            onChange: (_, date) => date && onChange(date),
                        })
                    }
                    style={{
                        paddingVertical: 6,
                        paddingHorizontal: 14,
                        borderRadius: 8,
                        backgroundColor: "#2a2b2c",
                    }}
                >
                    <TextDefault style={{ color: "#eee", fontSize: 14 }}>
                        {value.toLocaleDateString("pt-BR")}
                    </TextDefault>
                </Pressable>
            )}
        </View>
    );
}

/** Data inicial e final. O intervalo vai de 00:00 do primeiro dia a 23:59:59 do último, no fuso do aparelho. */
export default function DateRangePicker({
    minimumDate,
    onApply,
}: {
    minimumDate?: Date;
    onApply: (range: LastfmRange) => void;
}) {
    const [start, setStart] = useState(
        () => new Date(Date.now() - 30 * 86_400_000),
    );
    const [end, setEnd] = useState(() => new Date());
    const [error, setError] = useState("");

    function apply() {
        const from = Math.floor(
            new Date(start.getFullYear(), start.getMonth(), start.getDate()).getTime() / 1000,
        );
        const to = Math.floor(
            new Date(end.getFullYear(), end.getMonth(), end.getDate(), 23, 59, 59).getTime() / 1000,
        );
        if (to <= from) {
            setError("A data inicial precisa ser antes da final.");
            return;
        }
        if (to - from > 366 * 86_400) {
            setError("O intervalo pode ter no máximo 1 ano. Para mais, use Todo o tempo.");
            return;
        }
        setError("");
        onApply({ from, to });
    }

    return (
        <View
            style={{
                backgroundColor: "#212223",
                padding: 16,
                borderRadius: 18,
                gap: 12,
            }}
        >
            <DateField
                label="De"
                value={start}
                minimumDate={minimumDate}
                onChange={setStart}
            />
            <DateField
                label="Até"
                value={end}
                minimumDate={minimumDate}
                onChange={setEnd}
            />
            {error !== "" && (
                <TextDefault style={{ color: "#ff6b6b", fontSize: 12 }}>
                    {error}
                </TextDefault>
            )}
            <Pressable
                onPress={apply}
                style={{
                    alignItems: "center",
                    paddingVertical: 10,
                    borderRadius: 32,
                    backgroundColor: "#8065ef",
                }}
            >
                <TextDefault
                    style={{ color: "#fff", fontSize: 14, fontWeight: "700" }}
                >
                    Aplicar
                </TextDefault>
            </Pressable>
        </View>
    );
}
