import { authClient } from "@/lib/auth-client";
import { File } from "expo-file-system";
import { ImagePickerAsset } from "expo-image-picker";
import { fetch } from "expo/fetch";

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

    if (!response.data.ok) throw new Error("Falha ao subir a imagem");

    const data = await response.data.json();
    return data.url;
}
