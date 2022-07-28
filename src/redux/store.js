import { configureStore } from '@reduxjs/toolkit';
import categoryReducer from './modules/categorySlice';
import viewOptionReducer from './modules/viewOptionSlice';
import userReducer from './modules/userSlice';

const store = configureStore({
  reducer: {
    category: categoryReducer,
    viewOption: viewOptionReducer,
    user: userReducer,
  },
});

export default store;
