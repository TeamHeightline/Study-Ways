import {observer} from "mobx-react";
import React from 'react';
import {StatisticPageStoreObject} from "../../../Store/PrivateStorage/EditorsPage/StatisticStore/StatisticPageStore";
import {Button} from "@mui/material";

export const StatisticGoToMainPage = observer(() =>{
    return(
        <div>
            <Button
                fullWidth
                variant="outlined" color="primary"
                onClick={() => {StatisticPageStoreObject.changeIsOpenQuestion(false)}}>
                Назад
            </Button>
        </div>
    )
})