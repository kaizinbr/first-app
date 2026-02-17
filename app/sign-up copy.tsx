import { useState } from "react"; 
import { View, TextInput, Button } from "react-native";
import { authClient } from "@/lib/auth-client";

export default function SignUp() {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");

    const handleSignUp = async () => {
        const response = await authClient.signUp.email({
            email,
            password,
            name,
        })

        console.log("Sign Up response:", response);
    };

    return (
        <View>
            <TextInput
                placeholder="Name"
                value={name}
                onChangeText={setName}
            />
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
            <Button title="Sign Up" onPress={handleSignUp} />
        </View>
    );
}