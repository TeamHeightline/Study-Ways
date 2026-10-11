import { observer } from 'mobx-react';
import React, { useEffect, useState } from 'react';
import { PaperProps } from '@mui/material';
import { CheckAnswerByIdStore } from '../Store/check-answer-by-id-store';
import CheckAnswerUI from './ui';
import { ReviewAnswer } from '../../../../Question/question-read-api';
import { runInAction } from 'mobx';

interface ICheckAnswerIndexProps extends PaperProps {
  answerID: string;
  answerIndex: number;
  answerData: ReviewAnswer;
}

const CheckAnswerIndex = observer(
  ({ answerID, answerIndex, answerData, ...props }: ICheckAnswerIndexProps) => {
    const [answerStore] = useState(() => new CheckAnswerByIdStore(answerID));
    useEffect(() => {
      runInAction(() => {
        answerStore.answerID = answerID;
        answerStore.answerData = answerData;
        answerStore.isAnswerDataLoaded = true;
      });
    }, [answerData, answerID, answerStore]);
    return (
      <CheckAnswerUI
        {...props}
        answerStore={answerStore}
        answerIndex={answerIndex}
      />
    );
  },
);

export default CheckAnswerIndex;
