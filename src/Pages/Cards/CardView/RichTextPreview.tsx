import React from 'react'
import {CKEditor} from '@ckeditor/ckeditor5-react'
import './RichTextPreviewStyle.css'
import ThemeStoreObject from '../../../global-theme'
import {CssBaseline} from "@mui/material";
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';


export default function RichTextPreview({text,}: any,) {
    return (
        <>{text && <>
            <CssBaseline/>
            <CKEditor
                editor={ClassicEditor}
                data={text}
                disabled={true}
                config={{
                    fontColor: ThemeStoreObject.textColor,
                    borderColor: ThemeStoreObject.backgroundColor,
                    // plugins: [ Paragraph, Bold, Italic, Essentials ],
                    toolbar: [],

                }}
            />
        </>}
        </>
    )
}

