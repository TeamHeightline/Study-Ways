import React from 'react';
import { Box, Checkbox, FormControlLabel } from '@mui/material';
import { BoxProps } from '@mui/material/Box';
import {
  useAppDispatch,
  useAppSelector,
} from '../../../../../App/ReduxStore/RootStore';
import { changeShowOnlyFilledQuestions } from '../redux-store/QuestionEditorPageSlice';

export default function HideNotFilledQuestions(props: BoxProps) {
  const checked = useAppSelector(
    state => state.questionEditorPage.show_only_filled_questions,
  );
  const dispatch = useAppDispatch();
  return (
    <Box {...props} className="sw-qedit-filled-filter">
      <FormControlLabel
        control={
          <Checkbox
            size="small"
            checked={checked}
            onChange={() => dispatch(changeShowOnlyFilledQuestions())}
          />
        }
        label="Только заполненные"
      />
    </Box>
  );
}
