import {observer} from "mobx-react";
import React from 'react';
import {PaperProps} from "@mui/material/Paper/Paper";
import {IconButton, Paper, Tooltip} from "@mui/material";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import {CESObject} from "../Store/CardEditorStorage";


interface IUICreateButtonProps extends PaperProps {

}

const UICreateButton = observer(({...props}: IUICreateButtonProps) => {
    return (
        <Paper elevation={0} {...props}>
            <Tooltip title={"Создать копию"}>
                <IconButton
                    disabled={!CESObject.stateOfSave}
                    onClick={() => CESObject.openCopyCardDialog()}>
                    <ContentCopyIcon/>
                </IconButton>
            </Tooltip>
        </Paper>
    )
})

export default UICreateButton
