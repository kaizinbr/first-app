
import { renderItem } from "@/components/home/banner/render-item";
import * as React from "react";
import { View, useWindowDimensions } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import Carousel from "react-native-reanimated-carousel";
 
const defaultDataWith6Colors = [
	"#B0604D",
	"#899F9C",
	"#B3C680",
	"#5C6265",
	"#F5D399",
	"#F1F1F1",
];

export const recommendedAlbums = [
    { id: "1", title: "O Menino Que Queria Ser Deus", artist: "Djonga", color: "#B0604D" },
    { id: "2", title: "Sobrevivendo no Inferno", artist: "Racionais MC's", color: "#899F9C" },
    { id: "3", title: "Astroworld", artist: "Travis Scott", color: "#B3C680" },
    { id: "4", title: "Blonde", artist: "Frank Ocean", color: "#5C6265" },
];
 
function BannerCarousel() {
	const progress = useSharedValue<number>(0);
	const { width } = useWindowDimensions();
 
	return (
		<View
			id="carousel-component"
			// dataSet={{ kind: "basic-layouts", name: "parallax" }}
		>
			<Carousel
				autoPlayInterval={2000}
				data={recommendedAlbums}
				loop={true}
				pagingEnabled={true}
				snapEnabled={true}
				style={{
					width: width,
					height: 258,
				}}
                width={width}
				mode="parallax"
				modeConfig={{
					parallaxScrollingScale: 0.9,
					parallaxScrollingOffset: 50,
				}}
				onProgressChange={(offsetProgress, absoluteProgress) => {
					progress.value = absoluteProgress;
				}}
				renderItem={renderItem({ rounded: true, colorFill: true })}
			/>
		</View>
	);
}
 
export default BannerCarousel;
 