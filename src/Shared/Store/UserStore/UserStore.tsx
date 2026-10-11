import { makeAutoObservable } from 'mobx';
import React from 'react';
import axiosClient from '../../ServerLayer/QueryLayer/config';

interface IBasicUserData {
  id: number;
  username: string;
  user_access_level: 'STUDENT' | 'TEACHER' | 'ADMIN' | 'CARD_EDITOR';
}

class User {
  user_data: IBasicUserData | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  get isLogin() {
    return !!this?.user_data?.id;
  }

  get userAccessLevel() {
    return this.user_data?.user_access_level ?? 'STUDENT';
  }

  get username() {
    return this.user_data?.username ?? '';
  }

  get userIDForRecombee() {
    return this.user_data?.id ?? '-1';
  }

  reloadUser(isCurrent: () => boolean = () => true) {
    return axiosClient.get<IBasicUserData>('/page/me/basic-data').then(res => {
      if (isCurrent()) this.user_data = res.data;
    });
  }
}

export const UserStorage = new User();
