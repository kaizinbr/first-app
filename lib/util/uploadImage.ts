import { fetch } from "expo/fetch";
import { File } from "expo-file-system";
import { authClient } from "@/lib/auth-client";
import { ImagePickerAsset } from "expo-image-picker";

export default async function uploadImageToVercel(asset: ImagePickerAsset) {
    const filename = asset.fileName || "avatar.jpg";

    // Aponta pro arquivo já existente no cache do ImagePicker
    const file = new File(asset.uri);

    const formData = new FormData();
    formData.append("file", file);

    const cookies = authClient.getCookie();
    const response = await fetch(
        `https://api.kaizin.work/api/avatar/upload?filename=${filename}`,
        {
            method: "PUT",
            body: formData,
            credentials: "omit",
            headers: {
                Cookie: cookies,
                Accept: "application/json",
            },
        },
    );

    if (!response.ok) throw new Error("Falha ao subir a imagem");

    const data = await response.json();
    return data.url;
}