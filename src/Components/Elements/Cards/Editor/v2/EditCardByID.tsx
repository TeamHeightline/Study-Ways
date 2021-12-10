import {observer} from "mobx-react";
import {CESObject} from "../../../../../Store/PrivateStorage/EditorsPage/CardEditorPage/CardEditorStorage";
import React, {useEffect} from "react";
import {FormControl, Grid, TextField} from "@mui/material";
import {UserStorage} from "../../../../../Store/UserStore/UserStore";

export const EditCardByID = observer(({id= 1826}) => {
    useEffect(() => CESObject.loadCardDataFromServer(id), [id, UserStorage.userAccessLevel])
    console.log(CESObject.card_object)
    return(
        <div>
            {CESObject?.cardTitle}
                <div>
                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                            <TextField
                                label="Название карточки / Заголовок карточки"
                                fullWidth
                                multiline
                                variant="filled"
                                maxRows={3}
                                value={CESObject.getField("title", "")}
                                onChange={CESObject.changeCardField("title")}
                            />
                        </FormControl>
                    </Grid>
                </div>
        </div>
    )
})