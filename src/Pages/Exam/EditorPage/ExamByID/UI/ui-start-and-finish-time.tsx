import { Box, TextField, BoxProps, Stack } from '@mui/material';
import {
  useAppDispatch,
  useAppSelector,
} from '../../../../../App/ReduxStore/RootStore';
import { changeExamDate } from '../redux-store/examEditorSlice';
const localTime = (value: string | null | undefined) => {
  if (!value) return '';
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return '';
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
};
export default function UIStartAndFinishTime(props: BoxProps) {
  const exam = useAppSelector(state => state.examEditor.exam_data);
  const dispatch = useAppDispatch();
  return (
    <Box {...props}>
      <Stack spacing={1}>
        {(['start_at', 'end_at'] as const).map(field => (
          <TextField
            key={field}
            type="datetime-local"
            label={field === 'start_at' ? 'Начало' : 'Конец'}
            disabled={!exam?.is_enable_start_and_finish_time}
            value={localTime(exam?.[field])}
            onChange={event => {
              const value = event.target.value;
              if (!value) dispatch(changeExamDate({ field, value: null }));
              else {
                const date = new Date(value);
                if (Number.isFinite(date.getTime()))
                  dispatch(
                    changeExamDate({ field, value: date.toISOString() }),
                  );
              }
            }}
            slotProps={{
              inputLabel: { shrink: true },
            }}
          />
        ))}
      </Stack>
    </Box>
  );
}
