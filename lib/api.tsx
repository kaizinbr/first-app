import axios from "axios";

const api = axios.create({
    baseURL: "http://192.168.18.152:3000/api",
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

export default api;
