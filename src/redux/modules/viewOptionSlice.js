import { createSlice } from '@reduxjs/toolkit';

const viewOptionSlice = createSlice({
  name: 'viewOption',
  initialState: {
    category: [
      {
        name: 'ALL',
        text: '전체보기',
      },
      {
        name: 'PURCHASE',
        text: '공동구매',
      },
      {
        name: 'DELIVERY',
        text: '배달',
      },
      {
        name: 'EXHIBITION',
        text: '공연/전시회',
      },
      {
        name: 'ETC',
        text: '기타',
      },
    ],
    sort: [
      {
        name: 'default',
        text: '최신순',
      },
      {
        name: 'popular',
        text: '인기순',
      },
      {
        name: 'almost',
        text: '모집임박',
      },
    ],
  },
  reducers: {},
});

export default viewOptionSlice.reducer;
