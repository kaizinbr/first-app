import axios from "axios";
import { authClient } from "@/lib/auth-client";

const api = axios.create({
    // baseURL: "https://api.kaizin.work/api",
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
    // const response = await fetch(`https://api.kaizin.work/api${path}`, {
    const response = await fetch(`http://192.168.18.152:3000/api${path}`, {
        headers,
        credentials: "omit",
    });
    const data = await response.json();
    return data;
}

export async function apiAuthPost(path: string, body: any) {
    const cookies = authClient.getCookie();
    const headers = {
        Cookie: cookies,
        "Content-Type": "application/json",
    };
    // const response = await fetch(`https://api.kaizin.work/api${path}`, {
    const response = await fetch(`http://192.168.18.152:3000/api${path}`, {
        method: "POST",
        headers,
        credentials: "omit",
        body: JSON.stringify(body),
    });
    const data = await response.json();
    return data;
}

export async function apiAuthPUT(path: string, body: any) {
    const cookies = authClient.getCookie();
    const headers = {
        Cookie: cookies,
        "Content-Type": "application/json",
    };
    // const response = await fetch(`https://api.kaizin.work/api${path}`, {
    const response = await fetch(`http://192.168.18.152:3000/api${path}`, {
        method: "PUT",
        headers,
        credentials: "omit",
        body: JSON.stringify(body),
    });
    const data = await response.json();
    return data;
}

export default api;
