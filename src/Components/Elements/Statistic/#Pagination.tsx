import {observer} from "mobx-react";
import React from 'react';
import {Pagination} from "@mui/material";
import {
    StatisticByQuestionDataStoreObject
} from "../../../Store/PrivateStorage/EditorsPage/StatisticStore/StatisticByQuestionsDataStore";

interface IPaginationProps extends React.HTMLAttributes<HTMLDivElement>{

}
export const PaginationForStatistic = observer(({...props}: IPaginationProps) =>{
    return(
        <div {...props}>
            <Pagination
                page={StatisticByQuestionDataStoreObject.activePage}
                onChange={StatisticByQuestionDataStoreObject.changeActivePage}
                count={StatisticByQuestionDataStoreObject.NumberOfPages} />
        </div>
    )
})