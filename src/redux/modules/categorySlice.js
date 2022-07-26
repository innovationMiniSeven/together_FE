import { createSlice } from '@reduxjs/toolkit';

const categorySlice = createSlice({
  name: 'category',
  initialState: {
    PURCHASE: ['공동구매', '/image/heyyo_purchase.png', '#d99518'],
    DELIVERY: ['배달', '/image/heyyo_delivery.png', '#75bfbf'],
    EXHIBITION: ['공연/전시회', '/image/heyyo_exhibition.png', '#b2bf50'],
    ETC: ['기타', '/image/heyyo_etc.png', '#f2d230'],
  },
  reducers: {},
});

export default categorySlice.reducer;
