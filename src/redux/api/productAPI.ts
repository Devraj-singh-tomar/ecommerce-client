import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { AllProductsResponse } from "../../types/api-types";

export const productAPI = createApi({
  reducerPath: "productApi",

  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/product/`,
  }),

  endpoints: (builder) => ({
    // LATEST PRODUCT
    latestProducts: builder.query<AllProductsResponse, string>({
      query: () => "latest",
    }),

    // ALL PRODUCT's
    allProducts: builder.query<AllProductsResponse, string>({
      query: (id) => `admin-products?id=${id}`,
    }),
  }),
});

export const { useLatestProductsQuery, useAllProductsQuery } = productAPI;
