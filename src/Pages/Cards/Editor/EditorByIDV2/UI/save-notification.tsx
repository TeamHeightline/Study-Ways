import {observer} from "mobx-react";
import {Alert} from "@mui/material";
import React from "react";
import {CESObject} from "../Store/CardEditorStorage";

export const SaveNotification = observer(() => {
    return <Alert
        // sx={{height: 50}}
        variant="outlined"
        severity={CESObject.stateOfSave ? "success" : "info"}>
        {CESObject.stateOfSave ? "Сохранено" : "Сохранение"}
    </Alert>

})
