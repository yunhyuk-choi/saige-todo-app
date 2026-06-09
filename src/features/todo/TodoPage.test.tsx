import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, within } from '@testing-library/react'
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

type User = ReturnType<typeof userEvent.setup>

async function addTodo(user: User, text: string) {
  await user.type(screen.getByLabelText('할 일 내용'), text)
  await user.click(screen.getByRole('button', { name: '추가' }))
  await screen.findByText(text)
}

function rowOf(text: string): HTMLElement {
  const li = screen.getByText(text).closest('li')
  if (!li) throw new Error(`row not found: ${text}`)
  return li
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

  // 과거 날짜 차단 규칙은 date.test.ts(isOverdue/daysLeft)에서 단위 검증한다.
  // (jsdom에서는 controlled date input의 값 변경이 React state로 반영되지 않아
  //  통합 테스트로는 신뢰성 있게 재현되지 않음 — 실제 브라우저에서는 정상 동작)

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

  it('완료 토글 시 상태가 반영되고 취소선이 표시된다', async () => {
    const user = userEvent.setup()
    renderPage()
    await screen.findByText(/할 일이 없습니다/)
    await addTodo(user, '보고서 작성')

    await user.click(screen.getByRole('button', { name: '보고서 작성 완료 처리' }))

    expect(await screen.findByRole('button', { name: '보고서 작성 완료 취소' })).toBeInTheDocument()
    expect(screen.getByText('보고서 작성').parentElement).toHaveClass('line-through')
  })

  it('상태 필터(진행중/완료)로 항목을 거른다', async () => {
    const user = userEvent.setup()
    renderPage()
    await screen.findByText(/할 일이 없습니다/)
    await addTodo(user, '완료할 일')
    await addTodo(user, '진행할 일')
    await user.click(screen.getByRole('button', { name: '완료할 일 완료 처리' }))

    await user.click(screen.getByRole('button', { name: '완료' }))
    expect(screen.getByText('완료할 일')).toBeInTheDocument()
    expect(screen.queryByText('진행할 일')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: '진행중' }))
    expect(screen.getByText('진행할 일')).toBeInTheDocument()
    expect(screen.queryByText('완료할 일')).not.toBeInTheDocument()
  })

  it('고정한 항목이 목록 최상단으로 이동한다', async () => {
    const user = userEvent.setup()
    renderPage()
    await screen.findByText(/할 일이 없습니다/)
    await addTodo(user, '첫째')
    await addTodo(user, '둘째')

    await user.click(within(rowOf('둘째')).getByRole('button', { name: '고정' }))

    const items = screen.getAllByRole('listitem')
    expect(within(items[0]).getByText('둘째')).toBeInTheDocument()
  })

  it('페이지 크기에 맞춰 페이지로 나눈다', async () => {
    const user = userEvent.setup()
    renderPage()
    await screen.findByText(/할 일이 없습니다/)
    for (let i = 1; i <= 6; i++) await addTodo(user, `항목${i}`)

    await user.selectOptions(screen.getByLabelText('페이지 크기'), '5')
    expect(screen.getAllByRole('listitem')).toHaveLength(5)

    await user.click(screen.getByRole('button', { name: /다음/ }))
    expect(screen.getAllByRole('listitem')).toHaveLength(1)
  })

  it('다중 선택 삭제 후 실행취소로 복원한다', async () => {
    const user = userEvent.setup()
    renderPage()
    await screen.findByText(/할 일이 없습니다/)
    await addTodo(user, '삭제A')
    await addTodo(user, '삭제B')

    await user.click(screen.getByLabelText('전체 선택'))
    await user.click(screen.getByRole('button', { name: /선택 삭제/ }))
    expect(screen.queryByText('삭제A')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: '실행취소' }))
    expect(await screen.findByText('삭제A')).toBeInTheDocument()
    expect(screen.getByText('삭제B')).toBeInTheDocument()
  })

  it('인라인 편집으로 내용을 수정한다', async () => {
    const user = userEvent.setup()
    renderPage()
    await screen.findByText(/할 일이 없습니다/)
    await addTodo(user, '수정 전')

    await user.click(screen.getByRole('button', { name: '편집' }))
    const input = screen.getByLabelText('할 일 내용 수정')
    await user.clear(input)
    await user.type(input, '수정 후')
    await user.click(screen.getByRole('button', { name: '저장' }))

    expect(await screen.findByText('수정 후')).toBeInTheDocument()
    expect(screen.queryByText('수정 전')).not.toBeInTheDocument()
  })
})
