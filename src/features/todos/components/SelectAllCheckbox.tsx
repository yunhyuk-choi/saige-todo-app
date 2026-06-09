import { Checkbox, FormControlLabel } from '@mui/material'
import { useTodoListView } from '../hooks/useTodoListView'
import { useTodoListStore } from '../store'

/** {@link SelectAllCheckbox}의 props. */
interface SelectAllCheckboxProps {
  /** 주어지면 라벨이 붙은 형태(모바일)로, 없으면 체크박스만(테이블 헤더) 렌더. */
  label?: string
}

/**
 * 전체 선택 체크박스. 선택 집합(store)과 필터된 id 목록을 **자기 자신만**
 * 구독하므로, 선택이 바뀌어도 이 작은 컴포넌트만 리렌더되고 목록(테이블/카드)
 * 본문은 리렌더되지 않습니다. "현재 필터에 보이는 항목 전체"를 토글합니다.
 */
export default function SelectAllCheckbox({ label }: SelectAllCheckboxProps) {
  const { todos } = useTodoListView()
  const selectedIds = useTodoListStore((s) => s.selectedIds)
  const toggleSelectAll = useTodoListStore((s) => s.toggleSelectAll)

  const ids = todos.map((t) => t.id)
  const total = ids.length
  const selectedInFilter = ids.reduce(
    (n, id) => n + (selectedIds.has(id) ? 1 : 0),
    0
  )
  const allSelected = total > 0 && selectedInFilter === total
  const someSelected = selectedInFilter > 0 && selectedInFilter < total

  const checkbox = (
    <Checkbox
      size={label ? 'small' : 'medium'}
      checked={allSelected}
      indeterminate={someSelected}
      onChange={() => toggleSelectAll(ids)}
      disabled={total === 0}
      inputProps={{ 'aria-label': '전체 선택' }}
    />
  )

  if (!label) return checkbox

  return (
    <FormControlLabel
      sx={{ mb: 1, '& .MuiTypography-root': { fontSize: 13 } }}
      control={checkbox}
      label={label}
    />
  )
}
