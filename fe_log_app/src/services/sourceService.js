import { apiSlice } from "../redux/slices/apiSlice";

export const api = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllSources: builder.query({
      query: (filter) => ({
        url: "logs/source",
        method: "GET",
        body: { ...filter },
      }),
    }),
    createSource: builder.mutation({
      query: (payload) => ({
        url: "logs/source/",
        method: "POST",
        body: { ...payload },
      }),
    }),
    getSourceById: builder.query({
      query: (id) => ({
        url: "logs/source/" + String(id) + "/",
        method: "GET",
      }),
    }),
    updateSource: builder.mutation({
      query: (id, payload) => ({
        url: "logs/source/" + String(id) + "/",
        method: "PUT",
        body: { ...payload },
      }),
    }),
    deleteSource: builder.mutation({
      query: (id) => ({
        url: "logs/source/" + String(id) + "/",
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetAllSourcesQuery,
  useCreateSourceMutation,  
  useGetSourceByIdQuery,
  useUpdateSourceMutation,
  useDeleteSourceMutation,
} = api;
