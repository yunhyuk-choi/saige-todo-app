import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './lib/queryClient'
import { TodoPage } from './features/todo/TodoPage'

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TodoPage />
    </QueryClientProvider>
  )
}

export default App
