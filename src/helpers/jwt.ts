import { getToken } from './storage'

export const getUserIdByToken = (): string | null => {
  const token = getToken()

  if (token === undefined) return null

  try {
    const [, payload] = token.split('.')
    const data = JSON.parse(atob(payload))

    return data?.iduser
  } catch (error) {
    console.log('GetUserIdByToken::error => ', error)

    return null
  }
}
