import { APIResponse, ToDo, ToDoRequest } from '../../types/api'

const BASE_URL = '/api/todos'

/**
 * 공통 `APIResponse<T>` envelope를 벗겨 `data`만 돌려주고, 2xx가 아닌 코드일
 * 때 의미 있는 에러를 던지는 얇은 fetch 래퍼.
 */
async function request<T>(
  input: string,
  init?: RequestInit
): Promise<T | undefined> {
  const response = await fetch(input, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  })

  const payload = (await response.json()) as APIResponse<T>

  if (payload.code < 200 || payload.code >= 300) {
    throw new Error(payload.message || `Request failed (${payload.code})`)
  }

  return payload.data
}

/** 할 일 REST 엔드포인트 클라이언트. */
export const todosApi = {
  list: () => request<ToDo[]>(BASE_URL),

  create: (body: ToDoRequest) =>
    request<ToDo>(BASE_URL, {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  update: (id: number, body: ToDoRequest) =>
    request<ToDo>(`${BASE_URL}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    }),

  remove: (id: number) =>
    request<void>(`${BASE_URL}/${id}`, {
      method: 'DELETE',
    }),
}

/**
 * 할 일 목록 쿼리 키. 같은 키로 `useQuery`를 호출하면 어느 컴포넌트에서든
 * 동일한 캐시를 공유합니다.
 */
export const TODOS_QUERY_KEY = ['todos'] as const
