import React from "react";
import {TreeSelect} from "antd";
import {Spinner} from "react-bootstrap";
const { SHOW_CHILD } = TreeSelect;
export default function ThemeTree({dataForThemeTreeView, cardSelectedThemeID, cardSelectedThemeIDHandle }: any){
    const tProps = {
        treeDataSimpleMode: true,
        treeData: dataForThemeTreeView,
        value: cardSelectedThemeID,
        onChange: cardSelectedThemeIDHandle,
        treeCheckable: true,

        showCheckedStrategy: SHOW_CHILD,
        placeholder: 'Выбирите тему карточки',
        style: {
            width: '100%',
        },
    };
    console.log("update id theme tree")
    // filter: 'invert(1)'
    return(
        <div>
            {dataForThemeTreeView? <TreeSelect {...tProps}/>: <Spinner animation="border" variant="success"/>}
        </div>
    )
}