export interface Category {
  id: number;
  name: string;
  userId: number;
}

export interface CreateCategoryPayload {
  name: string;
}
