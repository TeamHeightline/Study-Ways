import {observer} from "mobx-react";
import React, {useEffect} from 'react';
import {SSSSObject} from "../Store/SimpleSelfStatisticStorage";
import {ShowStatisticTable} from "../../Statistic/V2/show-statistic-for-selected-questions/ShowStatisticTable";
import { UserStorage } from "../../../../Store/UserStore/UserStore";
import {Alert, Stack} from "@mui/material";
import {isMobileHook} from "../../../../CustomHooks/isMobileHook";

interface ISelfStatisticPageProps extends React.HTMLAttributes<HTMLDivElement>{

}
export const SelfStatisticPage = observer(({...props}: ISelfStatisticPageProps) =>{
    const isMobile = isMobileHook()
    useEffect(()=> SSSSObject.loadSelfStatistic(), [UserStorage.isLogin])
    if(!UserStorage.isLogin){
        return (
            <Stack alignItems={"center"} sx={{pt: isMobile? 0: 2}}>
                <Alert severity={"info"} variant={"filled"}>
                    Для отображения личной статистики необходимо войти в систему
                </Alert>
            </Stack>
        )
    }
    return(
        <div {...props}>
            <ShowStatisticTable stickyHeader={true}
                                attempt_id_array={SSSSObject.statisticIDForShow}/>
        </div>
    )
})