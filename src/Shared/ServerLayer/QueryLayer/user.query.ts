import axiosClient from './config';
import { IBasicUserInformation } from '../Types/user.types';

export async function loadAllUsers() {
  return axiosClient.get<{ allUsers: IBasicUserInformation[] }>(
    '/user/all/data',
  );
}
