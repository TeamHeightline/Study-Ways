import React from 'react'
import Editor from 'ckeditor5-custom-build/build/ckeditor'
import {CKEditor} from '@ckeditor/ckeditor5-react'
// import './RichTextPreviewStyle.css'
import ThemeStoreObject from '../../../../global-theme'
import {CssBaseline} from "@mui/material";


export default function RichTextPreview({text,}: any,) {

    return (
        <>
            <CssBaseline/>
            <CKEditor
                // className="ckeditor"
                editor={Editor}
                data={text}
                // style={{height: 496}}
                disabled={true}
                config={{
                    fontColor: ThemeStoreObject.textColor,
                    borderColor: ThemeStoreObject.backgroundColor,
                    // plugins: [ Paragraph, Bold, Italic, Essentials ],
                    toolbar: [],

                }}
            />
        </>
    )
}

