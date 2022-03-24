import React from 'react'
import {CKEditor} from '@ckeditor/ckeditor5-react'
import './RichTextPreviewStyle.css'
import ThemeStoreObject from '../../../../global-theme'
import {CssBaseline} from "@mui/material";
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';


export default function RichTextPreview({text,}: any,) {

    return (
        <>
            <CssBaseline/>
            <CKEditor
                // className="ckeditor"
                editor={ClassicEditor}
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

