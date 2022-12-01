import { getToken } from "./storage";

export const getUserIdByToken = () => {
  const token = getToken()

  if (!token) return null;

  try {
    const [, payload] = token.split('.');
    const data = JSON.parse(atob(payload));

    return data?.iduser;
  } catch (error) {
    console.log('GetUserIdByToken::error => ', error)

    return null;
  }
}
