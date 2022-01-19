import {observer} from "mobx-react";
import React from 'react';
import {Stack, TextField, Typography} from "@mui/material";
import {CESObject} from "../../../../../Store/PrivateStorage/EditorsPage/CardEditorPage/CardEditorStorage";

interface ITestBeforeCardProps extends React.HTMLAttributes<HTMLDivElement>{

}
export const TestBeforeCard = observer(({...props}: ITestBeforeCardProps) =>{

    return(
        <div {...props}>
            <Stack direction={"column"}>
                <TextField
                    type="number"
                    label="ID вопроса перед карточкой"
                    variant={"outlined"}
                    value={CESObject.getField("testBeforeCard", '')}
                    onChange={CESObject.changeField("testBeforeCard")}
                />
                {CESObject.testBeforeCardData &&
                    <div>
                        <Typography variant={"h6"}>
                            ID: {CESObject?.testBeforeCardData?.id}
                        </Typography>
                        <Typography variant={"body1"}>
                            Текст: {CESObject?.testBeforeCardData?.text}
                        </Typography>
                    </div>}
            </Stack>
        </div>
    )
})