import { Button, CircularProgress, Paper, Skeleton } from '@mui/material';
import { PaperProps } from '@mui/material/Paper/Paper';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import PeopleOutlineRoundedIcon from '@mui/icons-material/PeopleOutlineRounded';
import { useEffect, useMemo, useState } from 'react';
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from '../../../App/ReduxStore/RootStore';
import { user_access_level } from '../../../Shared/ServerLayer/Types/user.types';
import UITitle from './ui-title';
import UIAllUsers from './ui-all-users';
import UIUserSearch from './ui-user-search';
import { loadAllUsersAsync } from '../redux-store/AsyncActions';
import { changeSearchString } from '../redux-store/StatusEditorSlice';
import UIStatusEditDialog from './ui-status-edit-dialog';
import UILoadUsersFail from './ui_load_users_error';
import { ACCESS_LEVELS, matchesUser } from '../access-levels';
import '../status-editor.css';

type LevelFilter = 'all' | user_access_level;

export default function StatusEditorPage({
  className = '',
  ...props
}: PaperProps) {
  const dispatch = useAppDispatch();
  const {
    users,
    searchString,
    is_users_loading: loading,
    is_users_loading_error: error,
  } = useAppSelector((state: RootState) => state.statusEditor);
  const [level, setLevel] = useState<LevelFilter>('all');
  useEffect(() => {
    dispatch(loadAllUsersAsync());
  }, [dispatch]);
  const initialLoading = loading && users.length === 0;
  const filtered = useMemo(
    () =>
      users.filter(
        user =>
          (level === 'all' || user.user_access_level === level) &&
          matchesUser(user, searchString),
      ),
    [users, level, searchString],
  );
  function resetFilters() {
    dispatch(changeSearchString(''));
    setLevel('all');
  }
  const filters = [
    {
      value: 'all' as const,
      plural: 'Все пользователи',
      Icon: PeopleOutlineRoundedIcon,
    },
    ...ACCESS_LEVELS,
  ];
  return (
    <Paper elevation={0} className={`sw-access ${className}`} {...props}>
      <header className="sw-access-heading">
        <UITitle />
        <Button
          variant="outlined"
          disabled={loading}
          startIcon={
            loading ? (
              <CircularProgress size={16} color="inherit" />
            ) : (
              <RefreshRoundedIcon />
            )
          }
          onClick={() => dispatch(loadAllUsersAsync())}
        >
          {loading ? 'Обновляем…' : 'Обновить список'}
        </Button>
      </header>
      <div
        className="sw-access-filters"
        role="group"
        aria-label="Фильтр по уровню доступа"
      >
        {filters.map(({ value, plural, Icon }) => (
          <button
            type="button"
            key={value}
            aria-pressed={level === value}
            className={`sw-access-filter is-${value.toLowerCase()}${level === value ? ' is-selected' : ''}`}
            onClick={() => setLevel(value)}
            disabled={initialLoading}
          >
            <span className="sw-access-filter-icon">
              <Icon />
            </span>
            <span>
              <strong>
                {initialLoading ? (
                  <Skeleton width={24} />
                ) : value === 'all' ? (
                  users.length
                ) : (
                  users.filter(user => user.user_access_level === value).length
                )}
              </strong>
              <span>{plural}</span>
            </span>
          </button>
        ))}
      </div>
      <section className="sw-access-directory" aria-label="Пользователи">
        <div className="sw-access-directory-heading">
          <div>
            <h2>Пользователи</h2>
            <p>Выберите пользователя, чтобы изменить его права.</p>
          </div>
          {!initialLoading && (
            <span className="sw-access-result-count" aria-live="polite">
              Найдено: {filtered.length}
            </span>
          )}
        </div>
        <UIUserSearch />
        <UILoadUsersFail />
        {(!error || users.length > 0) && (
          <UIAllUsers
            users={filtered}
            initialLoading={initialLoading}
            loading={loading}
            resetKey={`${level}:${searchString}`}
            isFiltered={level !== 'all' || !!searchString.trim()}
            onReset={resetFilters}
          />
        )}
      </section>
      <UIStatusEditDialog />
    </Paper>
  );
}
