import { authorizedFetch } from "./client";
import { Category } from "../types/category";

export function fetchCategories() {
    return authorizedFetch<Category[]>("/category");
}

export function createCategory(name: string) {
    return authorizedFetch<Category>("/category/create", { method: "POST", body: JSON.stringify(name) });
}

export function editCategory(name: string, categoryId: number) {
    return authorizedFetch<Category>(`/category/${categoryId}`, { method: "PATCH", body: JSON.stringify(name) });
}

export function deleteCategory(categoryId: number) {
    return authorizedFetch<Category>(`/category/${categoryId}`, { method: "DELETE" });
}