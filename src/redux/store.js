import { configureStore } from '@reduxjs/toolkit';
import categoryReducer from './modules/categorySlice';

const store = configureStore({ reducer: { category: categoryReducer } });

export default store;
