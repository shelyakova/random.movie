import { authorizedFetch } from "./client";
import { Category, CreateCategoryPayload } from "../types/category";

export function fetchCategories() {
  return authorizedFetch<Category[]>("/category");
}

export function createCategory(data: CreateCategoryPayload) {
  return authorizedFetch<Category>("/category/create", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function editCategory(name: string, categoryId: number) {
  return authorizedFetch<Category>(`/category/${categoryId}`, {
    method: "PATCH",
    body: JSON.stringify(name),
  });
}

export function deleteCategory(categoryId: number) {
  return authorizedFetch<Category>(`/category/${categoryId}`, { method: "DELETE" });
}
