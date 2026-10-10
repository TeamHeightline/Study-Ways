import { ThemeManulNote } from '../../../Shared/Theme/ThemeManulNote';
import { observer } from 'mobx-react';
import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import {
  Alert,
  Button,
  CircularProgress,
  Pagination,
  Stack,
} from '@mui/material';
import { ShowStatisticTable } from '../../Statistic/V2/show-statistic-for-selected-questions/ShowStatisticTable';
import { UserStorage } from '../../../Shared/Store/UserStore/UserStore';
import { RequireLogInAlert } from '../../../App/SharedComponents/Notifications/RequireLogInAlert';
import { useGetSelfStatisticPageQuery } from '../Store/self-statistic-api';

type ISelfStatisticPageProps = React.HTMLAttributes<HTMLDivElement>;

function LoadingStatistic() {
  return (
    <Stack alignItems="center" sx={{ py: 4 }} role="status">
      <CircularProgress aria-label="Загрузка статистики" />
    </Stack>
  );
}

function SelfStatisticResults({ userId }: { userId: number }) {
  const [page, setPage] = useState(1);
  const { currentData, isFetching, isError, refetch } =
    useGetSelfStatisticPageQuery(
      { page, userId },
      { refetchOnMountOrArgChange: true },
    );

  if (isError) {
    return (
      <Alert
        severity="error"
        action={<Button onClick={() => refetch()}>Повторить</Button>}
      >
        Не удалось загрузить вашу статистику.
      </Alert>
    );
  }

  if (!currentData) return <LoadingStatistic />;

  if (!currentData.ids.length) {
    return <Alert severity="info">У вас пока нет сохранённых попыток.</Alert>;
  }

  return (
    <div aria-busy={isFetching}>
      <ShowStatisticTable
        stickyHeader
        pageChanger={
          currentData.numPages > 1 ? (
            <Stack alignItems="center" sx={{ py: 2 }}>
              <Pagination
                page={currentData.activePage}
                count={currentData.numPages}
                onChange={(_, nextPage) => setPage(nextPage)}
                disabled={isFetching}
              />
            </Stack>
          ) : undefined
        }
        attempt_id_array={currentData.ids}
      />
    </div>
  );
}

export const SelfStatisticPage = observer(
  ({ ...props }: ISelfStatisticPageProps) => {
    const { isLoading, isAuthenticated } = useAuth0();
    // Shared authentication is still backed by UserStorage. It becomes ready
    // after AppHook installs the authenticated Axios interceptor.
    const userId = UserStorage.user_data?.id;

    return (
      <div {...props}>
        <ThemeManulNote context="results" />
        {isLoading || (isAuthenticated && !userId) ? (
          <LoadingStatistic />
        ) : !isAuthenticated ? (
          <RequireLogInAlert requireShow />
        ) : (
          <SelfStatisticResults key={userId} userId={userId!} />
        )}
      </div>
    );
  },
);
