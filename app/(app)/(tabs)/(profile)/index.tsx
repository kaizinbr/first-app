import { View, Text } from "react-native";
import { Image } from "expo-image";
import Button from "@/components/button";
import { authClient } from "@/lib/auth-client";
import api, { apiAuth } from "@/lib/api";
import { useEffect, useState } from "react";
import ProfileTabs from "@/components/profile/profile-tabs";
import { UserProfile } from "@/lib/types";
import { getColors } from "react-native-image-colors";
import { darkenColor } from "@/lib/util/workWithColors";
import { selectRightColor } from "@/lib/util/selectRightColor";
import { Palette } from "@/lib/types";

const blurhash =
    "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

export default function Index() {
    const { data: session } = authClient.useSession();

    const handleLogoff = async () => {
        await authClient.signOut();
    };

    const [profileData, setProfileData] = useState<UserProfile | null>(null);
    const [colors, setColors] = useState<Palette | any>(null);
    const [dominantColor, setDominantColor] = useState<string | null>(null);

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const response = await apiAuth("/me");
                console.log("Profile data fetched successfully:", response);
                setProfileData(response);

                getColors(response.avatar_url, {
                    fallback: "#000",
                    cache: true,
                    key: response.avatar_url,
                })
                    .then((colors) => {
                        const newColor = darkenColor(
                            selectRightColor(colors as any),
                            0.5,
                        );
                        console.log(
                            "Colors fetched for profile avatar:",
                            colors,
                        );
                        console.log("Darkened color:", newColor);
                        setDominantColor(newColor);
                        setColors(colors);
                    })
                    .catch(console.error);
            } catch (error) {
                console.error("Error fetching profile data:", error);
            }
        };
        fetchProfileData();
    }, []);

    return (
        <>
            {profileData && dominantColor && colors ? (
                <ProfileTabs
                    data={profileData}
                    dominantColor={dominantColor}
                    colors={colors}
                    itsUser={true}
                />
            ) : (
                <Text>Loading profile data...</Text>
            )}
            {/* <Button onPress={handleLogoff}>Logoff</Button> */}
        </>
    );
}
