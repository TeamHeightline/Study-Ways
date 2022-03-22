import {observer} from "mobx-react";
import React from 'react';
import {TreeSelect} from "antd";
import {CESObject} from "../../../../../Store/PrivateStorage/EditorsPage/CardEditorPage/CardEditorStorage";

interface IConnectedThemeSelectorProps extends React.HTMLAttributes<HTMLDivElement> {

}

const {SHOW_CHILD} = TreeSelect;

export const ConnectedThemeSelector = observer(({...props}: IConnectedThemeSelectorProps) => {
    const tProps = {
        treeDataSimpleMode: true,
        treeData: CESObject.connectedThemesForSelector,
        value: CESObject.getField("connectedTheme", []),
        onChange: ((e: string[]) => {
            CESObject.changeFieldByValue("connectedTheme", e)
        }),
        multiple: true,
        showSearch: false,
        showCheckedStrategy: SHOW_CHILD,
        disabled: !CESObject.isAllConnectedThemesLoaded,
        placeholder: 'Выбирите тему карточки',
        // bordered: true,
        style: {
            width: '100%',
        },
    };
    // if(!CESObject.isAllConnectedThemesLoaded){
    //     return (
    //         <Stack alignItems={"center"}>
    //             <CircularProgress/>
    //         </Stack>
    //     )
    // }
    return (
        <div {...props}>
            <TreeSelect {...tProps} size={'large'}/>
        </div>
    )
})