import { setupServer } from 'msw/node'
import { handlers } from '../mocks/handlers'

// 테스트(node 환경)에서는 동일한 핸들러를 setupServer로 재사용한다.
export const server = setupServer(...handlers)
