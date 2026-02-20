import { View, Text } from "react-native";
import { Image } from 'expo-image';
import Button from "@/components/button";
import { authClient } from "@/lib/auth-client";
import api, { apiAuth } from "@/lib/api";
import { useEffect, useState } from "react";
import ProfileTabs from "@/components/profile/profile-tabs";

const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';


export default function Index() {
    const { data: session } = authClient.useSession();

    const handleLogoff = async () => {
        await authClient.signOut();
    };

    const [profileData, setProfileData] = useState<{
        id: string;
        name: string;
        username: string;
        lowername: string;
        bio: string;
        pronouns: string;
        site: string;
        created_at: string;
        verified: boolean;
        avatar_url: string;
    } | null>(null);

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const response = await apiAuth("/me");
                console.log("Profile data fetched successfully:", response);
                setProfileData(response);
            } catch (error) {
                console.error("Error fetching profile data:", error);
            }
        };
        fetchProfileData();
    }, []);

    return (
        <>
            <Text>Welcome, {session?.user.name}</Text>
            {profileData ? (
                <View>
                    <Text>Name: {profileData.name}</Text>
                    <Text>@{profileData.username}</Text>
                    <Text>Bio: {profileData.bio}</Text>
                    <Text>Pronouns: {profileData.pronouns}</Text>
                    <Text>Site: {profileData.site}</Text>
                    <Text>Joined: {new Date(profileData.created_at).toLocaleDateString()}</Text>
                    <Text>Verified: {profileData.verified ? "Yes" : "No"}</Text>
                    <Image source={profileData.avatar_url} style={{ width: 100, height: 100 }} />
                    
                </View>
            ) : (
                <Text>Loading profile data...</Text>
            )}
            <Button onPress={handleLogoff}>Logoff</Button>

            <ProfileTabs />
        </>
    );
}
