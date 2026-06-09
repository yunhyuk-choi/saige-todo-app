import { Box, Container, PaletteMode, Stack } from '@mui/material'
import TodoForm from './TodoForm'
import TodoListHeader from './TodoListHeader'
import TodoListSection from './TodoListSection'

/** {@link TodoPage}의 props. */
interface TodoPageProps {
  /** 현재 색 모드(헤더의 테마 토글에 전달). */
  mode: PaletteMode
  /** 라이트/다크 모드를 전환합니다. */
  onToggleMode: () => void
}

/**
 * 메인 To-Do 화면의 정적 레이아웃. 상태 훅을 전혀 들지 않고 자기완결적인
 * 블록(헤더·입력 폼·목록 섹션)을 나열만 합니다. 목록/검색/선택이 바뀌어도
 * 이 컴포넌트는 리렌더되지 않으므로 형제 블록들도 서로 영향을 주지 않습니다.
 */
export default function TodoPage({ mode, onToggleMode }: TodoPageProps) {
  return (
    <Box sx={{ minHeight: '100vh', py: { xs: 2, sm: 5 } }}>
      <Container maxWidth="md" sx={{ px: { xs: 1.5, sm: 3 } }}>
        <Stack spacing={{ xs: 2, sm: 3 }}>
          <TodoListHeader mode={mode} onToggleMode={onToggleMode} />
          <TodoForm />
          <TodoListSection />
        </Stack>
      </Container>
    </Box>
  )
}
