import {
  Avatar,
  Button,
  Pagination,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import PersonSearchOutlinedIcon from '@mui/icons-material/PersonSearchOutlined';
import PeopleOutlineRoundedIcon from '@mui/icons-material/PeopleOutlineRounded';
import { useEffect, useState } from 'react';
import { IBasicUserInformation } from '../../../Shared/ServerLayer/Types/user.types';
import { useAppDispatch } from '../../../App/ReduxStore/RootStore';
import { changeSelectedUser } from '../redux-store/StatusEditorSlice';
import { getUserInitials, getUserName } from '../access-levels';
import UIUserProfileHead from './ui-user-tablse-head';
import UIUserStatusCell from './ui-user-status-cell';

interface UIAllUsersProps {
  users: IBasicUserInformation[];
  initialLoading: boolean;
  loading: boolean;
  isFiltered: boolean;
  resetKey: string;
  onReset: () => void;
}
const PAGE_SIZE = 12;

export default function UIAllUsers({
  users,
  initialLoading,
  loading,
  isFiltered,
  resetKey,
  onReset,
}: UIAllUsersProps) {
  const dispatch = useAppDispatch();
  const [page, setPage] = useState(1);
  useEffect(() => setPage(1), [resetKey]);
  const pages = Math.max(1, Math.ceil(users.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const start = (current - 1) * PAGE_SIZE;
  if (initialLoading)
    return (
      <div
        className="sw-access-loading"
        aria-label="Загрузка пользователей"
        aria-busy="true"
      >
        {[0, 1, 2, 3, 4].map(index => (
          <div key={index}>
            <Skeleton variant="circular" width={42} height={42} />
            <span>
              <Skeleton width="55%" />
              <Skeleton width="80%" />
            </span>
            <Skeleton width="18%" />
          </div>
        ))}
      </div>
    );
  if (!users.length)
    return (
      <div className="sw-access-empty">
        <span>
          {isFiltered ? (
            <PersonSearchOutlinedIcon />
          ) : (
            <PeopleOutlineRoundedIcon />
          )}
        </span>
        <h3>
          {isFiltered ? 'Пользователи не найдены' : 'Пока нет пользователей'}
        </h3>
        <p>
          {isFiltered
            ? 'Попробуйте другой запрос или выберите другой уровень доступа.'
            : 'Зарегистрированные пользователи появятся в этом списке.'}
        </p>
        {isFiltered && (
          <Button variant="outlined" onClick={onReset}>
            Сбросить фильтры
          </Button>
        )}
      </div>
    );
  return (
    <>
      <TableContainer className="sw-access-table-shell" aria-busy={loading}>
        <Table
          className="sw-access-table"
          aria-label="Список пользователей и уровней доступа"
        >
          <UIUserProfileHead />
          <TableBody>
            {users.slice(start, start + PAGE_SIZE).map(user => (
              <TableRow key={user.id}>
                <TableCell className="sw-access-user-cell">
                  <div className="sw-access-person">
                    <Avatar
                      src={user.users_userprofile?.avatar_src || undefined}
                    >
                      {getUserInitials(user)}
                    </Avatar>
                    <div>
                      <strong>{getUserName(user)}</strong>
                      <span>{user.username || 'Email не указан'}</span>
                      <small>№{user.id}</small>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="sw-access-organization">
                  <span>
                    {user.users_userprofile?.users_educationorganization
                      ?.organization_name || 'Не указано'}
                  </span>
                  {user.users_userprofile?.group && (
                    <small>Группа {user.users_userprofile.group}</small>
                  )}
                </TableCell>
                <UIUserStatusCell user={user} />
                <TableCell className="sw-access-action-cell">
                  <Button
                    variant="text"
                    startIcon={<EditOutlinedIcon />}
                    aria-label={`Изменить уровень доступа: ${user.username || `пользователь №${user.id}`}`}
                    onClick={() => dispatch(changeSelectedUser(user.id))}
                  >
                    Изменить
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <footer className="sw-access-pagination">
        <span>
          {start + 1}–{Math.min(start + PAGE_SIZE, users.length)} из{' '}
          {users.length}
        </span>
        {pages > 1 && (
          <Pagination
            page={current}
            count={pages}
            onChange={(_, value) => setPage(value)}
            color="primary"
            size="small"
            siblingCount={0}
          />
        )}
      </footer>
    </>
  );
}
