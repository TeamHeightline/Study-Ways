import {observer} from "mobx-react";
import React from 'react';
import TreeSelect from "antd/es/tree-select";
import {CESObject} from "../../../../../Store/PrivateStorage/EditorsPage/CardEditorPage/CardEditorStorage";
import {CircularProgress, Stack} from "@mui/material";

interface IConnectedThemeSelectorProps extends React.HTMLAttributes<HTMLDivElement>{

}
const { SHOW_CHILD } = TreeSelect;

export const ConnectedThemeSelector = observer(({...props}: IConnectedThemeSelectorProps) =>{
    const tProps = {
            treeDataSimpleMode: true,
            treeData: CESObject.connectedThemesForSelector,
            value: CESObject.getField("connectedTheme", []),
            onChange:((e: string[])=>{CESObject.changeFieldByValue("connectedTheme", e)}),
            multiple: true,
            showSearch: false,
            showCheckedStrategy: SHOW_CHILD,
            placeholder: 'Выбирите тему карточки',
            // bordered: true,
            style: {
            width: '100%',
            },
    };
    if(!CESObject.isAllConnectedThemesLoaded){
        return (
            <Stack alignItems={"center"}>
                <CircularProgress/>
            </Stack>
        )
    }
    return(
        <div {...props}>
            <TreeSelect {...tProps} size={'large'}/>
        </div>
    )
})