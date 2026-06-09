/** 알 수 없는 에러 값을 사용자에게 보여줄 메시지로 변환합니다. */
export function toMessage(error: unknown): string {
  return error instanceof Error ? error.message : '요청을 처리하지 못했습니다.'
}
