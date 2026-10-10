import { Alert, Button } from '@mui/material';
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from '../../../App/ReduxStore/RootStore';
import { loadAllUsersAsync } from '../redux-store/AsyncActions';

export default function UILoadUsersFail() {
  const dispatch = useAppDispatch();
  const error = useAppSelector(
    (state: RootState) => state.statusEditor.is_users_loading_error,
  );
  if (!error) return null;
  return (
    <Alert
      severity="error"
      className="sw-access-alert"
      action={
        <Button color="inherit" onClick={() => dispatch(loadAllUsersAsync())}>
          Повторить
        </Button>
      }
    >
      Не удалось загрузить пользователей. Попробуйте ещё раз.
    </Alert>
  );
}
