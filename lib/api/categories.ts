import type { CategorySchema } from "@/lib/schemas/category.shema";
import { authorizedFetch } from "./client";
import { Category } from "../types/category";

export function fetchCategories() {
    return authorizedFetch<Category[]>("/category");
}

export function createCategory(data: CategorySchema) {
    return authorizedFetch("/category/create", { method: "POST", body: JSON.stringify(data) });
}

export function editCategory(data: CategorySchema, categoryId: number) {
    return authorizedFetch(`/category/${categoryId}`, { method: "PATCH", body: JSON.stringify(data) });
}

export function deleteCategory(categoryId: number) {
    return authorizedFetch(`/category/${categoryId}`, { method: "DELETE" });
}