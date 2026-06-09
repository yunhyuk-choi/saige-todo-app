import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query'
import { showErrorToast } from '../stores/toastStore'
import { getErrorMessage } from './error'

// v5: useQuery엔 onError가 없으므로 전역 에러는 Cache 레벨에서 처리
export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => showErrorToast(getErrorMessage(error)),
  }),
  mutationCache: new MutationCache({
    onError: (error) => showErrorToast(getErrorMessage(error)),
  }),
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
    },
  },
})
