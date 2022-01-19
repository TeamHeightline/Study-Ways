import {observer} from "mobx-react";
import React from 'react';
import {Stack, TextField, Typography} from "@mui/material";
import {CESObject} from "../../../../../Store/PrivateStorage/EditorsPage/CardEditorPage/CardEditorStorage";

interface ITestInCardProps extends React.HTMLAttributes<HTMLDivElement>{

}
export const TestInCard = observer(({...props}: ITestInCardProps) =>{
    return(
        <div {...props}>
            <Stack direction={"column"}>
                <TextField
                    type="number"
                    label="ID вопроса внутри карточки"
                    variant={"outlined"}
                    value={CESObject.getField("testInCard", '')}
                    onChange={CESObject.changeField("testInCard")}
                />
                {CESObject.testInCardData &&
                    <div>
                        <Typography variant={"h6"}>
                            ID: {CESObject?.testInCardData?.id}
                        </Typography>
                        <Typography variant={"body1"}>
                            Текст: {CESObject?.testInCardData?.text}
                        </Typography>
                    </div>}
            </Stack>
        </div>
    )
})