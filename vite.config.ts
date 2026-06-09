import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // 거대한 단일 번들을 벤더별로 분리: 경고 해소 + 캐싱/병렬 로드 개선.
        // @mui/x-date-pickers는 일부러 묶지 않습니다 — LazyDatePicker의 동적
        // import가 무거운 DatePicker를 별도 async 청크로 떼어내도록.
        manualChunks: {
          emotion: ['@emotion/react', '@emotion/styled'],
          'mui-material': ['@mui/material'],
          'mui-icons': ['@mui/icons-material'],
          query: ['@tanstack/react-query'],
        },
      },
    },
  },
})
