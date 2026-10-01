import { observer } from 'mobx-react';
import React, { useEffect } from 'react';
import { Stack } from '@mui/material';
import { ExamMode } from './ExamMode';

import { UserName } from './UserName';
import { AfterTime } from './AfterTime';
import { SpecificQuestion } from './SpecificQuestion';
import { SASObject } from '../Store/SelectAttemptStore';
import { isMobileHook } from '../../../../../../Shared/CustomHooks/isMobileHook';

interface ISelectorsProps extends React.HTMLAttributes<HTMLDivElement> {
  selectedQuestions: number[];
}

export const Selectors = observer(
  ({ selectedQuestions, ...props }: ISelectorsProps) => {
    useEffect(() => { SASObject.onlyInQs = false; SASObject.changeSelectedSQ(undefined); }, []);
    useEffect(() => {
      SASObject.changeSelectedQuestions(selectedQuestions);
    }, [selectedQuestions]);
    return (
      <div {...props} className="sw-statistics-filters">
        <div className="sw-statistics-fields"><UserName /><SpecificQuestion /><AfterTime /></div>
        <div className="sw-statistics-options"><ExamMode /><span>Результаты обновляются автоматически</span></div>
      </div>
    );
  },
);
