import { Alert, Box, Button, Stack, TextField } from '@mui/material';
import { BoxProps } from '@mui/material/Box';
import {
  useAppDispatch,
  useAppSelector,
} from '../../../../app/redux-store/RootStore';
import { setAccessPassword } from '../redux-store/ExamPlayerSlice';

import { useParams } from 'react-router-dom';
import { openExamPageThunk } from '../redux-store/AsyncActions';

type IUIAccessPasswordProps = BoxProps;

export default function UIAccessPassword({ ...props }: IUIAccessPasswordProps) {
  const dispatch = useAppDispatch();
  const { uid } = useParams();
  const opening = useAppSelector(
    state => state.examPlayer.loading_question_statuses,
  );
  const error = useAppSelector(
    state => state.examPlayer.question_statuses_load_error,
  );
  const access_password = useAppSelector(
    state => state.examPlayer?.access_password,
  );

  const onPasswordChange = e => {
    dispatch(setAccessPassword(e.target.value));
  };
  return (
    <Box {...props}>
      <Stack
        sx={{
          alignItems: 'center',
        }}
      >
        <Box
          component="form"
          sx={{ maxWidth: 400 }}
          onSubmit={event => {
            event.preventDefault();
            if (uid && !opening)
              dispatch(openExamPageThunk({ uid, password: access_password }));
          }}
        >
          <Alert severity={'warning'} variant={'filled'}>
            Для доступа к этому экзамену необходимо ввести пароль
          </Alert>
          <TextField
            type="password"
            autoComplete="current-password"
            fullWidth
            onChange={onPasswordChange}
            id="outlined-basic"
            sx={{ mt: 2 }}
            label="Пароль"
            variant="outlined"
            value={access_password}
          />
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
            disabled={opening || !access_password}
          >
            {opening ? 'Проверяем…' : 'Войти в экзамен'}
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}
