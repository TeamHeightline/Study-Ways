import React from 'react'
import Editor from 'ckeditor5-custom-build/build/ckeditor';
import { CKEditor } from '@ckeditor/ckeditor5-react'
import './RichTextPreviewStyle.css'
import {Typography} from "@mui/material";

export default function RichTextPreview({text,}: any,){

    return(
        <>
            {/*<CssBaseline />*/}
            <Typography>
                <CKEditor
                    className="ckeditor"
                    editor={ Editor }
                    data={text}
                    style={{maxHeight: "440px"}}
                    disabled={true}
                    config={ {} }
                />
            </Typography>
        </>
    )
}

