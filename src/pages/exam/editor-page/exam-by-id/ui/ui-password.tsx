import { Box, IconButton, InputAdornment, TextField } from '@mui/material';
import { BoxProps } from '@mui/material/Box';
import { useState } from 'react';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
  RootState,
  useAppDispatch,
} from '../../../../../app/redux-store/RootStore';
import { useSelector } from 'react-redux';
import { changeOriginalPassword } from '../redux-store/examEditorSlice';

type IUIPasswordProps = BoxProps;

export default function UIPassword({ ...props }: IUIPasswordProps) {
  const dispatch = useAppDispatch();
  const is_enable_password_check =
    useSelector(
      (state: RootState) =>
        state?.examEditor?.exam_data?.is_enable_password_check,
    ) || false;
  const original_password =
    useSelector((state: RootState) => state?.examEditor?.original_password) ||
    '';

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  return (
    <Box {...props}>
      <TextField
        label="Пароль"
        variant="outlined"
        type={showPassword ? 'text' : 'password'}
        fullWidth
        id={'exam-password'}
        value={original_password}
        onChange={e => {
          dispatch(changeOriginalPassword(e.target.value));
        }}
        disabled={!is_enable_password_check}
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label={
                    showPassword ? 'Скрыть пароль' : 'Показать пароль'
                  }
                  onClick={handleClickShowPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />
    </Box>
  );
}
