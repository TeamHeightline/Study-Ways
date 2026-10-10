import { TableCell } from '@mui/material';
import {
  IBasicUserInformation,
  user_access_level,
} from '../../../Shared/ServerLayer/Types/user.types';
import { getAccessLevel } from '../access-levels';

export function AccessLevelBadge({ value }: { value: user_access_level }) {
  const level = getAccessLevel(value);
  return (
    <span className={`sw-access-badge is-${value.toLowerCase()}`}>
      {level && <level.Icon />}
      {level?.label || 'Уровень не указан'}
    </span>
  );
}

export default function UIUserStatusCell({
  user,
}: {
  user: IBasicUserInformation;
}) {
  return (
    <TableCell className="sw-access-level-cell">
      <AccessLevelBadge value={user.user_access_level} />
    </TableCell>
  );
}
