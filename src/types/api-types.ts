import { Product, User } from "./type";

export type CustomError = {
  status: number;
  data: {
    message: string;
    success: boolean;
  };
};

export type MessageResponse = {
  success: boolean;
  message: string;
};

export type UserResponse = {
  success: boolean;
  user: User;
};

export type AllProductsResponse = {
  success: true;
  products: Product[];
};

export type CategoriesResponse = {
  success: true;
  categories: string[];
};

export type SearchProductsResponse = AllProductsResponse & {
  totalPage: number;
};

export type SearchProductsRequest = {
  price: number;
  page: number;
  category: string;
  search: string;
  sort: string;
};
