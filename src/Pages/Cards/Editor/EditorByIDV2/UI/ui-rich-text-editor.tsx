import React from 'react';
import { observer } from 'mobx-react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CESObject } from '../Store/CardEditorStorage';
export const UiRichTextEditor = observer(() => (
  <div className="sw-cedit-rich-text">
    <div className="sw-cedit-rich-text-frame">
      <CKEditor
        key={CESObject.getField('id', '')}
        editor={ClassicEditor}
        config={{
          placeholder:
            'Напишите описание карточки, добавьте примеры и пояснения…',
        }}
        data={
          CESObject.getField('text', '') === 'Описание карточки'
            ? ''
            : CESObject.getField('text', '')
        }
        onChange={(_, editor) =>
          CESObject.changeFieldByValue('text', editor.getData())
        }
      />
    </div>
    <p className="sw-cedit-field-note">
      Вставить текст без исходного оформления: Ctrl + Shift + V.
    </p>
  </div>
));
