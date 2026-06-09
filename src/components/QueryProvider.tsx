import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactNode, useState } from "react"
import { useToast } from "../hooks/useToast"
import { toMessage } from "../utils/error"

/**
 * QueryClient를 생성하며 **모든 쿼리/뮤테이션 에러를 전역 토스트로** 보냅니다.
 * v5의 `useQuery`엔 `onError`가 없으므로, 에러는 `QueryCache`/`MutationCache`의
 * `onError`에서 한 곳에 모아 처리합니다(개별 훅에서 에러 처리 불필요).
 * 토스트에 접근하기 위해 `ToastProvider` 하위에서 클라이언트를 1회 생성합니다.
 */
function QueryProvider({ children }: { children: ReactNode }) {
  const toast = useToast()
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { refetchOnWindowFocus: false } },
        queryCache: new QueryCache({
          onError: (error) => toast.error(toMessage(error)),
        }),
        mutationCache: new MutationCache({
          onError: (error) => toast.error(toMessage(error)),
        }),
      })
  )
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

export default QueryProvider