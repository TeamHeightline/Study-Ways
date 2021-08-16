import React, {useState} from 'react'
import Editor from 'ckeditor5-custom-build/build/ckeditor';
import { CKEditor } from '@ckeditor/ckeditor5-react'
import './RichTextPreviewStyle.css'

export default function RichTextPreview({initialText, onChange}: any,){
    // console.log("update in text editor")
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
        <CKEditor
            editor={ Editor }
            data={localText}
            style={{maxHeight: "440px"}}
            disabled={true}
            config={ {} }

            onChange={ ( event, editor ) => {
                textHandler(editor.getData());
            } }

        />
    )
}

