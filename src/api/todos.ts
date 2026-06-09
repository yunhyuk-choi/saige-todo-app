import type { APIResponse, ToDo, ToDoRequest } from '../types/api'

// MSW가 가로채는 /api/todos. APIResponse<T>를 언래핑하고 code!==200이면 throw.
async function request<T>(input: string, init?: RequestInit): Promise<T | undefined> {
  const res = await fetch(input, init)
  const json: APIResponse<T> = await res.json()
  if (json.code !== 200) {
    throw new Error(json.message || `요청에 실패했습니다 (code: ${json.code})`)
  }
  return json.data
}

const jsonInit = (method: string, body: ToDoRequest): RequestInit => ({
  method,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
})

export async function fetchTodos(): Promise<ToDo[]> {
  const data = await request<ToDo[]>('/api/todos')
  return data ?? []
}

export async function createTodo(body: ToDoRequest): Promise<ToDo> {
  const data = await request<ToDo>('/api/todos', jsonInit('POST', body))
  if (!data) throw new Error('생성 결과가 비어 있습니다')
  return data
}

export async function updateTodo(id: number, body: ToDoRequest): Promise<ToDo> {
  const data = await request<ToDo>(`/api/todos/${id}`, jsonInit('PUT', body))
  if (!data) throw new Error('수정 결과가 비어 있습니다')
  return data
}

export async function deleteTodo(id: number): Promise<void> {
  await request<void>(`/api/todos/${id}`, { method: 'DELETE' })
}
