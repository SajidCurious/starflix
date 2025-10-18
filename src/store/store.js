import { configureStore } from "@reduxjs/toolkit";
import homeSlice from "./homeSlice";
import authSlice from "./authSlice";

export default configureStore({
  reducer: {
    home: homeSlice,
    auth: authSlice,
  },
});
