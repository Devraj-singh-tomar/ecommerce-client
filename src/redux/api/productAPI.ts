import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  AllProductsResponse,
  CategoriesResponse,
  MessageResponse,
  NewProductRequest,
  SearchProductsRequest,
  SearchProductsResponse,
} from "../../types/api-types";

export const productAPI = createApi({
  reducerPath: "productApi",

  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/product/`,
  }),

  tagTypes: ["product"],

  endpoints: (builder) => ({
    // LATEST PRODUCT
    latestProducts: builder.query<AllProductsResponse, string>({
      query: () => "latest",
      providesTags: ["product"],
    }),

    // ALL PRODUCT's
    allProducts: builder.query<AllProductsResponse, string>({
      query: (id) => `admin-products?id=${id}`,
      providesTags: ["product"],
    }),

    // ALL CATEGORIE's
    categories: builder.query<CategoriesResponse, string>({
      query: () => `categories`,
      providesTags: ["product"],
    }),

    // SEARCH CATEGORIE's
    searchProducts: builder.query<
      SearchProductsResponse,
      SearchProductsRequest
    >({
      query: ({ category, page, price, search, sort }) => {
        let base = `all?search=${search}&page=${page}`;

        if (price) base += `&price=${price}`;
        if (sort) base += `&sort=${sort}`;
        if (category) base += `&category=${category}`;

        return base;
      },
      providesTags: ["product"],
    }),

    // NEW PRODUCT
    newProduct: builder.mutation<MessageResponse, NewProductRequest>({
      query: ({ formData, id }) => ({
        url: `new?id=${id}`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["product"],
    }),
  }),
});

export const {
  useLatestProductsQuery,
  useAllProductsQuery,
  useCategoriesQuery,
  useSearchProductsQuery,
  useNewProductMutation,
} = productAPI;
