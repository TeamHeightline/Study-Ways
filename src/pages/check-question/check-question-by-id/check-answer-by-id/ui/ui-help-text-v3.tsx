import React from 'react';
import { PaperProps } from '@mui/material';
import { CheckAnswerByIdStore } from '../store/check-answer-by-id-store';
import ReviewHelpText from './review-help-text';
interface UIHelpTextProps extends PaperProps {
  answerStore: CheckAnswerByIdStore;
}
const UIHelpTextV3 = ({ answerStore, ...props }: UIHelpTextProps) => (
  <ReviewHelpText
    {...props}
    level={3}
    text={answerStore.answerData?.helpTextv3}
  />
);
export default UIHelpTextV3;
