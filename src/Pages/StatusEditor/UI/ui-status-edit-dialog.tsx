import {
  Alert,
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Radio,
  RadioGroup,
  Snackbar,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import { useState } from 'react';
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from '../../../App/ReduxStore/RootStore';
import { user_access_level } from '../../../Shared/ServerLayer/Types/user.types';
import {
  cancelUserEdit,
  changeSelectedUserStatus,
} from '../redux-store/StatusEditorSlice';
import { updateUserStatusAsync } from '../redux-store/AsyncActions';
import { ACCESS_LEVELS, getUserInitials, getUserName } from '../access-levels';
import { AccessLevelBadge } from './ui-user-status-cell';

export default function UIStatusEditDialog() {
  const dispatch = useAppDispatch();
  const {
    selectedUser,
    users,
    pending_update_user_status: pending,
    update_user_status_error: error,
  } = useAppSelector((state: RootState) => state.statusEditor);
  const [saved, setSaved] = useState(false);
  const currentLevel = users.find(
    user => user.id === selectedUser?.id,
  )?.user_access_level;
  const changed =
    !!selectedUser && selectedUser.user_access_level !== currentLevel;
  function close() {
    if (!pending) dispatch(cancelUserEdit());
  }
  async function save() {
    if (!selectedUser || pending || !changed) return;
    try {
      await dispatch(
        updateUserStatusAsync({
          user_id: selectedUser.id,
          user_access_level: selectedUser.user_access_level,
        }),
      ).unwrap();
      dispatch(cancelUserEdit());
      setSaved(true);
    } catch {
      // The store keeps the draft open and exposes the save error for retry.
    }
  }
  return (
    <>
      <Dialog
        open={!!selectedUser}
        onClose={close}
        fullWidth
        maxWidth="sm"
        className="sw-access-dialog"
        aria-labelledby="sw-access-dialog-title"
        aria-describedby="sw-access-dialog-description"
      >
        <DialogTitle id="sw-access-dialog-title">
          <span>Уровень доступа</span>
          <IconButton
            aria-label="Закрыть выбор уровня доступа"
            onClick={close}
            disabled={pending}
          >
            <CloseRoundedIcon />
          </IconButton>
        </DialogTitle>
        {selectedUser && (
          <>
            <DialogContent>
              <p id="sw-access-dialog-description">
                Выберите, какие возможности будут доступны пользователю.
              </p>
              <div className="sw-access-dialog-person">
                <Avatar
                  src={selectedUser.users_userprofile?.avatar_src || undefined}
                >
                  {getUserInitials(selectedUser)}
                </Avatar>
                <div>
                  <strong>{getUserName(selectedUser)}</strong>
                  <span>
                    {selectedUser.username ||
                      `Пользователь №${selectedUser.id}`}
                  </span>
                  {currentLevel && (
                    <small>
                      Сейчас: <AccessLevelBadge value={currentLevel} />
                    </small>
                  )}
                </div>
              </div>
              <RadioGroup
                aria-label="Новый уровень доступа"
                value={selectedUser.user_access_level}
                onChange={event =>
                  dispatch(
                    changeSelectedUserStatus(
                      event.target.value as user_access_level,
                    ),
                  )
                }
              >
                {ACCESS_LEVELS.map(({ value, label, description, Icon }) => (
                  <label
                    key={value}
                    className={`sw-access-role-option is-${value.toLowerCase()}${selectedUser.user_access_level === value ? ' is-selected' : ''}${pending ? ' is-disabled' : ''}`}
                  >
                    <span className="sw-access-option-icon">
                      <Icon />
                    </span>
                    <span>
                      <strong>{label}</strong>
                      <span>{description}</span>
                    </span>
                    <Radio
                      value={value}
                      disabled={pending}
                      size="small"
                      inputProps={{ 'aria-label': label }}
                    />
                  </label>
                ))}
              </RadioGroup>
              {error && (
                <Alert severity="error" className="sw-access-alert">
                  Не удалось сохранить уровень доступа. Попробуйте ещё раз.
                </Alert>
              )}
            </DialogContent>
            <DialogActions>
              <span>
                {changed ? (
                  <>
                    <ArrowForwardRoundedIcon />
                    Изменения ещё не сохранены
                  </>
                ) : (
                  'Выберите новый уровень доступа'
                )}
              </span>
              <div>
                <Button onClick={close} disabled={pending}>
                  Отмена
                </Button>
                <LoadingButton
                  variant="contained"
                  loading={pending}
                  disabled={!changed}
                  onClick={save}
                  startIcon={<CheckRoundedIcon />}
                >
                  Сохранить
                </LoadingButton>
              </div>
            </DialogActions>
          </>
        )}
      </Dialog>
      <Snackbar
        open={saved}
        autoHideDuration={4500}
        onClose={() => setSaved(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity="success"
          variant="filled"
          onClose={() => setSaved(false)}
        >
          Уровень доступа обновлён
        </Alert>
      </Snackbar>
    </>
  );
}
