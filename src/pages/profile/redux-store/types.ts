interface IUser {
  id: number;
  username: string;
}

export interface IProfile {
  user_id: number;
  firstname: string | null;
  lastname: string | null;
  avatar_src: string | null;
  study_in_id: number | null;
  group: string | null;
  users_customuser: IUser | null;
}
