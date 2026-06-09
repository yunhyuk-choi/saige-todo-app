// unknown 에러에서 사용자 표시용 메시지 추출
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  return '알 수 없는 오류가 발생했습니다'
}
