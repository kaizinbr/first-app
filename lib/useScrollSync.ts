import { FlatListProps } from "react-native";
import { ScrollPair } from "@/lib/types";
import { HeaderConfig } from "@/lib/types";

const useScrollSync = (
  scrollPairs: ScrollPair[],
  headerConfig: HeaderConfig
) => {
  const { heightExpanded, heightCollapsed } = headerConfig;
  const headerDiff = heightExpanded - heightCollapsed;

  const sync: NonNullable<FlatListProps<any>["onMomentumScrollEnd"]> = (
    event
  ) => {
    const y = event.nativeEvent.contentOffset.y;
    syncToOffset(y);
  };

  /** Sync all lists to the same offset (e.g. when switching tabs). */
  const syncToOffset = (y: number) => {
    for (const { list, position } of scrollPairs) {
      const scrollPosition = position.value ?? 0;
      if (scrollPosition > headerDiff && y > headerDiff) continue;
      list.current?.scrollToOffset({
        offset: Math.min(y, headerDiff),
        animated: false,
      });
    }
  };

  return { sync, syncToOffset };
};

export default useScrollSync;