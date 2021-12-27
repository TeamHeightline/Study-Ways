import {observer} from "mobx-react";
import React from 'react';
import InputLabel from "@mui/material/InputLabel";
import {FormControl, MenuItem, Select} from "@mui/material";
import {CESObject} from "../../../../../Store/PrivateStorage/EditorsPage/CardEditorPage/CardEditorStorage";

interface IAuthorSelectorProps extends React.HTMLAttributes<HTMLDivElement>{

}

export const AuthorSelector = observer(({...props}: IAuthorSelectorProps) =>{
    return(
        <div {...props}>
            <FormControl fullWidth>
                <InputLabel>Авторы карточки</InputLabel>
                <Select
                    multiple
                    variant={"outlined"}
                    value={CESObject.getField("author", [])}
                    onChange={CESObject.changeField("author")}
                    label={"Авторы карточки"}
                >
                    {CESObject?.allMyCardAuthors
                        ?.map((author) => (
                                <MenuItem key={author.name + author.id} value={String(author.id)}>
                                    {author.name}
                                </MenuItem>
                            ))}

                </Select>
            </FormControl>
        </div>
    )
})