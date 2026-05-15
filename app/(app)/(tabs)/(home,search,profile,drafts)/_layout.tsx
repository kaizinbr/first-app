import { Stack } from "expo-router";

export const unstable_settings = {
    initialRouteName: "home",
    search: {
        initialRouteName: "search",
    },
    profile: {
        initialRouteName: "profile",
    },
};

export default function SharedLayout({ segment }: { segment: string }) {
    // A documentação oficial usa o segment para distinguir entre as rotas.
    // Você pode usar isso no futuro para dar estilos diferentes dependendo de onde o álbum foi aberto.

    /* Exemplo:
    if (segment === '(search)') {
        return <Stack screenOptions={{ animation: 'fade' }} />;
    }
    */

    // Por padrão, devolvemos o Stack limpo para empilhar os álbuns e perfis em todas as abas
    return <Stack screenOptions={{ headerShown: false }} />;
}
