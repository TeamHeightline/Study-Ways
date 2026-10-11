import { observer } from 'mobx-react';
import React, { Fragment, useEffect, useState } from 'react';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { DetailStatisticStoreByID } from '../Store/DetailStatisticStoreByID';
import { Avatar, Button, Skeleton, Stack, Tooltip } from '@mui/material';
import { useGetAttemptQuery } from '../Store/attempt-api';
import { UserStorage } from '../../../Shared/Store/UserStore/UserStore';
import { runInAction } from 'mobx';
import { ChartAndStepByStepStatistic } from './ChartAndStepByStepStatistic';

interface IDetailStatisticByIDProps extends React.HTMLAttributes<HTMLDivElement> {
  attempt_id: number;
}

export const DetailStatisticByID = observer(
  ({ attempt_id }: IDetailStatisticByIDProps) => {
    const [statisticByIDStore] = useState(
      () => new DetailStatisticStoreByID(attempt_id),
    );
    const query = useGetAttemptQuery({
      id: attempt_id,
      userId: UserStorage.user_data?.id,
    });
    useEffect(() => {
      runInAction(() => {
        statisticByIDStore.changeAttemptID(attempt_id);
        statisticByIDStore.attemptData = query.currentData;
        statisticByIDStore.questionText = query.currentData?.questionText || '';
        statisticByIDStore.loadError = query.isError;
        statisticByIDStore.reload = query.refetch;
      });
    }, [
      attempt_id,
      query.currentData,
      query.isError,
      query.refetch,
      statisticByIDStore,
    ]);
    const textColor = statisticByIDStore.dataForRow.questionHasBeenCompleted
      ? ''
      : 'warning.main';
    if (statisticByIDStore.loadError) {
      return (
        <TableRow>
          <TableCell colSpan={10}>
            <Stack
              direction="row"
              spacing={2}
              role="alert"
              sx={{
                alignItems: 'center',
              }}
            >
              <span>Не удалось загрузить результат №{attempt_id}.</span>
              <Button
                onClick={() => statisticByIDStore.loadAttemptFromServer()}
              >
                Повторить
              </Button>
            </Stack>
          </TableCell>
        </TableRow>
      );
    }
    if (statisticByIDStore.loadingData) {
      return (
        <TableRow>
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(indexForKey => (
            <TableCell key={`${indexForKey}SkeletonKey`}>
              <Skeleton variant="text" width={'100%'} height={'100%'} />
            </TableCell>
          ))}
        </TableRow>
      );
    }

    return (
      <Fragment>
        <TableRow>
          <TableCell>
            <IconButton
              aria-label="expand statisticByIDStore.dataForRow"
              size="small"
              onClick={() => statisticByIDStore.changeIsOpenDetailStatistic()}
            >
              {statisticByIDStore.isOpenDetailStatistic ? (
                <KeyboardArrowUpIcon />
              ) : (
                <KeyboardArrowDownIcon />
              )}
            </IconButton>
          </TableCell>
          <TableCell
            component="th"
            scope="statisticByIDStore.dataForRow"
            sx={{ color: textColor }}
          >
            {statisticByIDStore.dataForRow.username}
          </TableCell>
          <TableCell sx={{ color: textColor }}>
            <Stack
              direction={'row'}
              spacing={2}
              sx={{
                justifyContent: 'end',
              }}
            >
              <div>{statisticByIDStore.dataForRow.profileName}</div>
              {statisticByIDStore.dataForRow.avatarSrc && (
                <Avatar
                  src={statisticByIDStore.dataForRow.avatarSrc}
                  sx={{ width: 24, height: 24 }}
                />
              )}
            </Stack>
          </TableCell>

          <Tooltip
            disableInteractive
            title={statisticByIDStore.dataForRow.QuestionTextForStatistic}
          >
            <TableCell sx={{ color: textColor }}>
              {statisticByIDStore.dataForRow.questionID}
            </TableCell>
          </Tooltip>

          <TableCell sx={{ color: textColor }}>
            {statisticByIDStore.dataForRow.numberOfPasses}
          </TableCell>
          <TableCell sx={{ color: textColor }}>
            {statisticByIDStore.dataForRow.arithmeticMeanNumberOfWrongAnswer}
          </TableCell>
          <TableCell sx={{ color: textColor }}>
            {statisticByIDStore.dataForRow.numberOfWrongAnswers}
          </TableCell>
          <TableCell sx={{ color: textColor }}>
            {
              statisticByIDStore.dataForRow
                .arithmeticMeanNumberOfAnswersPointsDivideToMaxPoints
            }
          </TableCell>
          <TableCell sx={{ color: textColor }}>
            {statisticByIDStore.dataForRow.SumOFPointsWithNewMethod}
          </TableCell>
          <TableCell sx={{ color: textColor }}>
            {statisticByIDStore.dataForRow.FormattedCreatedAt}
          </TableCell>
        </TableRow>
        {statisticByIDStore.isOpenDetailStatistic && (
          <TableRow>
            <TableCell colSpan={10} sx={{ paddingBottom: 0, paddingTop: 0 }}>
              <ChartAndStepByStepStatistic
                statisticByIDStore={statisticByIDStore}
                row={statisticByIDStore.dataForRow}
                isOpen={true}
              />
            </TableCell>
          </TableRow>
        )}
      </Fragment>
    );
  },
);
