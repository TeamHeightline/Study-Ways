import {observer} from "mobx-react";
import React from "react";
import {FormControlLabel, Switch} from "@mui/material";
import {StatisticPageStoreObject} from "../../../Store/PrivateStorage/EditorsPage/StatisticStore/StatisticPageStore";

export const QSShowAllOrMyQSFlag = observer(() =>{
    return(
        <div>
            <FormControlLabel
                control={
                    <Switch
                        color="primary"
                        checked={StatisticPageStoreObject.showOnlyMyQSStatistic}
                        onChange={() => StatisticPageStoreObject.changeShowOnlyMyQSStatistic()}
                    />
                }
                label="Показать только мои серии вопросов"
            />
        </div>
    )
})