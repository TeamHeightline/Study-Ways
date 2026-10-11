import { activateAuthSession, invalidateAuthSession } from './auth-session';
import axios from 'axios';
import { REST_SERVER_URL } from '../../../settings';

const axiosClient = axios.create({
  baseURL: REST_SERVER_URL,
});

// One current token for every HTTP method; refreshing never adds interceptors.
export function setAccessToken(token: string | null) {
  if (token) {
    activateAuthSession();
    axiosClient.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    invalidateAuthSession();
    delete axiosClient.defaults.headers.common.Authorization;
  }
}
export default axiosClient;
