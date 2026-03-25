import { apiAuth, apiAuthPUT } from "@/lib/api";
import { UserProfile } from "@/lib/types";
import { useRouter, useFocusEffect } from "expo-router";
import { useEffect, useMemo, useState, useRef, useCallback } from "react";
import { AppState } from "react-native";
import {
    Image,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Palette } from "@/lib/types";
import { AltArrowLeft } from "@solar-icons/react-native/Outline";
import { Pen } from "@solar-icons/react-native/Bold";
import { Alert } from "react-native";
import { getColors } from "react-native-image-colors";
import Animated, {
    Extrapolation,
    interpolate,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useSharedValue,
} from "react-native-reanimated";

import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";

import { selectRightColor } from "@/lib/util/selectRightColor";
import { darkenColor } from "@/lib/util/workWithColors";

import uploadImageToVercel from "@/lib/util/uploadImage";

const USERNAME_MAX_LENGTH = 20;
const USERNAME_ALLOWED_REGEX = /^[a-zA-Z0-9._]+$/;

export default function EditProfile() {
    const insets = useSafeAreaInsets();
    const router = useRouter();

    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [pronouns, setPronouns] = useState("");
    const [bio, setBio] = useState("");
    const [site, setSite] = useState("");
    const [avatar, setAvatar] = useState<string | null>(null);
    const [avatarAsset, setAvatarAsset] =
        useState<ImagePicker.ImagePickerAsset | null>(null);

    const [message, setMessage] = useState<string | null>(null);
    const [canUpdate, setCanUpdate] = useState(false);
    const [colors, setColors] = useState<Palette | any>({
        vibrant: "#8065ef",
        muted: "#8065ef",
        darkVibrant: "#8065ef",
        dominant: "#8065ef",
    });

    const [profileData, setProfileData] = useState<UserProfile | null>(null);

    const [usedUsernames, setUsedUsernames] = useState<Set<string>>(new Set());
    const [isLoadingUsernames, setIsLoadingUsernames] = useState(false);
    const [usernameLookupError, setUsernameLookupError] = useState<
        string | null
    >(null);

    const [folowersCount, setFollowersCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);
    const [reviewsCount, setReviewsCount] = useState(0);

    const [shouldPickImage, setShouldPickImage] = useState(false);

    useEffect(() => {
        if (!shouldPickImage) return;
        setShouldPickImage(false);

        // Executa fora do contexto de render
        const timer = setTimeout(async () => {
            const permissionResult =
                await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (!permissionResult.granted) {
                Alert.alert(
                    "Permission required",
                    "Permission to access the media library is required.",
                );
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ["images"],
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
            });

            if (!result.canceled) {
                const asset = result.assets[0];
                const fileSizeMB = asset.fileSize
                    ? asset.fileSize / (1024 * 1024)
                    : 0;

                if (fileSizeMB > 2) {
                    Alert.alert(
                        "Imagem muito grande",
                        "Por favor, escolha uma imagem com menos de 2MB.",
                    );
                    return;
                }

                const resultColors = await getColors(asset.uri, {
                    fallback: "#000",
                    cache: true,
                    key: asset.uri,
                });
                setColors(resultColors);
                setAvatarAsset(asset);
                setAvatar(asset.uri);
            }
        }, 200);

        return () => clearTimeout(timer);
    }, [shouldPickImage]);

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
                setBio(response.bio || "");
                setAvatar(response.avatar_url);

                const colorsResult = await getColors(response.avatar_url, {
                    fallback: "#000",
                    cache: true,
                    key: response.avatar_url,
                });
                setColors(colorsResult);

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
        console.log("Validating username:", trimmedUsername);

        // if (!trimmedUsername) {
        //     return { status: "idle", message: null as string | null };
        // }

        if (trimmedUsername.length > USERNAME_MAX_LENGTH) {
            return {
                status: "error",
                message: `O username deve ter no máximo ${USERNAME_MAX_LENGTH} caracteres.`,
            };
        }

        if (trimmedUsername.length <= 0) {
            return {
                status: "error",
                message: `O username não pode ser vazio.`,
            };
        }

        if (trimmedUsername.length <= 3) {
            return {
                status: "error",
                message: `O username deve ter pelo menos 4 caracteres.`,
            };
        }

        if (
            trimmedUsername.startsWith(".") ||
            trimmedUsername.startsWith("_")
        ) {
            return {
                status: "error",
                message:
                    "O username nao pode começar com ponto (.) ou underscore (_).",
            };
        }

        if (trimmedUsername.endsWith(".") || trimmedUsername.endsWith("_")) {
            return {
                status: "error",
                message:
                    "O username nao pode terminar com ponto (.) ou underscore (_).",
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

    const isMounted = useRef(false);

    useFocusEffect(
        useCallback(() => {
            isMounted.current = true;
            return () => {
                isMounted.current = false;
            };
        }, []),
    );

    const pickImage = async () => {
        if (AppState.currentState !== "active") return;

        // Pequeno delay pra garantir que a Activity está pronta
        await new Promise((resolve) => setTimeout(resolve, 150));
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
            console.log("Saving profile with data:")
            let uploadedUrl = avatar;
            if (avatarAsset) {
                uploadedUrl = await uploadImageToVercel(avatarAsset);
                setAvatar(uploadedUrl);
            }

            const response = await apiAuthPUT("/me", {
                name,
                username,
                pronouns,
                bio,
                avatar: uploadedUrl,
            });

            // Alert.alert("Perfil atualizado!", "Suas informações foram salvas.");
            router.push("/(app)/(tabs)/(profile)");
            console.log("Profile updated successfully:", response);
        } catch (error) {
            console.error("Error updating profile:", error);
            Alert.alert(
                "Erro ao atualizar perfil",
                "Não foi possível salvar suas informações.",
            );
        }
    };

    const scrollY = useSharedValue(0);

    const HEADER_MAX_HEIGHT = 420; // Tamanho total da área do gradiente
    const HEADER_MIN_HEIGHT = insets.top + 50; // Tamanho da barrinha que vai ficar fixa
    const SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

    const onScroll = useAnimatedScrollHandler((event) => {
        scrollY.value = event.contentOffset.y;
    });

    // 1. A MÁGICA DO FUNDO: Rola junto com a tela!
    const backgroundStyle = useAnimatedStyle(() => {
        // Se rolar pra baixo (scroll positivo), o fundo sobe na mesma velocidade (-scrollY)
        // Se puxar a tela pra cima (bounce negativo), ele trava no 0 para não desgrudar do topo.
        const translateY = scrollY.value > 0 ? -scrollY.value : 0;

        // Dá uma leve esticada no gradiente se o usuário puxar a tela (overscroll)
        const scale =
            scrollY.value < 0
                ? 1 + Math.abs(scrollY.value) / HEADER_MAX_HEIGHT
                : 1;

        return {
            transform: [{ translateY }, { scale }],
        };
    });

    // 2. A MÁGICA DA HEADER FIXA: Nasce quando o gradiente vai embora
    const topBarStyle = useAnimatedStyle(() => {
        const opacity = interpolate(
            scrollY.value,
            [SCROLL_DISTANCE - 40, SCROLL_DISTANCE], // Começa a aparecer 40px antes de bater no topo
            [0, 1],
            Extrapolation.CLAMP,
        );
        return { opacity };
    });

    // 3. Animação da Capa e Título sumindo
    const headerContentStyle = useAnimatedStyle(() => {
        const opacity = interpolate(
            scrollY.value,
            [0, SCROLL_DISTANCE / 1.5], // Some um pouco antes da metade do caminho
            [1, 0],
            Extrapolation.CLAMP,
        );
        const scale = interpolate(
            scrollY.value,
            [-100, 0, SCROLL_DISTANCE],
            [1.1, 1, 0.8],
            Extrapolation.CLAMP,
        );
        return { opacity, transform: [{ scale }] };
    });

    return (
        
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
        <View style={styles.container}>
            {/* O FUNDO GRADIENTE ANIMADO */}
            <Animated.View
                style={[
                    styles.gradientContainer,
                    { height: HEADER_MAX_HEIGHT },
                    backgroundStyle,
                ]}
            >
                {/* Camada 1: A cor principal (Ex: Verde escuro) descendo na diagonal */}
                <LinearGradient
                    colors={[selectRightColor(colors), "#161718"]} // Troque pela cor dinâmica do álbum depois
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={StyleSheet.absoluteFill}
                />
                <LinearGradient
                    colors={[colors.muted, "#161718"]} // Troque pela cor dinâmica do álbum depois
                    start={{ x: 1, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={[StyleSheet.absoluteFill, { opacity: 0.5 }]}
                />
                <LinearGradient
                    colors={["transparent", "rgba(22, 23, 24, 1)"]}
                    start={{ x: 0.5, y: 0.2 }}
                    end={{ x: 0.5, y: 1 }}
                    style={StyleSheet.absoluteFill}
                />
            </Animated.View>

            <Animated.View
                style={[
                    styles.fixedTopBar,
                    {
                        height: HEADER_MIN_HEIGHT,
                        paddingTop: insets.top,
                        backgroundColor: darkenColor(
                            selectRightColor(colors),
                            0.7,
                        ),
                    },
                    topBarStyle,
                ]}
                pointerEvents="none" // Para não bloquear o clique de voltar
            >
                <Text style={styles.fixedTitle} numberOfLines={1}>
                    {name.length > 36 ? name.substring(0, 36) + "..." : name}
                </Text>
            </Animated.View>

            {/* BOTÃO VOLTAR */}

            <Pressable
                onPress={() => router.back()}
                style={[styles.backButton, { top: insets.top + 4 }]}
            >
                <AltArrowLeft size={32} color="#eee" />
            </Pressable>
            <Pressable
                onPress={saveProfile}
                style={{
                    position: "absolute",
                    right: 16,
                    top: insets.top + 4,
                    backgroundColor: "#8065ef",
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderRadius: 999,
                    zIndex: 11,
                }}
                // disabled={!isUsernameValid}
            >
                <Text style={{ color: "#eee", fontWeight: "bold" }}>Salvar</Text>
            </Pressable>

            <Animated.ScrollView
                onScroll={onScroll}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <View style={styles.wrapper}>
                        <Pressable
                            style={{
                                position: "relative",
                            }}
                            onPress={pickImage}
                        >
                            <Image
                                source={{ uri: avatar || undefined }}
                                style={[
                                    styles.avatar,
                                    {
                                        width: 112,
                                        height: 112,
                                        borderRadius: 112 * 0.306,
                                    },
                                ]}
                            />
                            <View
                                style={{
                                    position: "absolute",
                                    bottom: 8,
                                    right: -12,
                                    backgroundColor: "#8065ef",
                                    width: 32,
                                    height: 32,
                                    borderRadius: 16,
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <Pen size={16} color="#eee" />
                            </View>
                        </Pressable>
                        <View
                            style={[
                                styles.pronouns,
                                // { backgroundColor: dominantColor },
                            ]}
                        >
                            <Text style={styles.pronounstext}>{pronouns}</Text>
                        </View>
                    </View>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 4,
                        }}
                    >
                        <Text style={styles.name}>{name}</Text>{" "}
                    </View>
                    <Text style={styles.username}>@{username}</Text>
                    <View
                        style={{ flexDirection: "row", gap: 16, marginTop: 8 }}
                    >
                        <Text style={styles.textDefault}>
                            {reviewsCount} reviews
                        </Text>
                        <Text style={styles.textDefault}>
                            {followingCount} seguindo
                        </Text>
                        <Text style={styles.textDefault}>
                            {folowersCount} seguidores
                        </Text>
                    </View>
                    <View
                        style={[
                            styles.followBtn,
                            { backgroundColor: "#8065ef" },
                        ]}
                    >
                        <Text style={{ color: "#eee", fontWeight: "bold" }}>
                            Botão
                        </Text>
                    </View>
                </View>
                <View style={styles.lowerContent}>
                    <View style={styles.sec}>
                        <Text style={styles.title}>Nome</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Nome"
                            placeholderTextColor="#555"
                            value={name}
                            onChangeText={setName}
                        />
                        <Text style={styles.title}>Username</Text>
                        <TextInput
                            style={[styles.input, { marginBottom: 4 }]}
                            placeholder="Username"
                            placeholderTextColor="#555"
                            value={username}
                            onChangeText={setUsername}
                        />
                        {usernameValidation.message && (
                            <Text
                                style={{
                                    color:
                                        usernameValidation.status === "error"
                                            ? "#ff6b6b"
                                            : "#4ade80",
                                    marginBottom: 12,
                                }}
                            >
                                {usernameValidation.message}
                            </Text>
                        )}
                        <Text style={styles.title}>Pronomes</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Pronomes (ex: ele/lo, ela/la, elu/les)"
                            placeholderTextColor="#555"
                            value={pronouns}
                            onChangeText={setPronouns}
                        />
                        <Text style={styles.title}>Bio</Text>
                        <TextInput
                            style={[
                                styles.input,
                                {
                                    height: 164,
                                    textAlignVertical: "top",
                                },
                            ]}
                            placeholder="Bio"
                            placeholderTextColor="#555"
                            value={bio}
                            onChangeText={setBio}
                            maxLength={200}
                            multiline
                        />
                        <Text style={styles.title}>Site</Text>
                        <TextInput
                            style={[styles.input, { marginBottom: 0 }]}
                            placeholder="Site"
                            placeholderTextColor="#555"
                            value={site}
                            onChangeText={setSite}
                        />

                    </View>
                    ,
                </View>
                {/* <View style={styles.lowerContent}>
                    <View style={styles.sec}>
                        <Text style={styles.title}>Nome</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Nome"
                            placeholderTextColor="#555"
                            value={name}
                            onChangeText={setName}
                        />
                        <Text style={styles.title}>Username</Text>
                        <TextInput
                            style={[styles.input, { marginBottom: 4 }]}
                            placeholder="Username"
                            placeholderTextColor="#555"
                            value={username}
                            onChangeText={setUsername}
                        />
                        {usernameValidation.message && (
                            <Text
                                style={{
                                    color:
                                        usernameValidation.status === "error"
                                            ? "#ff6b6b"
                                            : "#4ade80",
                                    marginBottom: 12,
                                }}
                            >
                                {usernameValidation.message}
                            </Text>
                        )}
                        <Text style={styles.title}>Pronomes</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Pronomes (ex: ele/lo, ela/la, elu/les)"
                            placeholderTextColor="#555"
                            value={pronouns}
                            onChangeText={setPronouns}
                        />
                        <Text style={styles.title}>Bio</Text>
                        <TextInput
                            style={[
                                styles.input,
                                {
                                    height: 164,
                                    textAlignVertical: "top",
                                    marginBottom: 0,
                                },
                            ]}
                            placeholder="Bio"
                            placeholderTextColor="#555"
                            value={bio}
                            onChangeText={setBio}
                            maxLength={200}
                            multiline
                        />
                    </View>
                    ,
                </View> */}
                {/* <View style={{ height: 124 }} /> */}
            </Animated.ScrollView>
        </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    sec: {
        backgroundColor: "#222",
        padding: 16,
        borderRadius: 12,
    },

    gradientContainer: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 0,
    },
    fixedTopBar: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: "#1c494f",
        zIndex: 10,
        alignItems: "center",
        justifyContent: "center",
        borderBottomWidth: 1,
        borderBottomColor: "rgba(255,255,255,0.05)",
    },
    fixedTitle: { color: "#fff", fontSize: 16, fontWeight: "bold" },
    backButton: {
        position: "absolute",
        left: 16,
        zIndex: 11,
        width: 40,
        height: 40,
        justifyContent: "center",
    },

    lowerContent: {
        backgroundColor: "transparent",
        paddingHorizontal: 16,
    },
    title: {
        color: "#989898",
        fontSize: 14,
        fontWeight: "bold",
        marginBottom: 8,
    },
    header: {
        padding: 16,
        paddingTop: 84,
        paddingBottom: 32,
        width: "100%",
        alignItems: "center",
    },
    wrapper: {
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        flexDirection: "column",
        marginBottom: 28,
    },
    textDefault: {
        color: "#eee",
        fontSize: 14,
    },
    name: {
        fontWeight: "bold",
        color: "#eee",
        fontSize: 18,
        alignItems: "center",
        flexDirection: "row",
        gap: 4,
    },
    username: {
        color: "#b9b9b9",
        fontSize: 14,
    },
    pronouns: {
        color: "#929292",
        fontSize: 12,
        marginTop: 4,
        position: "absolute",
        bottom: -20,
        zIndex: 10,
        backgroundColor: "#8065ef",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    pronounstext: {
        color: "#eee",
        fontSize: 12,
        fontWeight: "bold",
    },
    avatar: {
        backgroundColor: "#bbb",
    },
    followBtn: {
        marginTop: 16,
        paddingHorizontal: 24,
        paddingVertical: 8,
        borderRadius: 9999,
        borderWidth: 1,
        borderColor: "#8065ef",
    },
    input: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        fontSize: 16,
        padding: 12,
        borderRadius: 12,
        color: "#eee",
        backgroundColor: "#2d2d2d",
        marginBottom: 12,
    },
});
