import axios from "axios";
import { authClient } from "@/lib/auth-client";

const api = axios.create({
    baseURL: "http://192.168.18.152:3000/api",
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

export async function apiAuth(path: string) {
    const cookies = authClient.getCookie();
    const headers = {
        Cookie: cookies,
    };
    const response = await fetch(`http://192.168.18.152:3000/api${path}`, {
        headers,
        credentials: "omit",
    });
    const data = await response.json();
    return data;
}

export default api;
