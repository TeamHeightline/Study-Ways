interface users_educationorganization {
  organization_name: string;
}

export interface IUserprofile {
  user_id: string;
  firstname: string;
  lastname: string;
  avatar_src: string;
  group: string;
  users_educationorganization: users_educationorganization;
}

export type user_access_level = "STUDENT" | "CARD_EDITOR" | "ADMIN" | "TEACHER";

export interface IBasicUserInformation {
  id: number;
  username: string;
  user_access_level: user_access_level;
  users_userprofile?: IUserprofile | null;
}
