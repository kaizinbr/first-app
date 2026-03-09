import Button from "@/components/button";
import { apiAuth, apiAuthPUT } from "@/lib/api";
import { UserProfile } from "@/lib/types";
import { useEffect, useMemo, useState } from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    View,
    Image,
    Pressable,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Alert } from "react-native";

import { Palette } from "@/lib/types";
import { getColors } from "react-native-image-colors";

import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";

import { selectRightColor } from "@/lib/util/selectRightColor";
import { lightenColor, darkenColor } from "@/lib/util/workWithColors";

import uploadImageToVercel from "@/lib/util/uploadImage";

const blurhash =
    "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

const USERNAME_MAX_LENGTH = 20;
const USERNAME_ALLOWED_REGEX = /^[a-zA-Z0-9._]+$/;

interface UsernamesResponse {
    usernames: {
        username: string;
        lowername: string;
    }[];
}

export default function Onboarding() {
    const insets = useSafeAreaInsets();
    const [step, setStep] = useState(0);

    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [pronouns, setPronouns] = useState("");
    const [avatar, setAvatar] = useState<string | null>(null);
    const [avatarAsset, setAvatarAsset] =
        useState<ImagePicker.ImagePickerAsset | null>(null);

    const [message, setMessage] = useState<string | null>(null);
    const [canUpdate, setCanUpdate] = useState(false);
    const [colors, setColors] = useState<Palette | any>(null);

    const [profileData, setProfileData] = useState<UserProfile | null>(null);

    const [usedUsernames, setUsedUsernames] = useState<Set<string>>(new Set());
    const [isLoadingUsernames, setIsLoadingUsernames] = useState(false);
    const [usernameLookupError, setUsernameLookupError] = useState<
        string | null
    >(null);

    const handleUsernameChange = (text: string) => {
        // Remove spaces and special characters, allowing only letters, numbers, underscores, and dots
        const formattedUsername = text
            .replace(/[^a-zA-Z0-9._]/g, "")
            .slice(0, USERNAME_MAX_LENGTH);
        setUsername(formattedUsername);
    };

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const response = await apiAuth("/me");
                // console.log("Profile data fetched successfully:", response);
                setProfileData(response);
                setName(response.name);
                setUsername(response.username);
                setPronouns(response.pronouns || "");
                setAvatar(response.avatar_url);

                const tempColors = await getColors(response.avatar_url, {
                    fallback: "#000",
                    cache: true,
                    key: response.avatar_url,
                });
                setColors(tempColors);
            } catch (error) {
                console.error("Error fetching profile data:", error);
            }
        };
        fetchProfileData();
    }, []);

    useEffect(() => {
        const fetchUsernames = async () => {
            try {
                setIsLoadingUsernames(true);
                setUsernameLookupError(null);

                const response = await apiAuth("/users");
                // console.log("Usernames fetched successfully:", response);
                const usernames = response?.usernames ?? [];
                const normalizedUsernames = usernames
                    .map(
                        (item: { lowername?: string; username?: string }) =>
                            item.lowername || item.username?.toLowerCase(),
                    )
                    .filter((item: any): item is string => Boolean(item));

                setUsedUsernames(new Set(normalizedUsernames));
            } catch (error) {
                console.error("Error fetching usernames:", error);
                setUsernameLookupError(
                    "Nao foi possivel validar a disponibilidade do username.",
                );
            } finally {
                setIsLoadingUsernames(false);
            }
        };

        fetchUsernames();
    }, [username]);

    const usernameValidation = useMemo(() => {
        const trimmedUsername = username.trim();

        if (!trimmedUsername) {
            return { status: "idle", message: null as string | null };
        }

        if (trimmedUsername.length > USERNAME_MAX_LENGTH) {
            return {
                status: "error",
                message: `O username deve ter no máximo ${USERNAME_MAX_LENGTH} caracteres.`,
            };
        }

        if (!USERNAME_ALLOWED_REGEX.test(trimmedUsername)) {
            return {
                status: "error",
                message:
                    "Use apenas letras, numeros, underscore (_) e ponto (.).",
            };
        }

        if (isLoadingUsernames) {
            return {
                status: "loading",
                message: "Validando disponibilidade do username...",
            };
        }

        if (usernameLookupError) {
            return {
                status: "error",
                message: usernameLookupError,
            };
        }

        const currentLowername =
            profileData?.lowername ||
            profileData?.username?.toLowerCase() ||
            "";
        const requestedLowername = trimmedUsername.toLowerCase();
        const isCurrentUsername = requestedLowername === currentLowername;

        if (!isCurrentUsername && usedUsernames.has(requestedLowername)) {
            return {
                status: "error",
                message: "Esse username ja esta em uso.",
            };
        }

        return {
            status: "success",
            message: "Username disponivel.",
        };
    }, [
        isLoadingUsernames,
        profileData?.lowername,
        profileData?.username,
        usedUsernames,
        username,
        usernameLookupError,
    ]);

    const isUsernameValid = usernameValidation.status === "success";

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library.
        // Manually request permissions for videos on iOS when `allowsEditing` is set to `false`
        // and `videoExportPreset` is `'Passthrough'` (the default), ideally before launching the picker
        // so the app users aren't surprised by a system dialog after picking a video.
        // See "Invoke permissions for videos" sub section for more details.
        const permissionResult =
            await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permissionResult.granted) {
            Alert.alert(
                "Permission required",
                "Permission to access the media library is required.",
            );
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        // console.log(result);

        if (!result.canceled) {
            const asset = result.assets[0];

            // 3. Verifica o tamanho final (fileSize vem em bytes)
            // Se a foto for maior que 2MB (2 * 1024 * 1024), bloqueamos
            const fileSizeMB = asset.fileSize
                ? asset.fileSize / (1024 * 1024)
                : 0;

            if (fileSizeMB > 2) {
                Alert.alert(
                    "Imagem muito grande",
                    "Por favor, escolha uma imagem com menos de 2MB.",
                );
                return null;
            }

            const resultColors = await getColors(asset.uri, {
                fallback: "#000",
                cache: true,
                key: asset.uri,
            });
            setColors(resultColors);
            setAvatarAsset(asset);

            setAvatar(result.assets[0].uri);
        }
    };

    const saveProfile = async () => {
        try {
            // setIsLoading(true);
            let uploadedUrl = avatar;
            if (avatarAsset) {
                uploadedUrl = await uploadImageToVercel(avatarAsset);
                setAvatar(uploadedUrl);
            }

            const response = await apiAuthPUT("/me", {
                name,
                username,
                pronouns,
                avatar: uploadedUrl,
            });

            Alert.alert("Perfil atualizado!", "Suas informações foram salvas.");
            console.log("Profile updated successfully:", response);
        } catch (error) {
            console.error("Error updating profile:", error);
            Alert.alert(
                "Erro ao atualizar perfil",
                "Não foi possível salvar suas informações.",
            );
        }
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.stepper}>
                <View style={styles.step}>
                    <Text style={{ color: "#bfbfbf" }}>{step + 1}/5</Text>
                    <Text style={styles.stepText}>
                        Vamos começar definindo seu perfil
                    </Text>
                </View>

                {step === 0 && (
                    <>
                        <Text style={styles.stepperText}>
                            Qual é o seu nome?
                        </Text>

                        <TextInput
                            value={name}
                            onChangeText={setName}
                            placeholder="Digite seu nome"
                            placeholderTextColor="#9f9f9f"
                            style={styles.input}
                        />
                        <Button
                            onPress={() => setStep((prev) => prev + 1)}
                            disabled={!name.trim()}
                            className="mt-4"
                        >
                            Próximo
                        </Button>
                    </>
                )}
                {step === 1 && (
                    <>
                        <Text style={styles.stepperText}>
                            Escolha um nome de usuário
                        </Text>

                        <View style={styles.usernameInputContainer}>
                            <Text
                                style={{
                                    color: "#7b7b7b",
                                    fontSize: 16,
                                    marginLeft: 12,
                                }}
                            >
                                @
                            </Text>
                            <TextInput
                                value={username}
                                onChangeText={handleUsernameChange}
                                placeholder="Digite seu nome de usuário"
                                placeholderTextColor="#9f9f9f"
                                maxLength={USERNAME_MAX_LENGTH}
                                autoCapitalize="none"
                                autoCorrect={false}
                                style={styles.usernameInput}
                            />
                            <Text style={styles.helperText}>
                                {username.length}/{USERNAME_MAX_LENGTH}
                            </Text>
                        </View>
                        {usernameValidation.message && (
                            <Text
                                style={[
                                    styles.validationText,
                                    usernameValidation.status === "error" &&
                                        styles.validationError,
                                    usernameValidation.status === "success" &&
                                        styles.validationSuccess,
                                ]}
                            >
                                {usernameValidation.message}
                            </Text>
                        )}
                        <Button
                            onPress={() => setStep((prev) => prev + 1)}
                            disabled={!isUsernameValid}
                            className="mt-4"
                        >
                            Próximo
                        </Button>
                    </>
                )}
                {step === 2 && (
                    <>
                        <Text style={styles.stepperText}>
                            Como você gostaria de ser referido? (opcional)
                        </Text>

                        <TextInput
                            value={pronouns}
                            onChangeText={setPronouns}
                            placeholder="Digite seus pronomes"
                            placeholderTextColor="#9f9f9f"
                            style={styles.input}
                        />
                        <Button
                            onPress={() => setStep((prev) => prev + 1)}
                            // disabled={!name.trim()}
                            className="mt-4"
                        >
                            Próximo
                        </Button>
                    </>
                )}
                {step === 3 && (
                    <>
                        <Text style={styles.stepperText}>
                            Adicione uma foto de perfil
                        </Text>
                        {/* <Button
                            // title="Pick an image from camera roll"
                            onPress={pickImage}
                        >
                            selecione imagem
                        </Button> */}
                        {avatar && (
                            <Pressable onPress={pickImage}>
                                <Image
                                    source={{ uri: avatar }}
                                    style={styles.profilePicture}
                                />
                            </Pressable>
                        )}
                        <Button
                            onPress={() => setStep((prev) => prev + 1)}
                            disabled={!avatar}
                            className="mt-4"
                        >
                            Próximo
                        </Button>
                    </>
                )}

                {step === 4 && (
                    <View
                        style={{
                            alignItems: "center",
                            gap: 16,
                            width: "100%",
                            backgroundColor: "#fff",
                            borderRadius: 24,
                            paddingHorizontal: 12,
                            paddingVertical: 64,
                            overflow: "hidden",
                        }}
                    >
                        <LinearGradient
                            colors={[selectRightColor(colors), "#161718"]} // Troque pela cor dinâmica do álbum depois
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={StyleSheet.absoluteFill}
                        />
                        <LinearGradient
                            colors={["transparent", "rgb(29, 29, 29)"]}
                            start={{ x: 0.5, y: 0.2 }}
                            end={{ x: 0.5, y: 1 }}
                            style={StyleSheet.absoluteFill}
                        />
                        <View style={{ alignItems: "center", gap: 8 }}>
                            <Image
                                source={{ uri: avatar || undefined }}
                                // placeholder={blurhash}
                                style={styles.profilePicture}
                            />
                            <Text style={styles.userName}>{name}</Text>
                            <Text style={styles.userEmail}>@{username}</Text>
                        </View>
                        <Button onPress={saveProfile} className="mt-4">
                            Confirmar
                        </Button>
                        <Button
                            onPress={() => setStep((prev) => prev - 1)}
                            disabled={!avatar}
                            className="mt-4"
                        >
                            Voltar
                        </Button>
                    </View>
                )}
            </View>

            {/* <Image
                source={{ uri: profileData?.avatar_url || "https://via.placeholder.com/128" }}
                placeholder={blurhash}
                style={styles.profilePicture}
            />
            <Text style={styles.userName}>
                {profileData?.name || "User Name"}
            </Text>
            <Text style={styles.userEmail}>
                @{profileData?.username || session?.user?.email}
            </Text> */}
            {/* <Button title="Log Off" onPress={handleLogoff} className="mt-4" />
            {profileData && <ProfileTabs profileData={profileData} />} */}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#161718",
    },
    step: {
        // flex: 1,
        top: 0,
        right: 0,
        left: 0,
        position: "absolute",
        marginTop: 24,
        paddingHorizontal: 16,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#161718",
        gap: 16,
    },
    stepText: {
        fontSize: 16,
        fontWeight: 500,
        color: "#eee",
        textAlign: "center",
    },

    stepper: {
        flex: 1,
        width: "100%",
        paddingHorizontal: 16,
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        // backgroundColor: "red",
    },
    stepperText: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#eee",
        textAlign: "center",
    },
    usernameInputContainer: {
        width: "100%",
        borderBottomWidth: 1,
        borderBottomColor: "#a6a6a6",
        flexDirection: "row",
        alignItems: "center",
        // justifyContent: "space-between",
    },
    usernameInput: {
        fontSize: 16,
        paddingVertical: 12,
        borderRadius: 8,
        color: "#eee",
    },
    helperText: {
        color: "#9f9f9f",
        textAlign: "right",
        fontSize: 12,
        right: 12,
        position: "absolute",
    },

    input: {
        width: "100%",
        borderBottomWidth: 1,
        borderBottomColor: "#a6a6a6",
        flexDirection: "row",
        alignItems: "center",
        fontSize: 16,
        padding: 12,
        borderRadius: 8,
        color: "#eee",
    },

    validationText: {
        width: "100%",
        marginTop: 2,
        color: "#9f9f9f",
        fontSize: 13,
    },
    validationError: {
        color: "#ff7b7b",
    },
    validationSuccess: {
        color: "#6dd17f",
    },

    profilePicture: {
        width: 128,
        height: 128,
        borderRadius: 128 * 0.306,
    },
    userName: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#eee",
    },
    userEmail: {
        fontSize: 16,
        color: "#9f9f9f",
    },
});
