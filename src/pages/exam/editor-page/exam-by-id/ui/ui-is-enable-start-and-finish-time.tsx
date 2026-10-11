import { Box, Checkbox, FormControlLabel, BoxProps } from '@mui/material';
import {
  useAppDispatch,
  useAppSelector,
} from '../../../../../app/redux-store/RootStore';
import { changeIsEnableStartAndFinishTime } from '../redux-store/examEditorSlice';
export default function UIIsEnableStartAndFinishTime(props: BoxProps) {
  const dispatch = useAppDispatch();
  const enabled = useAppSelector(
    state =>
      state.examEditor.exam_data?.is_enable_start_and_finish_time ?? false,
  );
  return (
    <Box {...props}>
      <FormControlLabel
        control={
          <Checkbox
            checked={enabled}
            onChange={() => dispatch(changeIsEnableStartAndFinishTime())}
          />
        }
        label="Начало и конец в определенное время"
      />
    </Box>
  );
}
