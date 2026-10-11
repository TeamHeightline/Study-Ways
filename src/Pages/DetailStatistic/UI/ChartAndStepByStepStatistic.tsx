import { observer } from 'mobx-react';
import { useUserSession } from '../../../Shared/Store/UserStore/user-session';
import React from 'react';
import { Collapse } from '@mui/material';
import { StatisticChart } from './StatisticChart';
import { StepByStepStatistic } from './StepByStepStatistic';
import { DSSObjectType, rowType } from '../Store/DetailStatisticStoreByID';

export const ChartAndStepByStepStatistic = observer(
  ({
    row,
    isOpen,
    statisticByIDStore,
  }: {
    row: rowType;
    isOpen: boolean;
    statisticByIDStore: DSSObjectType;
  }) => {
    const session = useUserSession();
    return (
      <Collapse in={isOpen} unmountOnExit>
        <div className="sw-results-detail">
          <StatisticChart row={row} />
          {['ADMIN', 'TEACHER'].includes(session.role) && (
            <StepByStepStatistic
              row={row}
              statisticByIDStore={statisticByIDStore}
            />
          )}
        </div>
      </Collapse>
    );
  },
);
