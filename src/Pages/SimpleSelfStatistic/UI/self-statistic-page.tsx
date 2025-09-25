import { observer } from "mobx-react";
import React, { useEffect } from "react";
import { SSSSObject } from "../Store/SimpleSelfStatisticStorage";
import { ShowStatisticTable } from "../../Statistic/V2/show-statistic-for-selected-questions/ShowStatisticTable";
import { UserStorage } from "../../../Shared/Store/UserStore/UserStore";
import { Pagination, Stack } from "@mui/material";
import { RequireLogInAlert } from "../../../App/SharedComponents/Notifications/RequireLogInAlert";

type ISelfStatisticPageProps = React.HTMLAttributes<HTMLDivElement>;

export const SelfStatisticPage = observer(
  ({ ...props }: ISelfStatisticPageProps) => {
    useEffect(() => SSSSObject.loadSelfStatistic(), [UserStorage.isLogin]);
    return (
      <div {...props}>
        <RequireLogInAlert />
        <ShowStatisticTable
          stickyHeader={true}
          pageChanger={
            <Stack alignItems={"center"}>
              <Pagination
                page={SSSSObject.activePage}
                count={SSSSObject.maxPages}
                onChange={SSSSObject.changeActivePage}
              />
            </Stack>
          }
          attempt_id_array={SSSSObject.statisticIDForShow}
        />
      </div>
    );
  },
);
