import React from 'react';
import type { BoxProps } from '@mui/material';
import type { QuestionPlayerStore } from '../store/QuestionPlayerStore';
import AnswerList from '../../../../shared/question-player/ui/answer-list';
import UIUserMarkAndActionButtons from './ui-user-mark-and-action-buttons';

interface Props extends BoxProps {
  questionStore: QuestionPlayerStore;
}
export default function UIAnswers({ questionStore, ...props }: Props) {
  return (
    <AnswerList
      {...props}
      answers={questionStore.answersArray.map(answer => ({
        id: answer.id,
        text: answer.answerText,
        imageUrl: answer.answerImageUrl,
        isImageDeleted: answer.isImageDeleted,
      }))}
      selectedIds={questionStore.selectedAnswers}
      onSelectAnswer={id => questionStore.selectAnswerHandleChange(id)}
      renderFooter={(answer, index) => (
        <UIUserMarkAndActionButtons
          questionStore={questionStore}
          answerIndex={index}
        />
      )}
    />
  );
}
