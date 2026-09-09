import type { LoginSchema, RegisterSchema } from "@/lib/schemas/auth.schema";
import { postJson } from "./client";

interface AuthResponse {
    access_token: string;
}

export function registerUser(data: RegisterSchema) {
    return postJson<RegisterSchema, AuthResponse>("/auth/register", data);
}

export function loginUser(data: LoginSchema) {
    return postJson<LoginSchema, AuthResponse>("/auth/login", data);
}