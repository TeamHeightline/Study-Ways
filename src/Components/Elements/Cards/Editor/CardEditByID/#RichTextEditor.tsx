import React, {useState} from 'react'
import Editor from 'ckeditor5-custom-build/build/ckeditor';
import { CKEditor } from '@ckeditor/ckeditor5-react'
import {Card, Typography} from "@mui/material";
import '../../CardView/RichTextPreviewStyle.css'
export default function RichTextEditor({initialText, onChange}: any,){
    const [localText, setLocalText] = useState(initialText? initialText: null)
    const [autoSave, setAutoSave] = useState<any>()

    const textHandler = (e)=>{
        e ? setLocalText(e): null
        clearTimeout(autoSave)
        setAutoSave(setTimeout(()  =>{
            onChange(e)
        }, 1000))
    }
    // console.log(initialText)
    return(
        <div className="editor">
            <Card style={{borderColor: "#2296F3", color: "black"}} variant="outlined">
                <CKEditor
                    editor={ Editor }
                    data={localText}
                    style={{maxHeight: "440px",}}
                    config={ {
                        fontColor: "#ffffff",
                        // plugins: [ Paragraph, Bold, Italic, Essentials ],
                        toolbar: [ 'bold', 'italic', 'fontSize', 'FontColor', 'link','|', 'undo', 'redo', '|',
                            'MathType', ],
                        //Можно добавить химические формулы 'ChemType'
                        //и специальные символы 'specialCharacters',

                    } }

                    onChange={ ( event, editor ) => {
                        textHandler(editor.getData());
                    } }

                />

            </Card>
            <Typography variant="caption">
                Если вы вставляете текст и он имеет странный цвет, используйте не Ctrl+V, а Ctrl+Shift+V
            </Typography>
        </div>
    )
}

