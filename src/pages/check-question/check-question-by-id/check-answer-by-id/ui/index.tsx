import React from 'react';
import { PaperProps } from '@mui/material';
import { useAnswerReview } from '../store/check-answer-by-id-store';
import CheckAnswerUI from './ui';
import { ReviewAnswer } from '../../../../question/question-read-api';
interface ICheckAnswerIndexProps extends PaperProps {
  answerID: string;
  answerIndex: number;
  answerData: ReviewAnswer;
}
const CheckAnswerIndex = ({
  answerID,
  answerIndex,
  answerData,
  ...props
}: ICheckAnswerIndexProps) => {
  const answerStore = useAnswerReview(answerID, answerData);
  return (
    <CheckAnswerUI
      {...props}
      answerStore={answerStore}
      answerIndex={answerIndex}
    />
  );
};
export default CheckAnswerIndex;
