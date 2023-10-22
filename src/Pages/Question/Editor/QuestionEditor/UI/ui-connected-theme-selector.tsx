import {observer} from "mobx-react";
import React, {useEffect} from "react";
import {QuestionEditorStorage} from "../Store/QuestionEditorStorage";
import TreeSelect from "antd/es/tree-select";

const {SHOW_CHILD} = TreeSelect;

const ConnectedThemeSelector = observer((props) => {
    useEffect(() =>{QuestionEditorStorage.loadAllConnectedThemes()}, [])
    const tProps = {
        treeDataSimpleMode: true,
        treeData: QuestionEditorStorage.connectedThemesForSelector,
        value: QuestionEditorStorage.selectedConnectedTheme,
        onChange: ((e: string) => {
            QuestionEditorStorage.selectedConnectedTheme =  e
        }),
        disabled: !QuestionEditorStorage.isAllConnectedThemesLoaded,
        showSearch: false,
        showCheckedStrategy: SHOW_CHILD,
        placeholder: 'Выбирите тему вопроса',
        // bordered: true,
        style: {
            width: '100%',
        },
    };

    return (
        <div>
            <TreeSelect {...tProps} size={'large'}/>
        </div>
    )
})

export default ConnectedThemeSelector