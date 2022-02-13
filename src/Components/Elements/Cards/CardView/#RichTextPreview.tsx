import React from 'react'
import Editor from 'ckeditor5-custom-build/build/ckeditor'
import {CKEditor} from '@ckeditor/ckeditor5-react'
import './RichTextPreviewStyle.css'


export default function RichTextPreview({text,}: any,){

    return(
        <>
            <CKEditor
                className="ckeditor"
                editor={ Editor }
                data={text}
                style={{height: 496}}
                disabled={true}
                config={ {
                    fontColor: "#ffffff",
                    // plugins: [ Paragraph, Bold, Italic, Essentials ],
                    toolbar: [  ],
                    //Можно добавить химические формулы 'ChemType'
                    //и специальные символы 'specialCharacters',

                } }
            />
        </>
    )
}

