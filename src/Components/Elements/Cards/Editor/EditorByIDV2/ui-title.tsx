import {observer} from "mobx-react";
import React from 'react';
import {FormControl, TextField} from "@mui/material";
import {CESObject} from "../../../../../Store/PrivateStorage/EditorsPage/CardEditorPage/CardEditorStorage";

interface ITitleProps extends React.HTMLAttributes<HTMLDivElement> {

}

export const UiTitle = observer(({...props}: ITitleProps) => {
    return (
        <div {...props}>
            <FormControl fullWidth>
                <TextField
                    label="Название карточки / Заголовок карточки"
                    fullWidth
                    multiline
                    variant="filled"
                    maxRows={3}
                    value={CESObject.getField("title", "") == "Название карточки по умолчанию" ?
                        "" :
                        CESObject.getField("title", "")}
                    onChange={CESObject.changeField("title")}
                />
            </FormControl>
        </div>
    )
})
