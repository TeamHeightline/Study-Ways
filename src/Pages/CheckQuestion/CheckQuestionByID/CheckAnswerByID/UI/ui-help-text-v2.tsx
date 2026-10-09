import { observer } from 'mobx-react';
import React from 'react';
import { PaperProps } from '@mui/material';
import { CheckAnswerByIdStore } from '../Store/check-answer-by-id-store';
import ReviewHelpText from './review-help-text';

interface UIHelpTextProps extends PaperProps {
  answerStore: CheckAnswerByIdStore;
}

const UIHelpTextV2 = observer(({ answerStore, ...props }: UIHelpTextProps) => (
  <ReviewHelpText
    {...props}
    level={2}
    text={answerStore.answerData?.helpTextv2}
  />
));

export default UIHelpTextV2;
