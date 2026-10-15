import React from 'react';
import { TextField } from '@mui/material';
import { useCardEditor } from '../model/use-card-editor';
import { ImageUpload } from '../../../../../shared/uploads/ImageUpload';

export const UiUploadImage = () => {
  const editor = useCardEditor();
  return (
    <div className="sw-cedit-image-material">
      <ImageUpload
        key={String(editor.draft?.id)}
        imageUrl={editor.imageUrl}
        disabled={!editor.draft?.id}
        onUpload={file => editor.handleUploadImage(file)}
      />
      {(editor.draft.card_content_type ?? 0) === 1 && (
        <TextField
          fullWidth
          label="Ссылка на внешний ресурс"
          placeholder="https://…"
          value={editor.draft.site_url ?? ''}
          onChange={editor.changeField('site_url')}
          error={!editor.isUrlValid}
          helperText={
            !editor.isUrlValid
              ? 'Введите полную ссылку, начинающуюся с https:// или http://'
              : undefined
          }
        />
      )}
    </div>
  );
};
