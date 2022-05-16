import {observer} from "mobx-react";
import React, {useEffect} from 'react';
import {SSSSObject} from "../Store/SimpleSelfStatisticStorage";
import {ShowStatisticTable} from "../../Statistic/V2/show-statistic-for-selected-questions/ShowStatisticTable";
import {UserStorage} from "../../../../Store/UserStore/UserStore";
import {Pagination, Stack} from "@mui/material";
import {LogInNotification} from "../../../PublicPages/Notifications/LogInNotification";

interface ISelfStatisticPageProps extends React.HTMLAttributes<HTMLDivElement> {

}

export const SelfStatisticPage = observer(({...props}: ISelfStatisticPageProps) => {
    useEffect(() => SSSSObject.loadSelfStatistic(), [UserStorage.isLogin])
    return (
        <div {...props}>
            <LogInNotification/>
            <ShowStatisticTable stickyHeader={true}
                                pageChanger={
                                    <Stack alignItems={"center"}>
                                        <Pagination
                                            page={SSSSObject.activePage}
                                            count={SSSSObject.maxPages}
                                            onChange={SSSSObject.changeActivePage}/>
                                    </Stack>}
                                attempt_id_array={SSSSObject.statisticIDForShow}/>
        </div>
    )
})