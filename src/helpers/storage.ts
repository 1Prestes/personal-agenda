import Cookies from 'universal-cookie'

const defaultOptions = {
  path: '/'
}

const tokenPrefix = '@TOKEN'

const cookies = new Cookies()

export const setToken = (token: string): boolean | null => {
  if (!token) return null
  cookies.set(tokenPrefix, token, defaultOptions)

  return true
}

export const getToken = (): string | undefined => cookies.get(tokenPrefix)
export const removeToken = (): void => cookies.remove(tokenPrefix, defaultOptions)
