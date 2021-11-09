import React from 'react'
import Editor from 'ckeditor5-custom-build/build/ckeditor';
import { CKEditor } from '@ckeditor/ckeditor5-react'
import './RichTextPreviewStyle.css'

export default function RichTextPreview({text,}: any,){

    return(
        <>
            {/*<CssBaseline />*/}
            <CKEditor
                className="ckeditor"
                editor={ Editor }
                data={text}
                style={{maxHeight: "440px"}}
                disabled={true}
                config={ {} }
            />
        </>
    )
}

