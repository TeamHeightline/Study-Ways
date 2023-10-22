import {observer} from "mobx-react";
import React from 'react';
import TreeSelect from "antd/es/tree-select";
import Paper from "@mui/material/Paper";
import {Stack} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import ClearIcon from '@mui/icons-material/Clear';
import {AISObject} from "../Store/AISearch";


const AIThemeFilter = observer(() => {

    return (
        <Paper elevation={0} sx={{width: "100%", backgroundColor: "transparent"}}>
            <Stack direction={"row"}>
                <TreeSelect
                    treeDataSimpleMode={true}
                    treeData={AISObject.connectedThemesForSelector}
                    value={AISObject.cardConnectedTheme}
                    onChange={(data) => {
                        console.log(data)
                        AISObject.cardConnectedTheme = data
                    }}
                    disabled={!AISObject.connectedThemesHasBeenLoaded}
                    placeholder={'Выбирите тему карточки'}
                    style={{width: '100%'}}
                    size={'large'}/>
                <IconButton
                    disabled={!AISObject.cardConnectedTheme}
                    onClick={() => AISObject.cardConnectedTheme = undefined}>
                    <ClearIcon/>
                </IconButton>
            </Stack>
        </Paper>
    )
})
export default AIThemeFilter;
