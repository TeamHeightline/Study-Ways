import { getUserSession } from '../session-access';

export default function haveStatus(roles: string[]) {
  return roles.includes(getUserSession().role);
}
