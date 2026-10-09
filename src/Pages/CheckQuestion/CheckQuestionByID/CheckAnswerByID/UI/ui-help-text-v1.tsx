import { observer } from 'mobx-react';
import React from 'react';
import { PaperProps } from '@mui/material';
import { CheckAnswerByIdStore } from '../Store/check-answer-by-id-store';
import ReviewHelpText from './review-help-text';

interface UIHelpTextProps extends PaperProps {
  answerStore: CheckAnswerByIdStore;
}

const UIHelpTextV1 = observer(({ answerStore, ...props }: UIHelpTextProps) => (
  <ReviewHelpText
    {...props}
    level={1}
    text={answerStore.answerData?.helpTextv1}
  />
));

export default UIHelpTextV1;
