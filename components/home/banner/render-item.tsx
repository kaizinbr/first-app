import { SlideItem } from "./slide-item";
import { ImageStyle, StyleProp } from "react-native";
import { CarouselRenderItem } from "react-native-reanimated-carousel";

interface Options {
    colorFill?: boolean;
    rounded?: boolean;
    style?: StyleProp<ImageStyle>;
}

export const renderItem =
    ({
        rounded = false,
        colorFill = false,
        style,
    }: Options = {}): CarouselRenderItem<any> =>
    // 3. AQUI! Nós extraímos o 'item' junto com o 'index'
    ({ item, index }) => (
        <SlideItem
            key={item.id || index}
            item={item} // 4. E passamos o item como propriedade para o SlideItem
            index={index}
            rounded={rounded}
            colorFill={colorFill}
            style={style}
        />
    );