import {observer} from "mobx-react";
import React from 'react';
import {Stack, TextField, Typography} from "@mui/material";
import {CESObject} from "../Store/CardEditorStorage";

interface ITestInCardProps extends React.HTMLAttributes<HTMLDivElement> {

}

export const UiTestInCard = observer(({...props}: ITestInCardProps) => {
    return (
        <div {...props}>
            <Stack direction={"column"}>
                <TextField
                    type="number"
                    label="ID вопроса внутри карточки"
                    variant={"outlined"}
                    value={CESObject.getField("test_in_card_id", '')}
                    onChange={CESObject.changeField("test_in_card_id")}
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
