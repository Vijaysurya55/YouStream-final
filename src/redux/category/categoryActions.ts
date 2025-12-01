import { CATEGORY_SET } from "./categoryTypes.ts";

export const setSelectedCategory = (id: string | null, title: string | null) => ({
  type: CATEGORY_SET,
  payload: { id, title },
});