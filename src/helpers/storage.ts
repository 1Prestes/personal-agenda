import Cookies from 'universal-cookie';

const defaultOptions = {
  path: '/',
};

const tokenPrefix = '@TOKEN'

const cookies = new Cookies();

export const setToken = (token: string) => {
  if (!token) return null

  cookies.set(tokenPrefix, token, defaultOptions)

  return true
};

export const getToken = () => cookies.get(tokenPrefix)
export const removeToken = () => cookies.remove(tokenPrefix, defaultOptions)

