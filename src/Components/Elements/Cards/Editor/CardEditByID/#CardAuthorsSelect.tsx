import React from 'react'
import InputLabel from "@material-ui/core/InputLabel";
import {FormControl, MenuItem, Select} from "@material-ui/core";
import Input from "@material-ui/core/Input";
import {sort} from "fast-sort";

export default function CardAuthorsSelect({cardAuthorId, changeCardAuthorId, autoSave, MenuProps, authorData,
                                              cardID}: any) {
    console.log("update id card authors")
    return(
        <div>
            <FormControl fullWidth>
                <InputLabel id="question-author-multiple">Авторы карточки</InputLabel>
                <Select
                    labelId="demo-mutiple-name-label"
                    id="demo-mutiple-name"
                    multiple
                    value={cardAuthorId}
                    onChange={(e: any) => {
                        autoSave()
                        changeCardAuthorId(e.target.value)
                    }}
                    input={<Input/>}
                    MenuProps={MenuProps}
                >
                    {cardID && authorData ?
                        sort(authorData.me.cardauthorSet)
                        .desc((author: any) => author.id)
                        .map((author: any) => (
                        <MenuItem key={author.name + author.id} value={author.id}>
                            {author.name}
                        </MenuItem>
                    )) : null}

                </Select>
            </FormControl>
        </div>
    )
}