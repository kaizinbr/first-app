import { authClient } from "@/lib/auth-client";
import { Asset } from "@/lib/types";
import { ImagePickerAsset } from "expo-image-picker";

export default async function uploadImageToVercel(asset: ImagePickerAsset) {
    const formData = new FormData();

    console.log("Uploading image:", asset.uri);

    // ⚠️ O SEGREDO DO REACT NATIVE: O arquivo precisa ter esse formato exato
    const filename = asset.fileName!;
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : `image/jpeg`;

    formData.append("file", {
        uri: asset.uri,
        name: asset.fileName || "avatar.jpg",
        type: asset.mimeType || "image/jpeg",
    } as any);

    console.log("FormData prepared for upload:", formData);

    const cookies = authClient.getCookie();
    const headers = {
        Cookie: cookies,
        Accept: "application/json",
    };

    const response = await fetch(
        `https://api.kaizin.work/api/avatar/upload?filename=${filename}`,
        {
            method: "PUT",
            body: formData,
            credentials: "omit",
            headers,
        },
    );

    if (!response.ok) throw new Error("Falha ao subir a imagem");

    const data = await response.json();
    console.log("Upload response status:", data);
    return data.url; // O Vercel Blob devolve a URL pública
}
