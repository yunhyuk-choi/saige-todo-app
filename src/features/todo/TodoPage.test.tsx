import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { TodoPage } from './TodoPage'

function renderPage() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={queryClient}>
      <TodoPage />
    </QueryClientProvider>,
  )
}

async function addTodo(user: ReturnType<typeof userEvent.setup>, text: string) {
  await user.type(screen.getByLabelText('할 일 내용'), text)
  await user.click(screen.getByRole('button', { name: '추가' }))
  await screen.findByText(text)
}

describe('TodoPage', () => {
  it('초기에는 빈 상태를 표시한다', async () => {
    renderPage()
    expect(await screen.findByText(/할 일이 없습니다/)).toBeInTheDocument()
  })

  it('할 일을 추가하면 목록에 나타난다', async () => {
    const user = userEvent.setup()
    renderPage()
    await screen.findByText(/할 일이 없습니다/)
    await addTodo(user, '우유 사기')
    expect(screen.getByText('우유 사기')).toBeInTheDocument()
  })

  it('빈 내용으로 추가하면 검증 에러를 표시한다', async () => {
    const user = userEvent.setup()
    renderPage()
    await screen.findByText(/할 일이 없습니다/)
    await user.click(screen.getByRole('button', { name: '추가' }))
    expect(await screen.findByText('할 일을 입력하세요')).toBeInTheDocument()
  })

  it('검색어로 목록을 필터링한다', async () => {
    const user = userEvent.setup()
    renderPage()
    await screen.findByText(/할 일이 없습니다/)
    await addTodo(user, '우유 사기')
    await addTodo(user, '운동 하기')

    await user.type(screen.getByLabelText('검색'), '우유')
    expect(screen.getByText('우유 사기')).toBeInTheDocument()
    expect(screen.queryByText('운동 하기')).not.toBeInTheDocument()
  })

  it('완료 토글 시 완료 상태가 반영되고 취소선이 표시된다', async () => {
    const user = userEvent.setup()
    renderPage()
    await screen.findByText(/할 일이 없습니다/)
    await addTodo(user, '보고서 작성')

    // 완료 토글은 별도 버튼(선택 체크박스와 구분)
    await user.click(screen.getByRole('button', { name: '보고서 작성 완료 처리' }))

    // 완료 후 라벨이 '완료 취소'로 바뀐다 = 다시 진행중으로 되돌릴 수 있다
    expect(await screen.findByRole('button', { name: '보고서 작성 완료 취소' })).toBeInTheDocument()
    expect(screen.getByText('보고서 작성').parentElement).toHaveClass('line-through')
  })
})
