import {observer} from "mobx-react";
import {CESObject} from "../../../../../Store/PrivateStorage/EditorsPage/CardEditorPage/CardEditorStorage";
import React, {useEffect} from "react";
import {toJS} from "mobx";
import {FormControl, Grid, TextField} from "@mui/material";

export const EditCardByID = observer(({id= 1826}) => {
    useEffect(() => CESObject.setID(id), [id])
    return(
        <div>
            {CESObject?.cardTitle}
            <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                    {/*<InputLabel id="question-author-multiple">Название карточки / Заголовок карточки</InputLabel>*/}
                    <TextField
                        label="Название карточки / Заголовок карточки"
                        fullWidth
                        multiline
                        variant="filled"
                        maxRows={3}
                        // style={{width: "50vw"}}
                        value={CESObject?.cardTitle}
                        onChange={CESObject.changeCardField("title")}
                    />
                </FormControl>
            </Grid>
        </div>
    )
})