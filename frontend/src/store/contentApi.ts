import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ContentItem } from "@/types/content";

interface FeedParams {
  query?: string;
  category?: string;
  type?: string;
}

interface FeedResponse {
  items: ContentItem[];
  total: number;
  timestamp: string;
}

interface ApiResponse<T> {
  source: string;
  items: T[];
  message?: string;
}

export const contentApi = createApi({
  reducerPath: "contentApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Feed", "News", "Movies", "Social"],
  endpoints: (builder) => ({
    getFeed: builder.query<ContentItem[], FeedParams | void>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.query) queryParams.set("q", params.query);
        if (params?.category) queryParams.set("category", params.category);
        if (params?.type) queryParams.set("type", params.type);
        const qs = queryParams.toString();
        return `/feed${qs ? `?${qs}` : ""}`;
      },
      transformResponse: (response: FeedResponse) => response.items,
      providesTags: ["Feed"],
    }),
    getNews: builder.query<ContentItem[], { category?: string; q?: string } | void>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.category) queryParams.set("category", params.category);
        if (params?.q) queryParams.set("q", params.q);
        const qs = queryParams.toString();
        return `/news${qs ? `?${qs}` : ""}`;
      },
      transformResponse: (response: ApiResponse<ContentItem>) => response.items,
      providesTags: ["News"],
    }),
    getMovies: builder.query<ContentItem[], { q?: string } | void>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.q) queryParams.set("q", params.q);
        const qs = queryParams.toString();
        return `/movies${qs ? `?${qs}` : ""}`;
      },
      transformResponse: (response: ApiResponse<ContentItem>) => response.items,
      providesTags: ["Movies"],
    }),
    getSocial: builder.query<ContentItem[], { hashtag?: string; q?: string } | void>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.hashtag) queryParams.set("hashtag", params.hashtag);
        if (params?.q) queryParams.set("q", params.q);
        const qs = queryParams.toString();
        return `/social${qs ? `?${qs}` : ""}`;
      },
      transformResponse: (response: ApiResponse<ContentItem>) => response.items,
      providesTags: ["Social"],
    }),
  }),
});

export const {
  useGetFeedQuery,
  useGetNewsQuery,
  useGetMoviesQuery,
  useGetSocialQuery,
} = contentApi;
