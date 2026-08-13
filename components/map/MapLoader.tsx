'use client';

import dynamic from 'next/dynamic';

const MainMap = dynamic(() => import('./index'), {
  ssr: false,
  loading: () => <div style={{ minHeight: 400 }}>지도를 불러오는 중...</div>,
});

export default MainMap;