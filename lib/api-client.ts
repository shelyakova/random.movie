import type { LoginSchema } from "@/lib/schemas/auth.schema";
import type { RegisterSchema } from "@/lib/schemas/auth.schema";

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

export { ApiError };
