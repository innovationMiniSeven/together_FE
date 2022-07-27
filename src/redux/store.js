import { configureStore } from '@reduxjs/toolkit';
import categoryReducer from './modules/categorySlice';
import viewOptionReducer from './modules/viewOptionSlice';

const store = configureStore({
  reducer: { category: categoryReducer, viewOption: viewOptionReducer },
});

export default store;
