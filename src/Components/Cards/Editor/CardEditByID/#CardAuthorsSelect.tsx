import React from 'react'
import InputLabel from "@material-ui/core/InputLabel";
import {FormControl, MenuItem, Select} from "@material-ui/core";
import Input from "@material-ui/core/Input";

export default function CardAuthorsSelect({cardAuthorId, changeCardAuthorId, autoSave, MenuProps, authorData,
                                              cardID}: any) {
    console.log("update id card authors")
    return(
        <div>
            <FormControl className='col-9 ml-2'>
                <InputLabel id="question-author-multiple">Авторы вопросов</InputLabel>
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
                    {cardID && authorData ? authorData.me.cardauthorSet.map((author: any) => (
                        <MenuItem key={author.name + author.id} value={author.id}>
                            {author.name}
                        </MenuItem>
                    )) : null}

                </Select>
            </FormControl>
        </div>
    )
}