import React from 'react'
import Editor from 'ckeditor5-custom-build/build/ckeditor';
import { CKEditor } from '@ckeditor/ckeditor5-react'
import '../styleForCKEditor.css'

export default function RichTextEditor({cardMainText, cardMainTextHandle}: any){
    console.log("update in text editor")
    return(
        <CKEditor
            editor={ Editor }
            data={cardMainText}
            style={{maxHeight: "440px"}}
            config={ {
                // plugins: [ Paragraph, Bold, Italic, Essentials ],
                toolbar: [ 'bold', 'italic', 'fontSize', 'link','|', 'undo', 'redo', '|',
                    'MathType', ],
                //Можно добавить химические формулы 'ChemType'
                //и специальные символы 'specialCharacters',

            } }
            onReady={ editor => {
                // You can store the "editor" and use when it is needed.
                // console.log( 'Editor1 is ready to use!', editor );
            } }
            onChange={ ( event, editor ) => {
                cardMainTextHandle(editor.getData());
            } }

        />
    )
}

