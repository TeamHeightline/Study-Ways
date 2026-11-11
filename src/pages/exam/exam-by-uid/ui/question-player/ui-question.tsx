import React, { useState } from 'react';
import { Box, PaperProps, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../../../../app/redux-store/RootStore';
import { FILE_URL } from '../../../../../settings';
import { checkAnswers } from '../../redux-store/ExamPlayerSlice';
import QuestionPanel from '../../../../../shared/question-player/ui/question-panel';
import QuestionActions from '../../../../../shared/question-player/ui/question-actions';
import UiComebackLaterDialog from './ui-come-back-later-dialog';

export default function UIQuestion(props: PaperProps) {
  const state = useSelector((state: RootState) => state.examPlayer);
  const dispatch = useDispatch();
  const [defeatOpen, setDefeatOpen] = useState(false);
  const path = state.selected_question_data?.usertests_questionimage?.image;
  return (
    <Box {...props}>
      <QuestionPanel
        text={state.selected_question_data?.text ?? ''}
        imageUrl={
          path
            ? /^https?:\/\//i.test(path)
              ? path
              : `${FILE_URL}/${path.replace(/^\/+/, '')}`
            : ''
        }
        actions={
          <QuestionActions
            onCheck={() => dispatch(checkAnswers())}
            onGiveUp={() => setDefeatOpen(true)}
          />
        }
      >
        {state.exam_data?.is_enable_max_question_attempts && (
          <Typography sx={{ mt: 1.5 }} color="text.secondary">
            Осталось попыток: {state.remaining_attempts}
          </Typography>
        )}
      </QuestionPanel>
      <UiComebackLaterDialog
        isOpenComeBackLaterDialog={defeatOpen}
        setIsOpenComeBackLaterDialog={setDefeatOpen}
      />
    </Box>
  );
}
