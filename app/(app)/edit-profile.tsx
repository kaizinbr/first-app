import { apiAuth, apiAuthPUT } from "@/lib/api";
import { UserProfile } from "@/lib/types";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    BottomSheetBackdrop,
    BottomSheetModal,
    BottomSheetView,
    useBottomSheetModal,
} from "@gorhom/bottom-sheet";
import { FlatGrid } from "react-native-super-grid";
import {
    AppState,
    Image,
    KeyboardAvoidingView,
    LayoutChangeEvent,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
    ActivityIndicator,
    FlatList,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import EditAlbunsModal from "@/components/profile/edit/edit-albuns-modal";
import EditArtistsModal from "@/components/profile/edit/edit-artists-modal";
import LyricsModal from "@/components/profile/edit/lyrics-modal";
import { Palette } from "@/lib/types";
import { Pen } from "@solar-icons/react-native/Bold";
import { AltArrowLeft } from "@solar-icons/react-native/Outline";
import { AddCircle } from "@solar-icons/react-native/Bold";
import { Alert } from "react-native";
import { getColors } from "react-native-image-colors";
import Animated, {
    Extrapolation,
    interpolate,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useSharedValue,
} from "react-native-reanimated";

import hexToRgb from "@/lib/util/hexToRgb";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";

import { selectRightColorDominant } from "@/lib/util/selectRightColor";
import {
    darkenColor,
    getBannerColors,
    lightenColor,
} from "@/lib/util/workWithColors";

import uploadImageToVercel from "@/lib/util/uploadImage";

import EditFavAlbuns from "@/components/profile/edit/edit-fav-albuns";
import EditFavArtists from "@/components/profile/edit/edit-fav-artists";
import LyricsCard from "@/components/profile/lyrics-card";

const USERNAME_MAX_LENGTH = 20;
const USERNAME_ALLOWED_REGEX = /^[a-zA-Z0-9._]+$/;
const ALBUM_GRID_GAP = 8;
const ALBUM_GRID_MIN_ITEM_SIZE = 80;

interface SavedLyrics {
    trackId: string;
    trackName: string;
    artistNames: string;
    albumArt: string;
    lines: { startTimeMs: string; words: string }[]; // todas as linhas
    selectedIndexes: number[];
    color: string;
}

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
    const [albuns, setAlbuns] = useState<any[]>([]);
    const [artists, setArtists] = useState<any[]>([]);
    const [lyrics, setLyrics] = useState<SavedLyrics | null>(null);

    const [albumGridWidth, setAlbumGridWidth] = useState(0);

    const [message, setMessage] = useState<string | null>(null);
    const [canUpdate, setCanUpdate] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [colors, setColors] = useState<Palette | any>({
        vibrant: "#8065ef",
        muted: "#8065ef",
        darkVibrant: "#8065ef",
        dominant: "#8065ef",
    });
    const [mainColor, setMainColor] = useState("#8065ef");

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
                const bannerColors = getBannerColors(resultColors);
                setColors(bannerColors);
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
            setIsLoading(true);
            try {
                const response = await apiAuth("/me");
                // console.log("Profile data fetched successfully:", response);
                setProfileData(response);
                setName(response.name);
                setUsername(response.username);
                setPronouns(response.pronouns || "");
                setBio(response.bio || "");
                setAvatar(response.avatar_url);
                setSite(response.site || "");
                setFollowersCount(response.followers_count || 0);
                setFollowingCount(response.following_count || 0);
                setReviewsCount(response.reviews_count || 0);
                setAlbuns(response.albuns || []);
                setArtists(response.artists || []);

                setLyrics(response.lyrics);
                console.log(response.lyrics);

                const colorsResult = await getColors(response.avatar_url, {
                    fallback: "#000",
                    cache: true,
                    key: response.avatar_url,
                });
                const bannerColors = getBannerColors(colorsResult);
                setColors(bannerColors);

                setMainColor(selectRightColorDominant(colorsResult as any));
                console.log("Colors extracted from avatar:", bannerColors);
                setIsLoading(false);

                // const tempColors = await getColors(response.avatar_url, {
                //     fallback: "#000",
                //     cache: true,
                //     key: response.avatar_url,
                // });
                // setColors(tempColors);
            } catch (error) {
                console.error("Error fetching profile data:", error);
                setIsLoading(false);
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

    const albumGrid = useMemo(() => {
        if (albumGridWidth <= 0) {
            return {
                columns: 1,
                itemSize: ALBUM_GRID_MIN_ITEM_SIZE,
            };
        }

        const columns = Math.max(
            1,
            Math.floor(
                (albumGridWidth + ALBUM_GRID_GAP) /
                    (ALBUM_GRID_MIN_ITEM_SIZE + ALBUM_GRID_GAP),
            ),
        );
        const totalGap = ALBUM_GRID_GAP * (columns - 1);
        const itemSize = (albumGridWidth - totalGap) / columns;

        return {
            columns,
            itemSize,
        };
    }, [albumGridWidth]);

    const handleAlbumsGridLayout = useCallback((event: LayoutChangeEvent) => {
        const { width } = event.nativeEvent.layout;
        setAlbumGridWidth((currentWidth) => {
            if (Math.abs(currentWidth - width) < 0.5) return currentWidth;
            return width;
        });
    }, []);

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

            const prevImgColors = getBannerColors(resultColors);
            setColors(prevImgColors);
            // console.log(prevImgColors)
            setAvatarAsset(asset);

            setAvatar(result.assets[0].uri);
        }
    };

    const saveProfile = async () => {
        try {
            setIsLoading(true);
            console.log("Saving profile with data:");
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
                site,
                albuns,
                artists,
                lyrics,
            });

            // Alert.alert("Perfil atualizado!", "Suas informações foram salvas.");
            setIsLoading(false);
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

    const backgroundStyle = useAnimatedStyle(() => {
        // Se rolar pra baixo (scroll positivo), o fundo sobe na mesma velocidade (-scrollY)
        // Se puxar a tela pra cima (bounce negativo), ele trava no 0 para não desgrudar do topo.
        const translateY = scrollY.value > 0 ? -scrollY.value : 0;

        const scale =
            scrollY.value < 0
                ? 1 + Math.abs(scrollY.value) / HEADER_MAX_HEIGHT
                : 1;

        return {
            transform: [{ translateY }, { scale }],
        };
    });

    const topBarStyle = useAnimatedStyle(() => {
        const opacity = interpolate(
            scrollY.value,
            [SCROLL_DISTANCE - 40, SCROLL_DISTANCE], // Começa a aparecer 40px antes de bater no topo
            [0, 1],
            Extrapolation.CLAMP,
        );
        return { opacity };
    });

    const [showAlbunsModal, setShowAlbunsModal] = useState(false);
    const [showArtistsModal, setShowArtistsModal] = useState(false);
    const [showLyricsModal, setShowLyricsModal] = useState(false);

    const bottomSheetRef = useRef<BottomSheetModal>(null);
    const snapPoints = useMemo(() => ["50%", "85%", "100%"], []);
    const openSheet = useCallback(() => {
        bottomSheetRef.current?.present();
    }, []);

    const { dismiss } = useBottomSheetModal();

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
                    <LinearGradient
                        colors={[darkenColor(mainColor, 1.5), "#161718"]}
                        style={StyleSheet.absoluteFill}
                    />

                    {/* blob principal - vem da cor dominante do álbum */}
                    <View
                        style={[
                            styles.blob,
                            {
                                backgroundColor: selectRightColorDominant(colors),
                                width: 320,
                                height: 320,
                                top: -80,
                                left: -60,
                                filter: [{ blur: 90 }],
                            },
                        ]}
                    />

                    {/* blob secundário - complementar mais frio */}
                    <View
                        style={[
                            styles.blob,
                            {
                                backgroundColor: lightenColor(mainColor, 1),
                                width: 260,
                                height: 260,
                                bottom: 170,
                                right: -80,
                                filter: [{ blur: 70 }],
                            },
                        ]}
                    />
                    <View
                        style={[
                            styles.blob,
                            {
                                backgroundColor: lightenColor(mainColor, 0.7),
                                width: 160,
                                height: 160,
                                top: 110,
                                right: 80,
                                filter: [{ blur: 70 }],
                            },
                        ]}
                    />
                    <View
                        style={[
                            styles.blob,
                            {
                                backgroundColor: lightenColor(mainColor, 0.8),
                                width: 160,
                                height: 160,
                                top: 80,
                                left: 80,
                                filter: [{ blur: 70 }],
                            },
                        ]}
                    />

                    {/* vinheta no topo pra escurecer onde fica o header */}
                    <LinearGradient
                        colors={["rgba(0,0,0,0.6)", "transparent"]}
                        style={[StyleSheet.absoluteFill, { height: 180 }]}
                    />
                </Animated.View>
                <Animated.View
                    style={[
                        styles.fixedTopBar,
                        {
                            height: HEADER_MIN_HEIGHT,
                            paddingTop: insets.top,
                            backgroundColor: colors[0],
                        },
                        topBarStyle,
                    ]}
                    pointerEvents="none" // Para não bloquear o clique de voltar
                >
                    <Text style={styles.fixedTitle} numberOfLines={1}>
                        Perfil de{" "}
                        {name.length > 36
                            ? name.substring(0, 36) + "..."
                            : name}
                    </Text>
                    {colors.length > 0 && (
                        <LinearGradient
                            colors={[
                                `rgba(0,0,0, 0)`,
                                darkenColor(colors[0], 1.2),
                            ]}
                            style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                right: 0,
                                height: HEADER_MIN_HEIGHT,
                                zIndex: -1,
                            }}
                        />
                    )}
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
                    <Text style={{ color: "#eee", fontWeight: "bold" }}>
                        Salvar
                    </Text>
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
                            {pronouns ? (
                                <View style={[styles.pronouns]}>
                                    <Text style={styles.pronounstext}>
                                        {pronouns}
                                    </Text>
                                </View>
                            ) : null}
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
                            style={{
                                flexDirection: "row",
                                gap: 16,
                                marginTop: 8,
                            }}
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
                            <Text style={styles.headTitle}>Perfil</Text>
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
                                            usernameValidation.status ===
                                            "error"
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
                    </View>
                    <View style={styles.lowerContent}>
                        <Pressable
                            style={styles.sec}
                            onPress={() => setShowLyricsModal(true)}
                        >
                            <Text style={styles.title}>Letras</Text>

                            {lyrics ? (
                                <LyricsCard
                                    saved={lyrics}
                                    setLyrics={setLyrics}
                                />
                            ) : (
                                <Text style={{ color: "#555" }}>
                                    Adicione suas letras favoritas!
                                </Text>
                            )}
                        </Pressable>
                    </View>
                    <View style={styles.lowerContent}>
                        <Pressable
                            style={styles.sec}
                            onPress={() => setShowAlbunsModal(true)}
                        >
                            <Text style={styles.title}>Álbuns Favoritos</Text>
                            {albuns.length === 0 && (
                                <Text style={{ color: "#555" }}>
                                    Adicione seus álbuns favoritos!
                                </Text>
                            )}

                            <FlatGrid
                                itemDimension={70}
                                data={albuns}
                                renderItem={({ item }) => (
                                    <Image
                                        source={{ uri: item.src }}
                                        style={{
                                            width: "100%",
                                            // height: 80,
                                            aspectRatio: 1,
                                            flex: 1,
                                            borderRadius: 8,
                                        }}
                                    />
                                )}
                                style={{ padding: 0 }}
                                contentContainerStyle={{
                                    padding: 0,
                                    margin: 0,
                                }}
                            />
                        </Pressable>
                    </View>
                    <View style={styles.lowerContent}>
                        <Pressable
                            style={styles.sec}
                            onPress={() => setShowArtistsModal(true)}
                        >
                            <Text style={styles.title}>Artistas Favoritos</Text>
                            {artists.length === 0 && (
                                <Text style={{ color: "#555" }}>
                                    Adicione seus artistas favoritos!
                                </Text>
                            )}

                            <FlatGrid
                                itemDimension={70}
                                data={artists}
                                renderItem={({ item }) => (
                                    <Image
                                        source={{ uri: item.src }}
                                        style={{
                                            width: "100%",
                                            // height: 80,
                                            aspectRatio: 1,
                                            flex: 1,
                                            borderRadius: 999,
                                        }}
                                    />
                                )}
                                style={{ padding: 0 }}
                                contentContainerStyle={{
                                    padding: 0,
                                    margin: 0,
                                }}
                            />
                        </Pressable>
                    </View>
                </Animated.ScrollView>

                <EditAlbunsModal
                    albuns={albuns}
                    setAlbuns={setAlbuns}
                    visible={showAlbunsModal}
                    title="Apagar avaliação"
                    message="Essa ação não pode ser desfeita."
                    confirmLabel="Apagar"
                    cancelLabel="Cancelar"
                    confirmDestructive
                    onConfirm={() => {
                        // handleDelete();
                        setShowAlbunsModal(false);
                    }}
                    onCancel={() => setShowAlbunsModal(false)}
                />
                <EditArtistsModal
                    artists={artists}
                    setArtists={setArtists}
                    visible={showArtistsModal}
                    title="Apagar avaliação"
                    message="Essa ação não pode ser desfeita."
                    confirmLabel="Apagar"
                    cancelLabel="Cancelar"
                    confirmDestructive
                    onConfirm={() => {
                        // handleDelete();
                        setShowArtistsModal(false);
                    }}
                    onCancel={() => setShowArtistsModal(false)}
                />
                <LyricsModal
                    visible={showLyricsModal}
                    savedLyrics={lyrics}
                    onConfirm={(saved) => {
                        setLyrics(saved);
                        setShowLyricsModal(false);
                    }}
                    onCancel={() => setShowLyricsModal(false)}
                />
                {/* <BottomSheetModal
                    ref={bottomSheetRef}
                    index={1}
                    snapPoints={snapPoints}
                    enablePanDownToClose
                    topInset={insets.top}
                    // containerStyle={{ zIndex: 1000 }}
                    backgroundStyle={{ backgroundColor: "#161718" }}
                    handleIndicatorStyle={{ backgroundColor: "#555" }}
                    backdropComponent={(props) => (
                        <BottomSheetBackdrop
                            {...props}
                            disappearsOnIndex={-1}
                            appearsOnIndex={0}
                        />
                    )}
                >
                    <BottomSheetView>
                        <EditFavAlbuns albuns={albuns} setAlbuns={setAlbuns} />
                    </BottomSheetView>
                </BottomSheetModal> */}
            </View>
            {isLoading && (
                <View
                    style={[
                        StyleSheet.absoluteFill,
                        {
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: "rgba(0,0,0,0.5)",
                            zIndex: 999,
                        },
                    ]}
                >
                    <ActivityIndicator size="large" color="#8065ef" />
                </View>
            )}
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    sec: {
        backgroundColor: "#1b1c1d",
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
        paddingTop: 16,
    },
    title: {
        color: "#989898",
        fontSize: 14,
        fontWeight: "bold",
        marginBottom: 8,
    },
    headTitle: {
        color: "#eee",
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 12,
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
        backgroundColor: "#282828",
        marginBottom: 12,
    },
    blob: {
        position: "absolute",
        borderRadius: 999,
        opacity: 0.6,
        // blur no RN é via style diretamente no iOS
        // no Android precisa de uma alternativa
    },
});
