import { Text } from "react-native";
import Button from "@/components/button";
import { authClient } from "@/lib/auth-client";

export default function Index() {
    const { data: session } = authClient.useSession();

    const handleLogoff = async () => {
        await authClient.signOut();
    };

    return (
        <>
            <Text>Welcome, {session?.user.name}</Text>
            <Button onPress={handleLogoff}>Logoff</Button>
        </>
    );
}