import {observer} from "mobx-react";
import React from 'react';
import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import {CSSObject} from "../Store/CardSelectorStore";

interface IContentTypeProps extends React.HTMLAttributes<HTMLDivElement>{

}
export const ContentType = observer(({...props}: IContentTypeProps) =>{
    return(
        <FormControl fullWidth>
            <InputLabel>Тип карточки:</InputLabel>
            <Select
                fullWidth
                style={{width: "100%", maxWidth: 600,}}
                label="Тип карточки:"
                value={CSSObject.contentType}
                onChange={CSSObject.changeContentType}
            >
                <MenuItem value={"undefined"}>Не выбран</MenuItem>
                <MenuItem value={"A_0"}>YouTube</MenuItem>
                <MenuItem value={"A_1"}>Внешний ресурс</MenuItem>
                <MenuItem value={"A_2"}>Изображение</MenuItem>
            </Select>
        </FormControl>
    )
})