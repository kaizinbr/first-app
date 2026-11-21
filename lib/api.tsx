import axios from "axios";
import { authClient } from "@/lib/auth-client";

const api = axios.create({
    baseURL: "https://api.kaizin.work/api",
    // baseURL: "http://192.168.1.4:3000/api",
    timeout: 10000,
    withCredentials: false,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(async (config) => {
    const cookie = await authClient.getCookie();

    if (cookie) {
        config.headers.set("Cookie", cookie);
    }

    return config;
});

export default api;