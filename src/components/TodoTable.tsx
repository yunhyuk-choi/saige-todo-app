import { Box, Checkbox, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { ToDo, ToDoRequest } from "../types/api";
import InboxRoundedIcon from '@mui/icons-material/InboxRounded'
import TodoRow from "./TodoRow";

interface TodoTableProps {
  pageItems: ToDo[];
  filteredIds: number[];
  selectedIds: Set<number>;
  editingId: number| null;
  emptyMessage: string;
  onToggleSelect: (id: number) => void;
  onToggleSelectAll: () => void;
  onToggleDone: (todo: ToDo) => void;
  onStartEdit: (id: number) => void;
  onCancelEdit: () => void;
  onSaveEdit: (id: number, body: ToDoRequest) => Promise<void>;
}

export default function TodoTable({
  pageItems,
  filteredIds,
  selectedIds,
  editingId,
  emptyMessage,
  onToggleSelect,
  onToggleSelectAll,
  onToggleDone,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
}: TodoTableProps) {
  const total = filteredIds.length
  const selectedInFilter = filteredIds.filter((id) => selectedIds.has(id)).length
  const allSelected = total > 0 && selectedInFilter === total
  const someSelected = selectedInFilter > 0 && selectedInFilter < total
  
  return (
    <TableContainer sx={{ maxHeight: {xs:'60vh', sm: '70vh'} }}>
      <Table stickyHeader sx={{ minWidth: 650 }} aria-label="todo table">
        <TableHead>
          <TableRow sx={{'& th': {borderColor: 'divider'}}}>
            <TableCell padding="checkbox">
              <Checkbox
              checked={allSelected}
                indeterminate={someSelected}
                onChange={onToggleSelectAll}
                disabled={total === 0}
                inputProps={{ 'aria-label': 'select all todos' }}
                />
            </TableCell>
            <TableCell padding="checkbox"  align="center">완료</TableCell>
            <TableCell>할 일</TableCell>
            <TableCell sx={{ width: {sm:240} }}>기한</TableCell>
            <TableCell align="right" sx={{ width: 96 }}>관리</TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
          {pageItems.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} sx={{borderBottom: 'none'}}>
                <Box
                sx={{
                  py:6,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  color: 'text.disabled',
                  gap: 1,
                }}
                >
                  <InboxRoundedIcon sx={{fontSize: 40}} />
                  <Typography variant="body2">{emptyMessage}</Typography>
                </Box>
              </TableCell>
              </TableRow>
          ) : (
            pageItems.map((todo) => (
              <TodoRow
                key={todo.id}
                todo={todo}
                selected={selectedIds.has(todo.id)}
                editing={editingId === todo.id}
                onToggleSelect={onToggleSelect}
                onToggleDone={onToggleDone}
                onStartEdit={onStartEdit}
                onCancelEdit={onCancelEdit}
                onSaveEdit={onSaveEdit}
              />
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}