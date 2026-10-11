import axiosClient from './config';
import { IBasicUserInformation } from '../types/user.types';

export async function loadAllUsers() {
  return axiosClient.get<{ allUsers: IBasicUserInformation[] }>(
    '/user/all/data',
  );
}
