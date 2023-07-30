import { createSlice } from "@reduxjs/toolkit";

export const SearchSlice = createSlice({
  name: "search",
  initialState: {
    searchUsers: [],
    searchActive: false,
  },
  reducers: {
    setSearchUsers: (state, action) => {
      state.searchUsers = action.payload;
    },
    setSearchActive: (state) => {
      state.searchActive = true;
    },
    setSearchUnActive: (state) => {
      state.searchActive = false;
    },
  },
});

export const { setSearchUsers, setSearchActive, setSearchUnActive } =
  SearchSlice.actions;
export default SearchSlice.reducer;
