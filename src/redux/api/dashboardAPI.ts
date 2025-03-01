import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { PieResponse, StatsResponse } from "../../types/api-types";

export const dashboardAPI = createApi({
  reducerPath: "dashboardApi",

  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/dashboard/`,
  }),

  endpoints: (builder) => ({
    //  GET DASHBOARD STATS
    stats: builder.query<StatsResponse, string>({
      query: (id) => `stats?id=${id}`,
      keepUnusedDataFor: 0,
    }),

    //  GET PIE STATS
    pie: builder.query<PieResponse, string>({
      query: (id) => `pie?id=${id}`,
      keepUnusedDataFor: 0,
    }),

    //  GET BAR STATS
    bar: builder.query<StatsResponse, string>({
      query: (id) => `bar?id=${id}`,
      keepUnusedDataFor: 0,
    }),

    //  GET LINE STATS
    line: builder.query<StatsResponse, string>({
      query: (id) => `line?id=${id}`,
      keepUnusedDataFor: 0,
    }),
  }),
});

export const { useStatsQuery, usePieQuery, useBarQuery, useLineQuery } =
  dashboardAPI;
