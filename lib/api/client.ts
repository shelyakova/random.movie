import { useAuthStore } from "../stores";

export class ApiError extends Error {
    status: number;

    constructor(status: number, message: string) {
        super(message);
        this.name = "ApiError";
        this.status = status;
    }
}

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function postJson<TBody, TResponse>(path: string, body: TBody): Promise<TResponse> {
    const response = await fetch(`${API_BASE_URL}${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        throw new ApiError(response.status, `Request to ${path} failed with status ${response.status}`);
    }

    return response.json();
}

export async function authorizedFetch<TResponse>(path: string, options: RequestInit = {}): Promise<TResponse> {
    const token = useAuthStore.getState().token;

    const response = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            ...options.headers,
        },
    });

    if (response.status === 401) {
        useAuthStore.getState().clearToken();
    }

    if (!response.ok) {
        throw new ApiError(response.status, `Request to ${path} failed with status ${response.status}`);
    }

    return response.json();
}