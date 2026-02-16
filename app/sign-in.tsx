import { useState } from "react"; 
import { View, TextInput, Button } from "react-native";
import { authClient } from "@/lib/auth-client";
import { Link } from "expo-router";

export default function SignIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        const response = await authClient.signIn.email({
            email,
            password,
        })

        console.log("Login response:", response);
    };

    return (
        <View>
            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
            />
            <Button title="Login" onPress={handleLogin} />
            
                    <Link href="/sign-up" style={{ marginTop: 16 }}>
                        Não tem uma conta? Cadastre-se
                    </Link>
        </View>
    );
}