import {observer} from "mobx-react";
import React from 'react';
import {Card, Typography} from "@mui/material";
import { CKEditor } from '@ckeditor/ckeditor5-react'
import Editor from 'ckeditor5-custom-build/build/ckeditor';
import {CESObject} from "../../../../../Store/PrivateStorage/EditorsPage/CardEditorPage/CardEditorStorage";
import './RichTextEditStyle.css'

interface IRichTextEditorProps extends React.HTMLAttributes<HTMLDivElement>{
    
}
export const RichTextEditor = observer(({...props}: IRichTextEditorProps) =>{
    return(
        <div {...props}>
            <Card style={{borderColor: "#2296F3", color: "black"}} variant="outlined">
                <CKEditor
                    editor={ Editor }
                    data={CESObject.getField("text", "") == "Описание карточки"? "" :
                        CESObject.getField("text", "")}
                    onChange={ ( event, editor ) => {
                        CESObject.changeFieldByValue('text', editor.getData())
                    } }
                />
            </Card>
            <Typography variant="caption">
                Если вы вставляете текст и он имеет странный цвет, используйте не Ctrl+V, а Ctrl+Shift+V
            </Typography>
        </div>
    )
})
