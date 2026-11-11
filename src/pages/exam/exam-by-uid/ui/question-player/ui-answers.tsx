import React from 'react';
import { PaperProps } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { FILE_URL } from '../../../../../settings';
import type { RootState } from '../../../../../app/redux-store/RootStore';
import { changeSelectedAnswersId } from '../../redux-store/ExamPlayerSlice';
import AnswerList from '../../../../../shared/question-player/ui/answer-list';

export default function UIAnswers(props: PaperProps) {
  const dispatch = useDispatch();
  const answers = useSelector(
    (state: RootState) =>
      state.examPlayer.selected_question_data?.usertests_answer,
  );
  const selected = useSelector(
    (state: RootState) => state.examPlayer.selected_answers_id,
  );
  return (
    <AnswerList
      {...props}
      answers={(answers ?? []).map(answer => {
        const path = answer.usertests_answerimage?.image;
        return {
          id: answer.id,
          text: answer.text ?? '',
          isImageDeleted: answer.is_image_deleted,
          imageUrl: path
            ? /^https?:\/\//i.test(path)
              ? path
              : `${FILE_URL}/${path.replace(/^\/+/, '')}`
            : '',
        };
      })}
      selectedIds={selected}
      onSelectAnswer={id => dispatch(changeSelectedAnswersId(id))}
    />
  );
}
