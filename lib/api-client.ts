import type { LoginSchema } from "@/lib/schemas/auth.schema";
import type { RegisterSchema } from "@/lib/schemas/auth.schema";
import { useAuthStore } from "./stores/auth-store";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface AuthResponse {
    access_token: string;
    [key: string]: unknown;
}

class ApiError extends Error {
    status: number;

    constructor(status: number, message: string) {
        super(message);
        this.name = "ApiError";
        this.status = status;
    }
}

async function postJson<TBody>(path: string, body: TBody): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}${path}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        throw new ApiError(response.status, `Request to ${path} failed with status ${response.status}`);
    }

    return response.json();
}

export function registerUser(data: RegisterSchema): Promise<AuthResponse> {
    return postJson("/auth/register", data);
}

export function loginUser(data: LoginSchema): Promise<AuthResponse> {
    return postJson("/auth/login", data);
}

export async function fetchFilms(params: {
    search?: string;
    isWatched?: boolean;
    categoryIds?: number[];
    page?: number;
    limit?: number;
}) {
    const query = new URLSearchParams();
    if (params.search) query.set('search', params.search);
    if (params.isWatched !== undefined) query.set('isWatched', String(params.isWatched));
    if (params.categoryIds) params.categoryIds.forEach((id) => query.append('categoryIds', String(id)));
    if (params.page) query.set('page', String(params.page));
    if (params.limit) query.set('limit', String(params.limit));

    const token = useAuthStore.getState().token;

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/film?${query}`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
        const error = new Error('Failed to fetch films') as Error & { status: number };
        error.status = response.status;
        throw error;
    }

    return response.json();
}

export { ApiError };
