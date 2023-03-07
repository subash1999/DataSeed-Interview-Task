import { createSlice } from "@reduxjs/toolkit";

const getInitialState = () => {
  let state = {
    sources: [],
    isUpdated: 1,
  };
  return state;
};
//slice for the state management of the user and token
const authSlice = createSlice({
  name: "source",
  initialState: getInitialState(),
  reducers: {
    setSourceList: (state, action) => {
      const { sources } = action.payload;
      state.sources = sources;
    },
    markAsUpdated: (state) => {
      state.isUpdated = state.isUpdated+1;
    },
    createSource: (state, action) => {
        const { source } = action.payload;
        state.sources.push(source);
    },    
    deleteSource: (state, action) => {
        const { id } = action.payload;
        state.sources = state.sources.filter((source) => source.id !== id);
    },
    updateSource: (state, action) => {
        const { updated_source } = action.payload;
        state.sources = state.sources.filter((source) => source.id !== updated_source.id);
        state.sources.push(updated_source);
    },
  },
});

export const { setSourceList, markAsUpdated, createSource, updateSource, deleteSource} = authSlice.actions;

export default authSlice.reducer;

export const getSourceList = (state) => state.source.sources;
export const getSingleSource = (state,id) => state.source.sources.filter((source) => source.id === id);
export const getSourceUpdateStatus = (state) => state.source.isUpdated;